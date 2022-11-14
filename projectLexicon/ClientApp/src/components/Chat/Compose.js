import React from 'react';
import './Style/Compose.css';
import { Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';
export default function Compose(props) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target[0].value
        alert(form);
        // setContactInfo({ FirstName: "", SecondName: "", Age: "", Nationality: "", EmailAdress: ""}); //reset form values after submit
    };
    return (
        <Form className="compose" onSubmit={handleSubmit}>
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
            />
            <Button type="submit"  color="primary" className="bi bi-send">
                Send
            </Button>

        {
          props.rightItems
        }
        </Form>
    );
}