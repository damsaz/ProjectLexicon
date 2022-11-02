using ProjectLexicon.Models.ForumCategories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLexicon.Models.Shared
{
    static public class InitData
    {
        private static readonly Random rnd = new();

        static public List<ForumCategory> SeedForumCategories()
        {
            int nextId = 1;
            return ForumCategories
                .Select(name => new ForumCategory() { Id = nextId++, Name = name })
                .ToList();
        }

        private static readonly List<string> ForumCategories = new() {
            "Cars",
            "Trains",
        };
    }
}
