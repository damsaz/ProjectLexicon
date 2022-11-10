import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button} from "reactstrap";
import { apiPost } from '../api/api'
import { ErrBase } from './ErrBase'
import { DatePicker } from 'reactstrap-date-picker'

export function EventNew(props) {
  const { onClose, onAdd } = props;
  const [errmsg, setErrmsg] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");

  function doClose() {
    onClose();
  }

  function mvcDate(date) {
    if (!date) return date;
    return date.slice(0, -1)
  }

  async function saveItem() {
    let errors = []
    if (subject.trim() == "") errors.push("Subject can't be empty");
    if (content.trim() == "") errors.push("Content can't be empty");
    if (startDate.trim() == "") errors.push("Start Date can't be empty");
    else if (new Date(startDate) - new Date() < 0) errors.push("Start Date has already passed");

    if (errors.length) {
      return setErrmsg(errors.join("\n"))
    }

    const params = {
      Subject: subject,
      Content: content,
      StartDate: startDate,
    }

    const newItem = await apiPost("CommunityEvent/Add", {}, params);
    if (newItem.errText) {
      return setErrmsg(newItem.errText);
    }
    newItem.result && onAdd(newItem.result);
    doClose();
  }

  function handleSubjectChanged(e) {
    setSubject(e.target.value)
  }

  function handleContentChanged(e) {
    setContent(e.target.value)
  }

  function handleStartDateChanged(value, formattedValue) {
    setStartDate(value)
  }

  return (
    <Form>
      <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
      <FormGroup>

        <Label for="subject">Subject</Label>
        <Input
          type="text"
          name="subject"
          id="subject"
          value={subject}
          placeholder="Set a subject"
          onChange={handleSubjectChanged}
        />

        <Label>Event Start Date</Label>
        <DatePicker
          id="startDate"
          value={startDate}
          dateFormat="YYYY-MM-DD"
          weekStartsOn={1}
          onChange={(v, f) => handleStartDateChanged(v, f)}
        />

        <Label for="text">New Post</Label>
        <Input
          type="textarea"
          name="content"
          id="content"
          value={content}
          placeholder="Write your content here"
          onChange={handleContentChanged}
        />

      </FormGroup>
      <Button onClick={saveItem}>Save Event</Button>
      <Button onClick={doClose}>Cancel</Button>
    </Form>
  );
}
