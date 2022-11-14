import React, {useEffect} from 'react';
import shave from 'shave';

import './Style/ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })
    console.log(props.data);
    const {photo, userName, userid } = props.data;
    
    return (
        <div className="conversation-list-item" id={userid} onClick={props.onClick}>
            <img className="conversation-photo" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="conversation" />
            <div className="conversation-info" >
                <h1 className="conversation-title">{userName }</h1>
                <p className="conversation-snippet">Offline</p>
        </div>
      </div>
    );
}