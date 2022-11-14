using System;
namespace ProjectLexicon.Models
{
	public class UserChatList
	{
		public string UserName{get;set; }
        public string Userid { get; set; }

        public UserChatList(string username, string userid )
		{
			this.Userid = userid;
			this.UserName = username;
		}

        public UserChatList()
        {
        }
    }
}

