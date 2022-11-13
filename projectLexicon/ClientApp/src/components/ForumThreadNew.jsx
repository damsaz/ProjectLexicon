import React, { useState } from "react";
import { Button, Container, ListGroup, ListGroupItem } from "reactstrap";
import { ForumPostWrap } from "./ForumPostWrap";
import { ForumPostNew } from "./ForumPostNew";
import { apiGet } from "../api/api";
import { ErrBase } from "./ErrBase";
import { ForumThreadDetail } from "./ForumThreadDetail";
import { ForumPostWrapNew } from "./ForumPostWrapNew";

export function ForumThreadNew(props) {
  const { forumCategoryId, onNewThread } = props;

  const [errmsg, setErrmsg] = useState("");

  // === New Thread is created

  function handleAddThread(newThread) {
    onNewThread(newThread);
  }

  function nofunction() {}

  return (
    <>
      <Container>
        <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />

        {/*=== Header ===*/}

        <div>
          <h1>{"New Thread"}</h1>
        </div>
        <hr></hr>

        {/*=== New Thread ===*/}

        {true && (
          <ForumThreadDetail
            onAdd={handleAddThread}
            onChange={nofunction}
            onDelete={nofunction}
            handleClose={nofunction}
            popupId={0}
            forumCategoryId={forumCategoryId}
          />
        )}
      </Container>
    </>
  );
}
