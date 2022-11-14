import React, {useEffect, useState} from 'react';
import Compose from './Compose';
import Toolbar from './Toolbar';
import ToolbarButton from './ToolbarButton';
import Message from './Message';
import moment from 'moment';
import { Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';
import { apiGet } from './api';
import { ErrBase } from '../ErrBase';
import axios from 'axios';

import './Style/MessageList.css';

const MY_USER_ID = 'apple';

export default function MessageList2(props) {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState({
        Text: "",
        Sid: "",
        Rid: "",
        CreatedTime: new Date().getTime()
    })
    useEffect(() => {
       // axios.get("api/messages").then((response) => {
            //setMessages(response.data);
          // setMessages([...messages, ...tempMessages])
        //  });
   getMessages();
  },[])
    const handleSubmit2 = (event) => {
        event.preventDefault();
        const form = event.target[0].value
        alert(form);
        // setContactInfo({ FirstName: "", SecondName: "", Age: "", Nationality: "", EmailAdress: ""}); //reset form values after submit

    };
    const handleSubmit = (event) =>{
  
        event.preventDefault();
       
        const newItem = apiGet("Messages/Add", { Text: event.target[0].value, Rid:"188a3de0-fd16-4745-b233-8f1bf746bd58" ,});
        if (newItem.errText) {
            alert(newItem.errText);
        }
      
    }
  const getMessages = () => {
     var tempMessages = [
        {
          id: 1,
          author: 'apple',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 2,
          author: 'orange',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 3,
          author: 'orange',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 4,
          author: 'apple',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 5,
          author: 'apple',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 6,
          author: 'apple',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 7,
          author: 'orange',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 8,
          author: 'orange',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 9,
          author: 'apple',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 10,
          author: 'orange',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
      ]
      setMessages([...messages, ...tempMessages])
  }

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

    return(
      <div className="message-list">
        <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />

        <div className="message-list-container">{renderMessages()}</div>

            <Form className="compose" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="compose-input"
                    placeholder="Type a message, @name"
                />
                <Button type="submit" color="primary" className="bi bi-send">
                    Send
                </Button>

                {
                    props.rightItems
                }
            </Form>
      </div>
    );
}