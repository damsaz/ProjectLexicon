import React, { useState, useEffect } from "react";
import { Badge, Button, Input } from "reactstrap";
import { apiPost, apiGet } from "../api/api";
import { ErrBase } from "./ErrBase";
import "./Forum.css";
import { TagsPopup } from "./TagsPopup";

export function ForumPostWrapNew(props) {
  const { forumThread, onAdd, isUser, quotedPost, quotedText } = props;

  const [text, setText] = useState("");
  const [errmsg, setErrmsg] = useState("");
  const [tagIds, setTagIds] = useState([]);
  const [tags, setTags] = useState([]);
  const [showTagsPopup, setShowTagsPopup] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      const params = {};
      let data = await apiGet("tag/List", params);
      if (data.errText) {
        return setErrmsg(data.errText);
      }
      const newTags = data.result || [];
      setTags(newTags);
    }
    fetchTags();
  }, []);

  async function savePost() {
    if (text.trim() === "")
      return setErrmsg("Write some text before sending the new post");
    const params = {
      forumThreadId: forumThread.id,
      tagIds: tagIds,
      text,
      quotedText,
      quotedPostId: quotedPost ? quotedPost.id : 0,
    };

    const newItem = await apiPost("forumpost/Add", params);
    if (newItem.errText) {
      return setErrmsg(newItem.errText);
    }
    setTagIds([]);
    setText("");
    if (newItem.result) {
      onAdd(newItem.result);
    }
  }

  function handleValueChanged(e) {
    setText(e.target.value);
  }

  function handleTagsChange(newTagIds) {
    setTagIds([...newTagIds]);
  }

  function handleTagsClose() {
    setShowTagsPopup(false);
  }

  function getTagNames() {
    const tidss = tagIds;
    const myTags = tidss.map((tagId) => tags.find((tag) => tag.id === tagId));
    const myTagNames = myTags.map((tag) => tag?.name || "");
    const myRealTagNames = myTagNames.filter((tagName) => tagName);
    return myRealTagNames;
  }

  const tagNames = getTagNames(tagIds);

  return (
    isUser && (
      <>
        <div className="bordered post">
          <p className="small-text">Add new post</p>
          <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
          <hr />
          <Badge className="clickable" onClick={() => setShowTagsPopup(true)}>Add Tags</Badge>
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
          {showTagsPopup && (
            <TagsPopup
              tagIds={tagIds}
              onChange={handleTagsChange}
              onClose={handleTagsClose}
            />
          )}
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
