import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export function PopupOkCancel(props) {
  const {title, text, onOk, onCancel } = props;

  return (
    <Modal isOpen={true}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{text}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onOk}>
          OK
        </Button>{" "}
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
