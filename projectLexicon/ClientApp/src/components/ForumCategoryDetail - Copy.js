/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import { Form } from "reactstrap";
import { InputText } from "../components/InputText";
import { FormButtons } from "../components/FormButtons";
import { apiPost, apiGet } from '../api/api'
import "./root.css";
import { ErrBase } from "./ErrBase";



export function ForumCategoryDetail(props) {
  const { popupId, handleClose, category } = props
  const [orgItem, setOrgItem] = useState(category || {})
  const [formItem, setFormItem] = useState(category ||{});
  const [errmsg, setErrmsg] = useState("");

/*
  useEffect(() => {
    async function fetchData() {
      let data = await apiGet('forumcategory/Item', { id: popupId })
      if (data.errText) {
        return setError(data.errText)
      }
      setOrgItem(data.result);
      setFormItem(data.result);
    }
    if(!category.id) fetchData();
  }, []);
*/
  
  function setError(errmsg) {
    setErrmsg(errmsg)
    return 0;
  }

  async function handleSave() {
    if (popupId === 0) {
      const newItem = await apiPost('forumcategory/Add', { name: formItem.name })
      if (newItem.errText) {
        return setError(newItem.errText)
      }
      newItem.result && props.onAdd(newItem.result)

    } else {
      await apiPost('forumcategory/Update', { id: popupId, name: formItem.name })
      const changedItem = await apiPost('forumcategory/Update', { id: popupId, name: formItem.name })
      if (changedItem.errText) {
        return setError(changedItem.errText)
      }
      changedItem.result && props.onChange(changedItem.result)

    }
    handleClose();
  }

  async function handleDelete() {
    const result = await apiPost('forumcategory/Delete', { id: popupId })
    if (result.errText) return setError(result.errText)
    props.onDelete(popupId);
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
    if (isNullOrEmpty(item.name)) errs.name = "Category name can not be empty"
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
    <>
    <p>Hejåhå</p>
    {/*
    <div>
      {orgItem && (
        <div>
          <Form method="post" id="category-form">
            {errmsg &&
              <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />            }
            <input type="hidden" name="id" value={orgItem.id || ""} />
            <div className="inputBox">
              <InputText
                id="name"
                label="Category Name"
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
    */}            
    </>
    );
}
