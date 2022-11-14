import React, {useEffect} from 'react';
import shave from 'shave';

import './Style/ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

    const { photo, name, text } = props.data;

    return (
      <div className="conversation-list-item">
            <img className="conversation-photo" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"  />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          <p className="conversation-snippet">{ text }</p>
        </div>
      </div>
    );
}