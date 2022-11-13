#nullable enable
using ProjectLexicon.Models.Tags;
using System;
using System.Collections.Generic;
using ProjectLexicon.Models.Shared;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ProjectLexicon.Models.ForumThreads;
using Microsoft.AspNetCore.Identity;
using ProjectLexicon.Entities;

namespace ProjectLexicon.Models.ForumPosts
{
    public class ForumPost : EntityItem
    {
        [Key]
        override public int Id { get; set; }

        public ForumThread ForumThread { get; set; }
        public int ForumThreadId { get; set; }

        public ApplicationUser User { get; set; }
        public string UserId { get; set; }

        public ForumPost? QuotedPost { get; set; }
        public int? QuotedPostId { get; set; }

        public List<Tag> Tags { get; set;  } = new();

        public string Text { get; set; } = "";
        public string QuotedText { get; set; } = "";
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ArchivedDate { get; set; }
    }
}
