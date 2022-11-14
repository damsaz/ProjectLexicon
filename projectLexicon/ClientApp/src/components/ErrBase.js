import React from "react";
import "./popup.css";
import { ErrPopup } from './ErrPopup'

export function ErrBase(props) {
  const { errmsg, onClose } = props;
  return (
    <div className="popupBase errormessage">
      {errmsg && (
        <div className="popupForm">
          <ErrPopup errMsg={errmsg} onClose={onClose} />
        </div>
      )}
    </div>
  );
}
