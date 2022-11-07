import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { apiPost } from '../api/api'
import { ErrBase } from './ErrBase'

export function ForumPostNew(props) {
  const { forumThread, quotedPost, quotedText, onClose, onAdd } = props;
  const [text, setText] = useState("Startvalue");
  const [errmsg, setErrmsg] = useState("");

  function doClose() {
    onClose();
  }

  //function handleTextChange(value) {
  //  setText(e.target.value);
  //}

  async function savePost() {
    const params = {
      forumThreadId: forumThread.id,
      tagIds: [],
      text,
      quotedText,
      forumPostId: quotedPost ? quotedPost.id : 0
    }
      
    const newItem = await apiPost("forumpost/Add", params);
    if (newItem.errText) {
      return setErrmsg(newItem.errText);
    }
    newItem.result && props.onAdd(newItem.result);
    doClose();
  }

  function handleValueChanged(e) {
    setText(e.target.value)
  }

  return (
    <>
      <Form>
        <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
        <FormGroup>
          {!!quotedText && (<><Label>{quotedText}</Label><hr></hr></>)}
          <Label for="text">New Post</Label>
          <Input
            type="textarea"
            name="text"
            id="text"
            value={text}
            placeholder="Write someting interesting"
            onChange={handleValueChanged}
          />
        </FormGroup>
        <Button onClick={savePost}>Save Post</Button>
        <Button onClick={doClose}>Cancel</Button>
      </Form>
      <p>item.Text</p>
    </>
  );
}
