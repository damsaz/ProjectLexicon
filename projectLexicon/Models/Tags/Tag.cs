using ProjectLexicon.Models.ForumPosts;
using System.Collections.Generic;
using System;
using ProjectLexicon.Models.Shared;

namespace ProjectLexicon.Models.Tags

{
    public class Tag : EntityItem
    {
        override public int Id { get; set; } = 0;
        public string Name { get; set; } = "";
        public HashSet<ForumPost> ForumPosts { get; } = new ();
        public string UserId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
