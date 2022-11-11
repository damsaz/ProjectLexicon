import React, { useState, useEffect } from "react";
import { NavItem, NavLink, Nav, Badge } from "reactstrap";
import authService from "./api-authorization/AuthorizeService";
import { UserRoles } from "./api-authorization/ApiAuthorizationConstants";
import { apiGet } from "../api/api";
import { ErrBase } from "./ErrBase";
import { ForumThread } from "./ForumThread";
import { ForumCategoryDetail } from "./ForumCategoryDetail";
import "./Forum.css";

export function Forum() {
  const [userNameServer, setUserNameServer] = useState("...");
  const [userRoleLocal, setUserRoleLocal] = useState("...");
  const [userRoleServer, setUserRoleServer] = useState("...");

  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState(null);
  const [activeThread, setThread] = useState(null);
  const [errmsg, setErrmsg] = useState("");

  const [newThreadCategory, setNewThreadCategory] = useState(null);

  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Load categories

  useEffect(() => {
    async function fetchData() {
      const params = {};
      let data = await apiGet("forumcategory/List", params);
      if (data.errText) {
        return setErrmsg(data.errText);
      }
      const newItems = data.result.map((i) => ({
        ...i,
        open: false,
        threadsFetched: false,
        threads: [],
      }));
      checkIds(newItems);
      setItems(newItems);
      setLoaded(true);
    }
    fetchData();
  }, []);

  // Show/hide list of threads for category

  function toggleCategory(category) {
    if (isEditCategory) {
      isEditCategory = false;
      return;
    }

    async function asyncToggleCategory() {
      const newItems = [...items];
      const item = newItems.find((i) => i.id === category.id);
      if (!item)
        return setErrmsg("Oops... this category does not seem to exist");
      item.open = !item.open;
      if (item.open && !item.threadsFetched) {
        const params = {
          forumCategoryId: item.id,
        };
        let data = await apiGet("forumthread/List", params);
        if (data.errText) {
          return setErrmsg(data.errText);
        }
        item.threads = data.result;
        item.threadsFetched = true;
      }
      checkIds(newItems);
      setItems(newItems);
    }
    asyncToggleCategory();
  }

  // Show thread & posts in content sections

  function showThread(thread) {
    setThread(thread);
  }

  function hideThread() {
    setThread(null);
  }

  // Handle Roles
  // (NB the authService sometimes is out of sync, for this we ask the server)

  useEffect(() => {
    checkUserRole();
    const interval = setInterval(() => {
      checkUserRole();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function checkUserRole() {
    const isLoggedIn = await authService.isAuthenticated();
    const isAdmin = await authService.hasRole(UserRoles.Administrator); // Beware, only seems to check for admin
    if (isLoggedIn) {
      setUserRoleLocal(isAdmin ? "Admin" : "User");
    } else {
      setUserRoleLocal("Guest");
    }
    let data = await apiGet("forumpost/UserInfo", {});
    if (data.errText) {
      return setErrmsg(data.errText);
    }
    setUserNameServer(data.result.userName || "Guest");
    setUserRoleServer(data.result.userRole || "Guest");
  }

  const isAdmin = ["administrator", "supervisor"].includes(userRoleServer);
  const isUser = ["administrator", "supervisor", "user"].includes(
    userRoleServer
  );

  // Handle Add Threads

  function showNewThread(category) {
    setNewThreadCategory(category);
  }

  function handleThreadAdd(thread) {
    setNewThreadCategory(null);
    const changedItems = [...items];
    const category = changedItems.find((c) => c.id === thread.forumCategoryId);
    if (category) {
      category.threads.push(thread);
      window.alert(changedItems.map((x) => x.id).join(","));
      checkIds(changedItems);
      setItems(changedItems);
      setThread(thread);
    }
  }

  function checkIds(items) {
    console.log(items.map((x) => x.id).join(","));
    const missingIdNames = items.filter((x) => !x.id).map((x) => x.name);
    if (missingIdNames.length) {
      window.alert(missingIdNames.join(","));
    }
  }

  // Handle Category Popup

  let isEditCategory = false;
  function showEditCategory(e, category) {
    setActiveCategory(category);
    setShowCategoryPopup(true);
    isEditCategory = true;
    // stopPropagation seems to crash the page... can't see why though???
    // e.stopPropagation();
  }

  function showAddCategory() {
    setActiveCategory({ id: 0 });
    setShowCategoryPopup(true);
  }

  function handleCategoryClose() {
    setActiveCategory(null);
    setShowCategoryPopup(false);
  }

  function handleCategoryAdd(newCategory) {
    const newItems = [...items];
    newCategory.threads = [];
    newItems.push(newCategory);
    checkIds(newItems);
    setItems(newItems);
  }

  function handleCategoryChange(changedCategory) {
    const newItems = [...items];
    const ix = newItems.findIndex((x) => x.id === changedCategory.id);
    if (ix < 0) return setErrmsg("Category not found");
    changedCategory.threads = newItems[ix].threads;
    newItems[ix] = changedCategory;
    checkIds(newItems);
    setItems(newItems);
  }

  function handleCategoryDelete(id) {
    const newItems = items.filter((x) => x.id !== id);
    checkIds(newItems);
    setItems(newItems);
  }

  // Render all items

  return (
    <div className="container">
      <div className="row" key="row-1">
        <div className="col navcol" key="col-1">
          <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
          <Nav vertical navbar>
            <p>
              {userNameServer}<br />({userRoleServer})
            </p>

            {!loaded && <p>Loading...</p>}

            {loaded &&
              items.map((category) => (
                <React.Fragment key={-category.id}>
                  {showCategoryPopup && activeCategory?.id === category.id && (
                    <div className="popupBase">
                      <div className="popupForm">
                        <ForumCategoryDetail
                          handleClose={handleCategoryClose}
                          popupId={activeCategory.id}
                          category={activeCategory}
                          onAdd={handleCategoryAdd}
                          onChange={handleCategoryChange}
                          onDelete={handleCategoryDelete}
                        />
                      </div>
                    </div>
                  )}
                  <NavItem key={category.id}>
                    {true && (
                      <NavLink
                        key="a"
                        href="#"
                        onClick={() => toggleCategory(category)}
                      >
                        {category.name}
                        {isAdmin && (
                          <Badge onClick={(e) => showEditCategory(e, category)}>
                            Edit
                          </Badge>
                        )}
                      </NavLink>
                    )}
                  </NavItem>

                  {category.open &&
                    category.threads.map((thread) => (
                      <NavItem key={`${category.id}-${thread.id}`}>
                        <NavLink href="#" onClick={() => showThread(thread)}>
                          {`- ${thread.name}`}
                        </NavLink>
                      </NavItem>
                    ))}

                  {isAdmin && category.open && (
                    <NavItem key={`${category.id}-new}`}>
                      <NavLink href="#" onClick={() => showNewThread(category)}>
                        {`+`} <Badge>New Thread</Badge>
                      </NavLink>
                    </NavItem>
                  )}
                </React.Fragment>
              ))}

            {loaded && !isAdmin && items.length === 0 && (
              <p>
                There are no categories in this forum yet, please ask an admin
                to add some categories
              </p>
            )}

            {loaded && isAdmin && (
              <>
                {showCategoryPopup && activeCategory?.id === 0 && (
                  <div className="popupBase">
                    <div className="popupForm">
                      <ForumCategoryDetail
                        handleClose={handleCategoryClose}
                        popupId={0}
                        onAdd={handleCategoryAdd}
                        onChange={handleCategoryChange}
                        onDelete={handleCategoryDelete}
                        category={{}}
                      />
                    </div>
                  </div>
                )}
                <NavItem key={`category-new}`}>
                  <NavLink href="#" onClick={() => showAddCategory()}>
                        <Badge>Add Category</Badge>
                  </NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </div>
        <div className="col" key="col-2">
          {!activeThread &&
            !newThreadCategory &&
            "Select category and thread in the side bar"}
          {activeThread && (
            <ForumThread
              className="forumPostsContainer"
              forumThread={activeThread}
              onClose={hideThread}
              userName={userNameServer}
              isUser={isUser}
              isAdmin={isAdmin}
            />
          )}
          {newThreadCategory && (
            <ForumThread
              className="forumPostsContainer"
              forumThread={{ id: 0 }}
              onClose={hideThread}
              forumCategory={newThreadCategory}
              onNewThread={handleThreadAdd}
              userName={userNameServer}
              isUser={isUser}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
}
