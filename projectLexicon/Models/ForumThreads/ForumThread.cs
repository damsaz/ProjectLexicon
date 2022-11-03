using ProjectLexicon.Models.Shared;
using System;

namespace ProjectLexicon.Models.ForumThreads
{
    public class ForumThread : EntityItem
    {
        override public int Id { get; set; }
        public string Name { get; set; } = "";
        public int ForumCategoryId { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ArchivedDate { get; set; }
    }
}
