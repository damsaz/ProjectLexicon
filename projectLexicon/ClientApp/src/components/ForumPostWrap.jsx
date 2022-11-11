import React, { useState } from "react";
import { Button, Badge } from "reactstrap";
import { ForumPostNew } from "./ForumPostNew";
import { PopupOkCancel } from "./PopupOkCancel";
import "./Forum.css";
import { apiPost } from "../api/api";
import { ErrBase } from "./ErrBase";

export function ForumPostWrap(props) {
  const {
    item,
    forumThread,
    onAdd,
    onFindPost,
    isQuotedPost,
    isUser,
    isAdmin,
    onChange,
  } = props;
  const [errmsg, setErrmsg] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  function doHideNew() {
    setShowNew(false);
  }
  function doShowNew() {
    setShowNew(true);
  }

  const quotedPostClass = isQuotedPost ? "quoted-post" : "";

  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  function dateStr(dateJson) {
    try {
      const date = new Date(dateJson);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      if (localDate.toString() === "Invalid Date") return "Unknown Date";
      return localDate.toISOString().split(".")[0].split("T").join(" ");
    } catch (err) {
      window.alert(`Err Date: ${dateJson}`);
      return "Unknown Date";
    }
  }

  const userName = (item && item.user && item.user.email) || "Unknown";
  const quotedUserName =
    (item && item.quotedPost && item.quotedPost.user.email) || "Unknown";

  function handleDeleteRequest() {
    setShowDeletePopup(true);
  }
  function handleDeletePopupCancel() {
    setShowDeletePopup(false);
  }
  async function handleDeletePopupOk() {
    setShowDeletePopup(false);
    const params = {
      id: item?.id || 0,
    };

    
    const changedItem = await apiPost("forumpost/Delete", params);
    if (changedItem.errText) {
      return setErrmsg(changedItem.errText);
    }
    if (changedItem.result) {
      onChange(changedItem.result);
    }
  }

  return (
    <>
      <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
      {showNew && (
        <div className="popupBase">
          <div className="popupForm">
            <ForumPostNew
              forumThread={forumThread}
              quotedPost={item}
              quotedText={item.text}
              quotedDate={dateStr(item.createdDate)}
              onClose={doHideNew}
              onAdd={onAdd}
            />
          </div>
        </div>
      )}
      {showDeletePopup && (
        <PopupOkCancel
          title="Delete Post"
          text="Do you want to delete this post?"
          onCancel={handleDeletePopupCancel}
          onOk={handleDeletePopupOk}
        />
      )}
      <div className="bordered">
        <p className="small-text">
          Posted {dateStr(item.createdDate)} by {userName}
        </p>

        {item.quotedPost && (
          <>
            <p>
              Answer to
              <Badge
                color="secondary"
                onClick={() => onFindPost(item.quotedPostId)}
              >
                {quotedUserName} at{" "}
                {dateStr(item.quotedPost.createdDate) || "sometime"} &gt;&gt;
              </Badge>
            </p>
            {item.quotedText && (
              <blockquote className="small-text">{item.quotedText}</blockquote>
            )}
          </>
        )}
        <hr></hr>
        <p className={quotedPostClass}>{item.text}</p>
        <hr />
        <div className="buttonBox">
          {isAdmin && (
            <Button className="formButton" onClick={handleDeleteRequest}>
              Delete
            </Button>
          )}
          {isUser && (
            <Button className="formButton" onClick={doShowNew}>
              Quote
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
