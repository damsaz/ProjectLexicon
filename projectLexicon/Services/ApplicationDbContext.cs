using Duende.IdentityServer.EntityFramework.Options;
//using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectLexicon.Entities;
using ProjectLexicon.Models.ForumCategories;
using System.Reflection.Emit;
using ProjectLexicon.Models.Tags;
using ProjectLexicon.Models.ForumPosts;
using ProjectLexicon.Models.ForumThreads;
using ProjectLexicon.Models.Shared;

namespace ProjectLexicon.Services
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
	{
		public DbSet<Gender> Genders { get; set; }
        public DbSet<ForumCategory> ForumCategories { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;
        public DbSet<ForumPost> ForumPosts { get; set; } = null!;
        public DbSet<ForumThread> ForumThreads { get; set; } = null!;

        public ApplicationDbContext(
			DbContextOptions options,
			IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder){
            base.OnModelCreating(modelBuilder);
            if (modelBuilder == null) {
                return;
            }

            List<ForumCategory> ForumCategories = InitData.SeedForumCategories();
            modelBuilder.Entity<ForumCategory>().HasData(ForumCategories.ToArray());

            //// Global turn off delete behaviour on foreign keys
            //// https://github.com/dotnet/efcore/issues/13366
            //foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys())) {
            //    relationship.DeleteBehavior = DeleteBehavior.Restrict;
            //}
        }
    }
}
