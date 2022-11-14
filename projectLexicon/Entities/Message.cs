using System;

namespace ProjectLexicon.Controllers
{
    public class Message
    {
        public string Text { get; set; }   
        
        public int Id { get; set; }

        public string SID { get; set; }

        public string RID { get; set; }  

        public int Status { get; set; }
        public int RPTO { get; set; }

        public int IsEdited { get; set; }  

        public string Conversationtoken { get; set; }

        public DateTime CreatedTime { get; set; }

        Conversation conversation { get; set; }
    }
}
