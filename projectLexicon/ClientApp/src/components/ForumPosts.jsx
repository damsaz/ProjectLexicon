import React, { useState, useEffect } from "react";
import { Button, Container, ListGroup, ListGroupItem } from "reactstrap";
import { ForumPostWrap } from "./ForumPostWrap";
import { ForumPostNew } from './ForumPostNew';
import { apiGet } from '../api/api'
import { ErrBase } from './ErrBase'

export function ForumPosts(props) {
  const {forumThread, onClose} = props;
  const [items, setItems] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
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
      setItems(data.result);
    }
    fetchData(forumThread);
  }, []);

  function doShowNew() {
    setShowNew(true)
  }
  function doHideNew() {
    setShowNew(false)
  }
  function handleNewPostAdded(newPost) {
    const newItems = [...items]
    newItems.push(newPost)
    setItems(newItems)
  }

  return (
    <>
      <Container>
        <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
        {showNew && (
          <div className="popupBase">
            <div className="popupForm">
              <ForumPostNew
                forumThread={forumThread}
                quotedPost={null}
                quotedText=''
                onClose={doHideNew}
                onAdd={handleNewPostAdded}
              />
            </div>
          </div>
        )}         
        <Button onClick={onClose}>Show threads</Button>
        <h1>{forumThread.name}</h1>
        <hr></hr>
        {items.length == 0 && (
          <h2>This thread is still empty.
            Click "New Post" to add the first post to this thread
          </h2>
        )}
        <ListGroup>
          {items.map((item) => (
            <ListGroupItem id={item.id}>
              <ForumPostWrap
                item={item}
                forumThread={forumThread}
                onAdd={handleNewPostAdded}
              />
              <hr></hr>
            </ListGroupItem>
          ))}
        </ListGroup>
        <hr></hr>
        <div className="bottonBox">
          <Button onClick={doShowNew}>New Post</Button>
        </div>
      </Container>
    </>
  );
}
