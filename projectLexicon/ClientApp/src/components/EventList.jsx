import React, { useState, useEffect } from "react";
import { Badge, Button, Container, ListGroup, ListGroupItem } from "reactstrap";
import { apiGet } from "../api/api";
import { ErrBase } from "./ErrBase";
import { EventNew } from "./EventNew";
import { EventWrap } from "./EventWrap";
import { dateStr } from "./DateUtils";
import "./Forum.css";

export function EventList(props) {
  const [items, setItems] = useState([]);
  const [errmsg, setErrmsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [userRole, setUserRole] = useState("...");

  useEffect(() => {
    async function fetchData() {
      const params = {};
      let data = await apiGet("CommunityEvent/List", params);
      if (data.errText) {
        setLoading(false);
        return setErrmsg(data.errText);
      }
      const now = Date.now();
      const itemList = data.result
        .filter(x => x.startDate && (new Date(x.startDate)).getTime() > now)
        .sort((a,b)=>a.startDate > b.startDate)
      setItems(itemList);
      setLoading(false);
      setLoaded(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
    checkUserRole();
    const interval = setInterval(() => {
      checkUserRole();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function checkUserRole() {
    let data = await apiGet("forumpost/UserInfo", {});
    if (data.errText) {
      return setErrmsg(data.errText);
    }
    setUserRole(data.result.userRole || "Guest");
  }

  function toggle(id) {
    if (open === id) {
      setOpen(0);
    } else {
      setOpen(id);
    }
  }


  function doHideNew() {
    setShowNew(false)
  }
  function doShowNew() {
    setShowNew(true)
  }
  function handleNewItemAdded(newItem) {
    const newItems = [...items]
    newItems.push(newItem)
    setItems(newItems.sort((a,b)=>a.startDate > b.startDate))
  }
  const isAdmin = ["administrator", "supervisor"].includes(userRole);
  return (
    <>
      <Container>
      <div className="bottonBox">
          <Button onClick={doShowNew}
          disabled={!isAdmin}>New Event</Button>
        </div>
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
        {loading && <h2>Loading...</h2>}
        {!loading && !loaded && (
          <h2>An error occurred while loading the page</h2>
        )}
        {loaded && items.length === 0 && <h2>There are currently no events</h2>}
        <ListGroup>
          {items.map((item) => (
            <ListGroupItem id={item.id} key={`acc-${item.id}`}>
              <>
                <div
                  className="bordered accheader"
                >
                  <span>
                    <Badge className="clickable" onClick={() => toggle(item.id)}>
                      {open === item.id ? "Hide" : "Show"}
                    </Badge>
                    {" "} <strong>{dateStr(item.startDate)}</strong>
                    {" "} {item.subject}
                  </span>
                </div>
                {open === item.id && (
                  <div className="bordered accbody">
                    {item.content}
                  </div>
                )}
              </>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>
    </>
  );
}
