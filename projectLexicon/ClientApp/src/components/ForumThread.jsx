import React, { useState } from "react";
import { Button, Container, ListGroup, ListGroupItem } from "reactstrap";
import { ForumPostWrap } from "./ForumPostWrap";
import { apiGet } from "../api/api";
import { ErrBase } from "./ErrBase";
import { ForumThreadDetail } from "./ForumThreadDetail";
import { ForumPostWrapNew } from "./ForumPostWrapNew";
import "./Forum.css";

export function ForumThread(props) {
  const { forumThread, isAdmin, isUser, userName } = props;

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activeThread, setActiveThread] = useState({ id: 0 });
  const [showArchived, setShowArchived] = useState(false);

  const [items, setItems] = useState([]);
  const [quotedPostId, setQuotedPostId] = useState(0);
  const [errmsg, setErrmsg] = useState("");

  // === Init

  if (
    !loading &&
    (activeThread === null || activeThread.id !== forumThread.id)
  ) {
    setLoading(true);
    setLoaded(false);
    setItems([]);
    fetchPosts(forumThread);
  }

  async function fetchPosts(forumThread) {
    const params = {
      filter: "",
      userId: "",
      forumThreadId: forumThread.id,
      tagIds: [],
      // tagIds: [1,2,3],
    };
    let data = await apiGet("forumpost/List", params);
    if (data.errText) {
      setErrmsg(data.errText);
      setLoading(false);
      return;
    }
    setActiveThread(forumThread);
    setItems(data.result);
    setLoading(false);
    setLoaded(true);
  }

  // === Handle post added/changed/deleted

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

  // === Scroll to quoted post

  function scrollToPost(postId) {
    setQuotedPostId(postId);
    // https://stackoverflow.com/questions/64931025/how-to-scroll-to-particular-id-in-react-js
    const elem = document.getElementById(`post-${postId}`);
    if (!elem) return setErrmsg("Quoted post not found. It may have been deleted?");
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

  // Handle delete thread

  /*
  function handleDeleteRequest() {
    setShowDeletePopup(true);
  }
  function handleDeletePopupCancel() {
    setShowDeletePopup(false);
  }
  async function handleDeletePopupOk() {
    setShowDeletePopup(false);
    const params = {
      id: forumThread?.id || 0,
    };

    const changedItem = await apiPost("forumthread/Delete", params);
    if (changedItem.errText) {
      return setErrmsg(changedItem.errText);
    }
    if (changedItem.result) {
      onChange(changedItem.result);
    }
  }
*/
  return (
    <>
      <Container>
        <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />

        {/*=== Header ===*/}

        <div>
          <h1>{forumThread ? forumThread.name : "..."}</h1>
          {isAdmin && (
            <div className="buttonBox">
              {!showArchived && (
                <Button onClick={() => setShowArchived(true)}>
                  Show Archived
                </Button>
              )}
              {showArchived && (
                <Button onClick={() => setShowArchived(false)}>
                  Hide Archived
                </Button>
              )}
              {/*
                <Button onClick={() => setShowArchived(false)}>
                  Hide Archived
                </Button>
              */}
            </div>
          )}
        </div>
        <hr></hr>

        {!loaded && loading && <h2>Loading...</h2>}
        {!loaded && !loading && <h2>An error occurred loading the page</h2>}

        {/*=== Empty thread, set message for guest (that can't add new post) ===*/}

        {loaded && !isUser && items.length === 0 && (
          <h2>There are no posts yet in this thread.</h2>
        )}

        {/*=== List of posts ===*/}

        {loaded && (
          <>
            <ListGroup>
              <>
                {/* == Posts from database == */}
                {items
                  .filter((item) => showArchived || item.archivedDate === null)
                  .map((item) => (
                    <ListGroupItem
                      id={`post-${item.id}`}
                      key={`post-${item.id}`}
                    >
                      <div className="grayish">
                        <ForumPostWrap key={`post2-${item.id}`}
                          item={item}
                          forumThread={forumThread}
                          onAdd={handleNewPostAdded}
                          onChange={handlePostChanged}
                          onFindPost={scrollToPost}
                          isQuotedPost={item.id === quotedPostId}
                          isUser={isUser}
                          isAdmin={isAdmin}
                        />
                      </div>
                    </ListGroupItem>
                  ))}

                {/* == Add new post (no quote) == */}
                {isUser && (
                  <ListGroupItem
                    id={`post-add`}
                    key={`post-add`}
                    className="grayish"
                  >
                    <ForumPostWrapNew
                      forumThread={forumThread}
                      onAdd={handleNewPostAdded}
                      isUser={isUser}
                      quotedPost={null}
                      quotedText={""}
                    />
                  </ListGroupItem>
                )}
              </>
            </ListGroup>
          </>
        )}
      </Container>
    </>
  );
}
