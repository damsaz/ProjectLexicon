import React, {Component,useState, useEffect} from 'react';
import ConversationSearch from './ConversationSearch';
import ConversationListItem from './ConversationListItem';
import Toolbar from './Toolbar';
import ToolbarButton from './ToolbarButton';
import axios from 'axios';
import { apiGet } from './api';
import './Style/ConversationList.css';
import usersService from '../users/UsersService';
import authService from '../api-authorization/AuthorizeService'
import Message from './Message';
import moment from 'moment';
import MessageList from './MessageList';
const MY_USER_ID = 'apple';
export class ConversationList2 extends Component {
    static displayName = ConversationList2.name;

    constructor(props) {
        super(props);
        this.state = { conversations: [], messages: [], userP: "", loading: true };
        this.getMessage = this.getMessage.bind(this);
    }
  

     
    
 
    componentDidMount() {
        this.getConversations();

    }

    renderForecastsTable(conversations) {
    
         return (
             <div className = "messenger" >
            <div className="conversation-list scrollable sidebar">
            
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

                        <div className="conversation-list-item" key={conversation.userid}  >
                            <img className="conversation-photo" src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="conversation" />
                            <div className="conversation-info" >
                                <h1 className="conversation-title" id={conversation.userid} onClick={this.getMessage}>{conversation.userName}</h1>
                                <p className="conversation-snippet">Offline</p>
                            </div>
                        </div>
                )
                }

             </div>
                 <div className=" content">
                     <MessageList messages={this.state.messages} userP={this.state.userP} />

                 </div>

          </div >
        );
    }
    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderForecastsTable(this.state.conversations);

        return (
            <div>
              
                {contents}

            </div>

        );
    }

    async getConversations() {
        const token = await authService.getAccessToken();
        const response = await fetch('api/Messages/GetUser', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ conversations: data, userP: data[0].userid, loading: false });
        console.log(this.state.userP);
        
    }
    async getMessage(event) {
        let contents = event.target.id;
        
        const token = await authService.getAccessToken();
        const response = await fetch('api/Messages/' + contents, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ messages: data, userP: contents});
        console.log(this.state.messages);
        
        
    }
    async handleSubmit(event) {

        this.getMessage("")
        // setState({ messages: data});

        // setContactInfo({ FirstName: "", SecondName: "", Age: "", Nationality: "", EmailAdress: ""}); //reset form values after submit

    }

}