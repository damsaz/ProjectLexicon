import React, { useState } from "react";
import { Button } from 'reactstrap'
import { ForumPostNew } from './ForumPostNew';

export function ForumPostWrap(props) {
  const { item, forumThread, onAdd } = props;
  const [showNew, setShowNew] = useState(false);
  //  const [selection, setSelection] = useState([0, 0]);

  function doHideNew() {
    setShowNew(false)
  }
  function doShowNew() {
    setShowNew(true)
  }

  /*
  function onSelectionChange(event) {
    const selection = event.nativeEvent.selection;
    setSelection([selection.start, selection.end])
  };

  function getSelectedText() {
    const [start, end] = selection
    item.text.substring(start, end - start)
  }
  */

  return (
    <>
      {showNew && (
        <div className="popupBase">
          <div className="popupForm">
            <ForumPostNew
              forumThread={forumThread}
              quotedPost={item}
              quotedText={item.text}
              onClose={doHideNew}
              onAdd={onAdd}
            />
          </div>
        </div>
      )}
      <p>{item.text}</p>
      <hr />
      <div className="buttonBox">
        <Button className="formButton">
          Delete
        </Button>
        <Button className="formButton"
          onClick={doShowNew}>
          Quote
        </Button>
      </div>
    </>
  )
}
