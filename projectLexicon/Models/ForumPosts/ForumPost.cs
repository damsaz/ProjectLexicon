using ProjectLexicon.Models.Tags;
using System;
using System.Collections.Generic;
using ProjectLexicon.Models.Shared;

namespace ProjectLexicon.Models.ForumPosts
{
    public class ForumPost : EntityItem
    {
        override public int Id { get; set; }
        public int ForumThreadId { get; set; }
        public List<Tag> Tags { get; set; } = new();
        public string Text { get; set; } = "";
        public string QuotedText { get; set; } = "";
        public int? ForumPostId { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ArchivedDate { get; set; }
    }
}
