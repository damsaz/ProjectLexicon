import React, { useState } from "react";
import { Button, Container, ListGroup, ListGroupItem } from "reactstrap";
import { ForumPostWrap } from "./ForumPostWrap";
import { ForumPostNew } from "./ForumPostNew";
import { apiGet } from "../api/api";
import { ErrBase } from "./ErrBase";
import { ForumThreadDetail } from "./ForumThreadDetail";
import { ForumPostWrapNew } from "./ForumPostWrapNew";

export function ForumThread(props) {
  const {
    forumCategory,
    forumThread,
    onNewThread,
    onClose,
    isAdmin,
    isUser,
    userName,
  } = props;

  const [activeThread, setActiveThread] = useState({ id: 0 });
  const [items, setItems] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [quotedPostId, setQuotedPostId] = useState(0);
  const [showArchived, setShowArchived] = useState(false);

  function setNewThread() {
    setActiveThread({ id: 0 });
    setItems([]);
  }

  async function fetchData(forumThread) {
    const params = {
      filter: "",
      userId: "",
      forumThreadId: forumThread.id,
      tagIds: [],
      // tagIds: [1,2,3],
    };
    let data = await apiGet("forumpost/List", params);
    if (data.errText) {
      return setErrmsg(data.errText);
    }
    setActiveThread(forumThread);
    setItems(data.result);
  }

  //function prepareItems(fetchedItems) {
  //  // 1. Flatten / add user name
  //  const itemsWithName = fetchedItems.map(x => ({ ...x.forumPost, userName: x.userName }))
  //  // 2. Add quoted post to each item if exists
  //  // const itemsWithQuotes = itemsWithName.map(item => ({ ...x, quotedPost; items.find(x => x.id === item.quotedPostId) }))
  //  return itemsWithName;
  //}

  if (activeThread.id !== forumThread.id) {
    if (forumThread.id === 0) setNewThread();
    else fetchData(forumThread);
  }

  function doShowNew() {
    setShowNew(true);
  }
  function doHideNew() {
    setShowNew(false);
  }
  function handleNewPostAdded(newPost) {
    const newItems = [...items];
    newItems.push(newPost);
    setItems(newItems);
  }
  function handlePostChanged(newPost) {
    const newItems = [...items];
    const ix = newItems.findIndex((i) => i.id === newPost.id);
    if (ix < 0) return;
    newItems[ix] = newPost;
    setItems(newItems);
  }

  // https://stackoverflow.com/questions/64931025/how-to-scroll-to-particular-id-in-react-js
  function scrollToPost(postId) {
    setQuotedPostId(postId);
    const elem = document.getElementById(`post-${postId}`);
    if (!elem) return setErrmsg("Quoted post not found");
    window.scrollTo(0, findPosition(elem));
  }

  function findPosition(obj) {
    var currenttop = 0;
    if (obj.offsetParent) {
      do {
        currenttop += obj.offsetTop;
      } while ((obj = obj.offsetParent));
      return [currenttop];
    }
  }

  function nofunction() {}

  function handleAddThread(newThread) {
    setActiveThread(newThread);
    onNewThread(newThread);
  }

  const existingTreadLoaded =
    activeThread.id && activeThread.id === forumThread.id;
  const existingTreadLoading =
    activeThread.id && activeThread.id !== forumThread.id;

  return (
    <>
      <Container>
        <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
        {/*<Button onClick={onClose}>Show threads</Button>*/}
        <div>
          <h1>{forumThread ? forumThread.name : "New Thread"}</h1>
          {isAdmin && !showArchived && (
            <Button onClick={() => setShowArchived(true)}>Show Archived</Button>
          )}
          {isAdmin && showArchived && (
            <Button onClick={() => setShowArchived(false)}>
              Hide Archived
            </Button>
          )}
        </div>
        <hr></hr>
        {activeThread.id !== forumThread.id && <h2>Loading...</h2>}

        {!activeThread.id && forumCategory && (
          <ForumThreadDetail
            onAdd={handleAddThread}
            onChange={nofunction}
            onDelete={nofunction}
            handleClose={nofunction}
            popupId={0}
            thread={activeThread}
            forumCategoryId={forumCategory.id}
          />
        )}
        {false && existingTreadLoaded && items.length === 0 && (
          <h2>
            This thread is still empty. Click "New Post" to add the first post
            to this thread
          </h2>
        )}
        {existingTreadLoaded && (
          <>
            <ListGroup>
              <>
                {items
                  .filter((i) => showArchived || i.archivedDate === null)
                  .map((item) => (
                    <ListGroupItem
                      id={`post-${item.id}`}
                      key={`post-${item.id}`}
                    >
                      <ForumPostWrap
                        item={item}
                        forumThread={forumThread}
                        onAdd={handleNewPostAdded}
                        onChange={handlePostChanged}
                        onFindPost={scrollToPost}
                        isQuotedPost={item.id === quotedPostId}
                        isUser={isUser}
                        isAdmin={isAdmin}
                      />
                    </ListGroupItem>
                  ))}
                {isUser && (
                  <ForumPostWrapNew
                    forumThread={forumThread}
                    onAdd={handleNewPostAdded}
                    isUser={isUser}
                    quotedPost={null}
                    quotedText={""}
                  />
                )}
              </>
            </ListGroup>
            <hr></hr>
            <div className="bottonBox">
              {showNew && (
                <div className="popupBase">
                  <div className="popupForm">
                    <ForumPostNew
                      forumThread={forumThread}
                      quotedPost={null}
                      quotedText=""
                      onAdd={handleNewPostAdded}
                      isUser={isUser}
                      isAdmin={isAdmin}
                      quotedDate={""}
                    />
                  </div>
                </div>
              )}
              {false && isUser && <Button onClick={doShowNew}>New Post</Button>}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
