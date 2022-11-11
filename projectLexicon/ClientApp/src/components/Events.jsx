import React, { useState, useEffect } from "react";
import { Button, Container, ListGroup, ListGroupItem } from "reactstrap";
import { apiGet } from '../api/api'
import { ErrBase } from './ErrBase'
import { EventNew } from './EventNew'
import { EventWrap } from './EventWrap'

export function Events(props) {
  const [items, setItems] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const params = {};
      let data = await apiGet("CommunityEvent/List", params);
      if (data.errText) {
        return setErrmsg(data.errText);
      }
      setItems(data.result);
    }
    fetchData();
  }, []);

  function doShowNew() {
    setShowNew(true)
  }

  function doHideNew() {
    setShowNew(false)
  }

  function handleNewItemAdded(newItem) {
    const newItems = [...items]
    newItems.push(newItem)
    setItems(newItems)
  }

  return (
    <>
      <Container>
        <ErrBase errmsg={errmsg} onClose={() => setErrmsg("")} />
        {showNew && (
          <div className="popupBase">
            <div className="popupForm">
              <EventNew
                onClose={doHideNew}
                onAdd={handleNewItemAdded}
              />
            </div>
          </div>
        )}         
        <h1>Events</h1>
        <hr></hr>
        {items.length == 0 && (
          <h2>There are no events yet.
            Click "New Event" to add the first event
          </h2>
        )}
        <ListGroup>
          {items.map((item) => (
            <ListGroupItem id={item.id} key={`event-${item.id}`}>
              <EventWrap
                item={item}
              />
            </ListGroupItem>
          ))}
        </ListGroup>
        <hr></hr>
        <div className="bottonBox">
          <Button onClick={doShowNew}>New Event</Button>
        </div>
      </Container>
    </>
  );
}
