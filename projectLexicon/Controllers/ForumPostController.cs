#nullable enable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectLexicon.Models.Shared;
using System.Data;
using ProjectLexicon.Models.ForumPosts;
using ProjectLexicon.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using ProjectLexicon.Models.ForumThreads;
using ProjectLexicon.Models.Tags;

namespace ProjectLexicon.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForumPostController : Controller
    {
        private readonly ILogger<ForumPostController> _logger;
        private ApplicationDbContext Context { get; set; }
        private DbSet<ForumPost> DS { get; set; }

        public ForumPostController(ILogger<ForumPostController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            Context = dbContext;
            DS = Context.ForumPosts;
        }

        // =======================================
        // Get List
        // =======================================

        [HttpGet("list")]
        public Response GetList(string filter, int userId, int ForumCategoryId, List<int> tagIds)
        {
            return new Response(Filter(filter, userId, ForumCategoryId, tagIds));
        }

        // =======================================
        // Get Item
        // =======================================

        [HttpGet("Item")]
        public Response GetItem(int id)
        {
            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            return item == null ?
                new Response(404, "Category not found") :
                new Response(item);
        }

        // =======================================
        // === Add Item
        // =======================================
        [HttpPost("Add")]
        public Response PostAdd(
            int forumThreadId,
            List<int> tagIds,
            string text,
            string quotedText,
            int? forumPostId
         )
        {
            if (!ModelState.IsValid)
                return new Response(100, "Invalid input");
            if (!UserId.HasRole(User, Role.User, Role.Admin, Role.Sys)) {
                return new Response(101, "No permission");
            }

            List<Tag> tags = DbUtils.GetItemsByIds(Context.Tags, tagIds);
            ForumPost? item = new() {
                ForumThreadId = forumThreadId,
                Tags = tags,
                Text = text,
                QuotedText = quotedText,
                ForumPostId = forumPostId,
                UserId = UserId.Get(User),
                CreatedDate = DateTime.Now,
            };

            DS.Add(item);
            Context.SaveChanges();
            return new Response(item);
        }

        // =======================================
        // === Update Item
        // === - Mod can make changes at any time
        // === - A user can change his own post, (except forumThreadId), and only withing 5 minutes from creation
        // =======================================

        [HttpPost("Update")]
        public Response PostUpdate(
            int id,
            int forumThreadId,
            List<int> tagIds,
            string text,
            string quotedText,
            int? forumPostId
        )
        {
            if (!ModelState.IsValid)
                return new Response(100, "Invalid input");
            if (!UserId.HasRole(User, Role.User, Role.Admin, Role.Sys)) {
                return new Response(101, "No permission");
            }

            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
                return new Response(404, "Post not found");
            // If not mod, check that
            // - it is the users own post
            // - It has not passed more than 5 minutes since creation
            // - Thread id has not changed

            if (!UserId.HasRole(User, Role.User, Role.Admin, Role.Sys)) {
                bool permission = true;
                permission &= item.UserId == UserId.Get(User);
                permission &= item.ForumThreadId == forumThreadId;
                permission &= DateTime.Now.Subtract(item.CreatedDate).TotalMinutes <= 5;
                if (!permission)
                    return new Response(101, "No permission");
            }

            if (forumPostId != null) {
                ForumPost? quotedPost = DS.FirstOrDefault(item => item.Id == forumPostId);
                if (quotedPost == null)
                    return new Response(404, "Quoted Post not found");
                if (!quotedPost.Text.Contains(quotedText)) {
                    return new Response(101, "Quoted Post does not contain quoted string");
                }
            }


            item.ForumThreadId = forumThreadId;
            item.Tags = DbUtils.GetItemsByIds(Context.Tags, tagIds);
            item.Text = text;
            item.ForumPostId = forumPostId;
            item.QuotedText = quotedText;
            Context.SaveChanges();

            return new Response(item);
        }

        // =======================================
        // === Delete Item 
        // =======================================

        [HttpPost("delete")]
        public Response PostDelete(int id)
        {
            if (!ModelState.IsValid)
                return new Response(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin)) {
                return new Response(101, "No permission");
            }

            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null) {
                // We try delete item that does not exist, so basically a success?
                return new Response();
            }

            item.ArchivedDate = DateTime.Now;
            Context.SaveChanges();
            return new Response();
        }

        private List<ForumPost> Filter(string filter, int userId, int ForumThreadId, List<int> tagIds)
        {
            return DS.Where(p =>
                (string.IsNullOrEmpty(filter) || p.Text.Contains(filter))
                &&
                (userId == 0 || p.ForumThreadId == ForumThreadId)
                &&
                (ForumThreadId == 0 || p.ForumThreadId == ForumThreadId)
                &&
                (tagIds.Count == 0 || p.Tags.Any(t => tagIds.Any(tagId => tagId == t.Id)))
                )
                .ToList();
        }
    }
}
