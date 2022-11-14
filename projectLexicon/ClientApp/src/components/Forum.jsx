import React, { useState, useEffect } from "react";
import { NavItem, NavLink, Nav, Badge } from "reactstrap";
import authService from "./api-authorization/AuthorizeService";
import { UserRoles } from "./api-authorization/ApiAuthorizationConstants";
import { apiGet } from "../api/api";
import { ErrBase } from "./ErrBase";
import { ForumThread } from "./ForumThread";
import { ForumThreadNew } from "./ForumThreadNew";
import { ForumCategoryDetail } from "./ForumCategoryDetail";
import "./Forum.css";

export function Forum() {
  const [userNameServer, setUserNameServer] = useState("...");
  const [userRoleServer, setUserRoleServer] = useState("...");

  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeThread, setActiveThread] = useState(null);

  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [newThreadCategory, setNewThreadCategory] = useState(null);

  const [errmsg, setErrmsg] = useState("");

  // Load categories

  useEffect(() => {
    async function fetchCategories() {
      const params = {};
      let data = await apiGet("forumcategory/List", params);
      if (data.errText) {
        return setErrmsg(data.errText);
      }
      const newItems = data.result.map((item) => ({
        ...item,
        open: false,
        threadsFetched: false,
        threads: [],
      }));
      setItems(newItems);
      setLoaded(true);
    }
    fetchCategories();
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
      setItems(newItems);
    }
    asyncToggleCategory();
  }

  // Show thread & posts in content sections

  function showThread(thread) {
    setNewThreadCategory(null);
    setActiveCategory(null);
    setActiveThread(thread);
  }

  function hideThread() {
    setActiveThread(null);
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
      setItems(changedItems);
      setActiveThread(thread);
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

  function handleCategoryAdded(newCategory) {
    const newItems = [...items];
    newCategory.threads = [];
    newItems.push(newCategory);
    setItems(newItems);
  }

  function handleCategoryChanged(changedCategory) {
    const newItems = [...items];
    const ix = newItems.findIndex((x) => x.id === changedCategory.id);
    if (ix < 0) return setErrmsg("Category not found");
    changedCategory.threads = newItems[ix].threads;
    newItems[ix] = changedCategory;
    setItems(newItems);
  }

  function handleCategoryDeleted(id) {
    const newItems = items.filter((x) => x.id !== id);
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
              {userNameServer}
              <br />({userRoleServer})
            </p>

            {!loaded && <p>Loading...</p>}

            {/*== Category/thread tree ==*/}

            {loaded &&
              items.map((category) => (
                <React.Fragment key={-category.id}>
                  {/*== Edit-category-name popup ==*/}
                  {showCategoryPopup && activeCategory?.id === category.id && (
                    <div className="popupBase">
                      <div className="popupForm">
                        <ForumCategoryDetail
                          handleClose={handleCategoryClose}
                          popupId={activeCategory.id}
                          category={activeCategory}
                          onAdd={handleCategoryAdded}
                          onChange={handleCategoryChanged}
                          onDelete={handleCategoryDeleted}
                        />
                      </div>
                    </div>
                  )}

                  {/*== Category name, if admin with edit button ==*/}
                  <NavItem key={category.id}>
                    {true && (
                      <NavLink
                        key="a"
                        href="#"
                        onClick={() => toggleCategory(category)}
                      >
                        {category.name}
                        {isAdmin && (
                          <>
                            {" "}
                            <Badge
                              className="clickable"
                              onClick={(e) => showEditCategory(e, category)}
                            >
                              Edit
                            </Badge>
                          </>
                        )}
                      </NavLink>
                    )}
                  </NavItem>

                  {/*== List of threads for category ==*/}
                  {category.open &&
                    category.threads.map((thread) => (
                      <NavItem key={`${category.id}-${thread.id}`}>
                        <NavLink href="#" onClick={() => showThread(thread)}>
                          {`- ${thread.name}`}
                        </NavLink>
                      </NavItem>
                    ))}

                  {/*== 'Add-thread' button ==*/}
                  {isUser && category.open && (
                    <NavItem key={`${category.id}-new}`}>
                      <NavLink href="#" onClick={() => showNewThread(category)}>
                        {"  "} <Badge className="clickable">New Thread</Badge>
                      </NavLink>
                    </NavItem>
                  )}
                </React.Fragment>
              ))}

            {/*== If there are no caegories, and not is admin, show text ==*/}

            {loaded && !isAdmin && items.length === 0 && (
              <p>
                There are no categories in this forum yet, please ask an admin
                to add some categories
              </p>
            )}

            {/*== If is admin show new category button ==*/}

            {loaded && isAdmin && (
              <>
                {showCategoryPopup && activeCategory?.id === 0 && (
                  <div className="popupBase">
                    <div className="popupForm">
                      <ForumCategoryDetail
                        handleClose={handleCategoryClose}
                        popupId={0}
                        onAdd={handleCategoryAdded}
                        onChange={handleCategoryChanged}
                        onDelete={handleCategoryDeleted}
                        category={{}}
                      />
                    </div>
                  </div>
                )}
                <NavItem key={`category-new}`}>
                  <NavLink href="#" onClick={() => showAddCategory()}>
                    <Badge className="clickable">Add Category</Badge>
                  </NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </div>

        <div className="col" key="col-2">
          {!activeThread && !newThreadCategory && (
            <h4>Select category and thread in the side bar</h4>
          )}
          {activeThread && !newThreadCategory && (
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
            <ForumThreadNew
              className="forumPostsContainer"
              forumThread={{ id: 0 }}
              onClose={hideThread}
              forumCategoryId={newThreadCategory.id}
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
