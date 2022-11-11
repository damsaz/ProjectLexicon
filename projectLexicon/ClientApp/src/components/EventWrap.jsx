import React from "react";
import { Form, Label, Input } from 'reactstrap'
import { DatePicker } from 'reactstrap-date-picker'

export function EventWrap(props) {
  const { item } = props;

  function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <Form onSubmit={onSubmit}>
      <Label for="subject">Subject</Label>
      <Input
        readOnly
        type="text"
        name="subject"
        id="subject"
        value={item.subject}
      />

      <Label>Event Start Date</Label>
      <DatePicker id="startDate"
        readOnly
        value={item.startDate}
        dateFormat="YYYY-MM-DD"
      />

      <Label for="text">New Post</Label>
      <Input
        readOnly
        type="textarea"
        name="content"
        id="content"
        value={item.content}
      />
    </Form>
  )
}
