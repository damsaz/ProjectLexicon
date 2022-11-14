import React, { useState } from "react";
import { Button, Badge } from "reactstrap";
import { ForumPostNew } from "./ForumPostNew";
import { PopupOkCancel } from "./PopupOkCancel";
import "./Forum.css";
import { apiPost } from "../api/api";
import { ErrBase } from "./ErrBase";
import { getUserName } from './StringUtils'

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

  const userName = (item && item.user && getUserName(item.user)) || "Unknown";
  const quotedUserName =
    (item && item.quotedPost && getUserName(item.quotedPost.user)) || "Unknown";

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

  async function handleRecoverRequest() {
    const params = {
      id: item?.id || 0,
    };

    const changedItem = await apiPost("forumpost/Recover", params);
    if (changedItem.errText) {
      return setErrmsg(changedItem.errText);
    }
    if (changedItem.result) {
      onChange(changedItem.result);
    }
  }
  function getTagNames() {
    return item.tags.map((tag) => tag.name);
  }

  const tagNames = getTagNames();
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
      <div
        className={
          item.archivedDate ? "bordered archived-post" : "bordered post"
        }
      >
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
        {tagNames && tagNames.length > 0 && (
          <span>
            {" "}
            Tags:
            {tagNames.map((tagName) => (
              <>
                {" "}
                <Badge>{tagName}</Badge>
              </>
            ))}
          </span>
        )}
        <hr></hr>
        {item.archivedDate && <h3>ARCHIVED</h3>}
        <p className={quotedPostClass}>{item.text}</p>
        <hr />
        <div className="buttonBox">
          {isAdmin && !item.archivedDate && (
            <Button className="formButton" onClick={handleDeleteRequest}>
              Delete
            </Button>
          )}
          {isAdmin && item.archivedDate && (
            <Button className="formButton" onClick={handleRecoverRequest}>
              Recover
            </Button>
          )}
          {isUser && !item.archivedDate && (
            <Button className="formButton" onClick={doShowNew}>
              Quote
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
