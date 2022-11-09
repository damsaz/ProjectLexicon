using System;

namespace ProjectLexicon.Models.Events
{
    public class CommunityEvent
    {
        public int Id { get; set; }

        public string UserId { get; set; }

        public string Subject { get; set; }

        public string Content { get; set; }

        public DateTime Timestamp { get; set; }

        public DateTime StartDate { get; set; }
    }
}
