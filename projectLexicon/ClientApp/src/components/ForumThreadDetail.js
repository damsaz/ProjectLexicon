/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import { Container } from "reactstrap";
import { Form } from "reactstrap";
import { InputText } from "../components/InputText";
import { FormButtons } from "../components/FormButtons";
import authService from './api-authorization/AuthorizeService'
import { apiPost, apiGet } from '../api/api'
import "./root.css";


export function FormThreadDetail({ popupId, handleClose, forumCategoryId }) {
  const [orgItem, setOrgItem] = useState({ forumCategoryId: forumCategoryId  })
  const [formItem, setFormItem] = useState({});

  useEffect(() => {
    async function fetchData() {
      let data = await apiGet('forumthread/Item', { id: popupId })
      // data = { result: { id: 0, name: "" } };
      setOrgItem({ ...forumCategoryId, ...data.result });
      setFormItem({ ...forumCategoryId, ...data.result });
    }
    fetchData();
  }, []);

  async function handleSave() {
    if (popupId === 0) {
      await apiPost('forumthread/Add', { name: formItem.name, forumCategoryId: orgItem.forumCategoryId  })
    } else {
      await apiPost('forumthread/Update', { id: popupId, name: formItem.name, forumCategoryId: orgItem.forumCategoryId })
    }
    handleClose();
  }

  async function handleDelete() {
    // await deleteItem(orgItem.id);
    await apiPost('forumthread/Delete', { id: popupId })
    handleClose();
  }

  function handleReset() {
    setFormItem({ ...orgItem });
  }

  function formValueChanged(changes) {
    setFormItem({ ...formItem, ...changes });
  }

  const nameChanged = (name) => formValueChanged({ name });

  function isNullOrEmpty(str) {
    return str === null || str === undefined || str === "";
  }

  function validateItem(item) {
    if (!item) return {}
    let errs = {}
    if (isNullOrEmpty(item.name)) errs.name = "Thread name can not be empty"
    return errs
  }

  const errs = validateItem(formItem);
  const notValid = errs && Object.values(errs).some((x) => x);
  // const roleCanUpdate = hasRole(appContext.roleId, ["sysadmin", "admin"]);
  const roleCanUpdate = true;

  const deleteVisible = roleCanUpdate && !!orgItem.id;
  const deleteEnabled = true;
  const saveVisible = roleCanUpdate;
  const saveEnabled = !notValid;

  return (
    <div>
      {orgItem && (
        <div>
          <Form method="post" id="thread-form">
            <label>{orgItem.id || ""}</label>
            <input type="hidden" name="id" value={orgItem.id || ""} />
            <div className="inputBox">
              <InputText
                id="name"
                label="Thread Name"
                err={errs.name}
                value={formItem.name || ""}
                orgValue={orgItem.name || ""}
                onChange={nameChanged}
              />
            </div>
            <FormButtons
              deleteVisible={deleteVisible}
              deleteEnabled={deleteEnabled}
              saveVisible={saveVisible}
              saveEnabled={saveEnabled}
              handleDelete={handleDelete}
              handleReset={handleReset}
              handleClose={handleClose}
              handleSave={handleSave}
            />
          </Form>
        </div>
      )}
    </div>
  );
}
