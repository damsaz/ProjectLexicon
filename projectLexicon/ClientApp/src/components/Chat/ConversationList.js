import React, {useState, useEffect} from 'react';
import ConversationSearch from './ConversationSearch';
import ConversationListItem from './ConversationListItem';
import Toolbar from './Toolbar';
import ToolbarButton from './ToolbarButton';
import axios from 'axios';
import { apiGet } from './api';
import './Style/ConversationList.css';
import usersService from '../users/UsersService';
import authService from '../api-authorization/AuthorizeService'


export default  function ConversationList(props) {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    getConversations()
  },[])

    const [isPending, setIsPending] = useState(true);

    const  getConversations = () => {
    // setConversations(usersService.getUserChat());

       // let x = usersService.getUserChat();
        const newItem = apiGet("Messages/GetUser", setIsPending);
        if (newItem.errText) {
            alert(newItem.errText);
        }
        setConversations(newItem);
    }
    console.log(conversations);
    
    return (
      <div className="conversation-list ">
        <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        />
        <ConversationSearch />
            {
            
          conversations.map(conversation =>
            <ConversationListItem
                  key={conversation.Userid}
              data={conversation}

            />
                )
            }
        
      </div>
    );
}