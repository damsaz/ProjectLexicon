import React, { useState } from 'react';
import { ConversationList2 } from './ConversationList2';
import MessageList from './MessageList';
import './Style/Messenger.css';

export default function Messenger(props) {
 
    return (
      <div>
        {/* <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        /> */}

        {/* <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        /> */}

        
                <ConversationList2/>
      


      </div>
    );
}