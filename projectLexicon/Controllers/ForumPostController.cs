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
        public Response GetList(string? filter, string? userId, int? ForumThreadId, string? tagIds)
        {
            List<int>? tagIdNumbers = parseIntList(tagIds);
            if (tagIdNumbers == null)
                return new Response(415, "Tag id's were not in recognized format");
            return new Response(Filter(filter, userId, ForumThreadId, tagIdNumbers));
        }


        // =======================================
        // Get Item
        // =======================================

        [HttpGet("Item")]
        public Response GetItem(int id)
        {
            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            return item == null ?
                new Response(404, "Post not found") :
                new Response(item);
        }

        // =======================================
        // === Add Item
        // =======================================
        [HttpPost("Add")]
        public Response PostAdd(
            int forumThreadId,
            string? tagIds,
            string? text,
            string? quotedText,
            int? forumPostId
         )
        {
            if (!ModelState.IsValid)
                return new Response(100, "Invalid input");
            if (!UserId.HasRole(User, Role.User, Role.Admin, Role.Sys))
            {
                return new Response(101, "No permission");
            }

            List<int>? tagIdNumbers = parseIntList(tagIds);
            if (tagIdNumbers == null)
                return new Response(415, "Tag id's were not in recognized format");

            List<Tag> tags = DbUtils.GetItemsByIds(Context.Tags, tagIdNumbers);
            ForumPost? item = new() {
                ForumThreadId = forumThreadId,
                Tags = tags,
                Text = text ?? "",
                QuotedText = quotedText ?? "",
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
            string? tagIds,
            string text,
            string quotedText,
            int? forumPostId
        )
        {
            if (!ModelState.IsValid)
                return new Response(100, "Invalid input");
            if (!UserId.HasRole(User, Role.User, Role.Admin, Role.Sys))
                return new Response(101, "No permission");

            List<int>? tagIdNumbers = parseIntList(tagIds);
            if (tagIdNumbers == null)
                return new Response(415, "Tag id's were not in recognized format");

            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
                return new Response(404, "Post not found");

            // If not admin, check that
            // - it is the users own post
            // - Thread id has not changed
            // - It has not passed more than 5 minutes since creation

            if (!UserId.HasRole(User, Role.Admin, Role.Sys))
            {
                bool permission = true;
                permission &= item.UserId == UserId.Get(User);
                permission &= item.ForumThreadId == forumThreadId;
                permission &= DateTime.Now.Subtract(item.CreatedDate).TotalMinutes <= 5;
                if (!permission)
                    return new Response(101, "No permission");
            }

            if (forumPostId != null)
            {
                ForumPost? quotedPost = DS.FirstOrDefault(item => item.Id == forumPostId);
                if (quotedPost == null)
                    return new Response(404, "Quoted Post not found");
                if (!quotedPost.Text.Contains(quotedText))
                {
                    return new Response(101, "Quoted Post does not contain quoted string");
                }
            }


            item.ForumThreadId = forumThreadId;
            item.Tags = DbUtils.GetItemsByIds(Context.Tags, tagIdNumbers);
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
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response(101, "No permission");
            }

            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
            {
                // We try delete item that does not exist, so basically a success?
                return new Response();
            }

            item.ArchivedDate = DateTime.Now;
            Context.SaveChanges();
            return new Response();
        }

        static private List<int>? parseIntList(string? str)
        {
            if (string.IsNullOrEmpty(str))
                return new();
            List<int>? ret = new();
            string[] ar = str.Split(',');
            foreach (string item in ar)
            {
                bool success = int.TryParse(item.Trim(), out int number);
                if (!success)
                    return null;
                ret.Add(number);
            }
            return ret;
        }

        private List<ForumPost> Filter(string? filter, string? userId, int? forumThreadId, List<int>? tagIds)
        {
            return DS.Where(p =>
                (string.IsNullOrEmpty(filter) || p.Text.Contains(filter))
                &&
                (string.IsNullOrEmpty(userId) || p.UserId == userId)
                &&
                (forumThreadId == null || forumThreadId == 0 || p.ForumThreadId == forumThreadId)
                &&
                (tagIds == null || tagIds.Count == 0 || p.Tags.Any(t => tagIds.Any(tagId => tagId == t.Id)))
                )
                .ToList();
        }
    }
}
