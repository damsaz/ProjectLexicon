import React from "react";
import { Button } from "reactstrap";
import "./root.css";

export function FormButtons({
  deleteVisible,
  deleteEnabled,
  saveVisible,
  saveEnabled,
  handleDelete,
  handleReset,
  handleClose,
  handleSave,
}) {
  const isDisabled = (enabled) => (enabled ? false: true);

  const saveButtonVariant = saveEnabled ? "success" : "secondary";
  const deleteButtonVariant = deleteEnabled ? "danger" : "secondary";
  return (
    <div className="buttonBox">

      {/* Reset Button */}
      <Button
        className="formButton"
        variant="primary"
        type="button"
        onClick={handleReset}
      >
        Reset
      </Button>

      {/* Delete Button */}
      {deleteVisible && (
        <Button
          className="formButton"
          variant={deleteButtonVariant}
          disabled={isDisabled(deleteEnabled)}
          type="button"
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}

      {/* Cancel/Close Button */}
      <Button
        className="formButton"
        variant="primary"
        value="Close"
        onClick={handleClose}
      >
        Close
      </Button>


      {/* Save Button */}
      {saveVisible && (
        <Button
          disabled={isDisabled(saveEnabled)}
          className="formButton"
          variant={saveButtonVariant}
          value="Save"
          onClick={handleSave}
        >
          Save
        </Button>
      )}
    </div>
  );
}
