using ProjectLexicon.Models.Shared;
using System;

namespace ProjectLexicon.Models.ForumCategories
{
    public class ForumCategory : EntityItem
    {
        public override int Id { get; set; }
        public string Name { get; set; } = "";
        public string UserId { get; set; } = "";
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime? ArchivedDate { get; set; }
    }
}
