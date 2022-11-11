import React, { useState } from "react";
import { Button, Input } from "reactstrap";
import { apiPost } from "../api/api";
import { ErrBase } from "./ErrBase";
import "./Forum.css";

export function ForumPostWrapNew(props) {
  const { forumThread, onAdd, isUser, quotedPost, quotedText } = props;

  const [text, setText] = useState("");
  const [errmsg, setErrmsg] = useState("");
  console.log(`ForumPostWrapNew.text=${text}`);

  async function savePost() {
    if (text.trim() === "")
      return setErrmsg("Write some text before sending the new post");
    const params = {
      forumThreadId: forumThread.id,
      tagIds: [],
      text,
      quotedText,
      quotedPostId: quotedPost ? quotedPost.id : 0,
    };

    const newItem = await apiPost("forumpost/Add", params);
    if (newItem.errText) {
      return setErrmsg(newItem.errText);
    }
    setText("");
    if (newItem.result) {
      onAdd(newItem.result);
    }
  }

  function handleValueChanged(e) {
    setText(e.target.value);
  }

  return (
    isUser && (
      <>
        <div className="bordered">
          <p className="small-text">Add new post</p>
          <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
          <hr />
          <Input
            type="textarea"
            name="text"
            id="text"
            value={text}
            placeholder="Write text to your new post"
            onChange={handleValueChanged}
          />
          <hr />
          <div className="buttonBox">
            <Button
              disabled={text.trim() === ""}
              className="formButton"
              onClick={savePost}
            >
              Submit
            </Button>
          </div>
        </div>
      </>
    )
  );
}
