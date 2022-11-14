using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ProjectLexicon.Controllers;

namespace ProjectLexicon
{
   
    public class Conversation
    {

        public int ConversationId { get; set; }
        public string Conversationtoken { get; set; }
        public List<Message> messages = new List<Message>();
      
    }

    

}

