import React from 'react';
import { Button } from 'reactstrap';
import './popup.css';

export function ErrPopup(props) {
  const { errMsg, onClose } = props

  return (
    <div className="errormessage">
      <div>{errMsg}</div>
      <div className="buttonBox">
        <Button
          className="formButton"
          variant="primary"
          value="Close"
          onClick={onClose}
        >
          OK
        </Button>
      </div>
    </div>
  )
}
