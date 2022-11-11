import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { apiPost } from '../api/api'
import { ErrBase } from './ErrBase'
import './Forum.css'

export function ForumPostNew(props) {
  const { forumThread, quotedPost, quotedText, quotedDate, onClose, onAdd } = props;
  const [text, setText] = useState("");
  const [errmsg, setErrmsg] = useState("");

  function doClose() {
    onClose();
  }

  async function savePost() {
    const params = {
      forumThreadId: forumThread.id,
      tagIds: [],
      text,
      quotedText,
      quotedPostId: quotedPost ? quotedPost.id : 0
    }

    const newItem = await apiPost("forumpost/Add", params);
    if (newItem.errText) {
      return setErrmsg(newItem.errText);
    }
    if (newItem.result) {
      onAdd(newItem.result);
    }
    doClose();
  }

  function handleValueChanged(e) {
    setText(e.target.value)
    console.log(`text set to ${e.target.value}`)
  }

  const quotedUserName = quotedPost && quotedPost.user.email || "Unknown"

  return (
    <>
      <Form>
        <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
        <FormGroup>
          {quotedPost &&
            <>
            <p>Answer to {quotedUserName} at {quotedDate || 'sometime'}
              </p>
              {quotedText && <blockquote className="small-text">{quotedText}</blockquote>}
            </>
          }

          <Input
            type="textarea"
            name="text"
            id="text"
            value={text}
            placeholder="Write text to your new post"
            onChange={handleValueChanged}
          />
        </FormGroup>
        <div className="buttonBox">
          <Button className="formButton" onClick={savePost}>Save Post</Button>
          <Button className="formButton" onClick={doClose}>Cancel</Button>
        </div>
      </Form>
    </>
  );
}
