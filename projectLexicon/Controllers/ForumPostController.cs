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
using ProjectLexicon.Models;
using ProjectLexicon.Entities;
using NuGet.Configuration;
using System.Threading.Tasks;
using ProjectLexicon.Models.ForumThreads;
using static System.Net.Mime.MediaTypeNames;
using Duende.IdentityServer.Extensions;
using System.Security.Claims;

namespace ProjectLexicon.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForumPostController : Controller
    {
        private readonly ILogger<ForumPostController> _logger;
        private ApplicationDbContext Context { get; set; }
        private DbSet<ForumPost> DS { get; set; }
        private readonly IUserManagementService _umService;

        public ForumPostController(IUserManagementService umService, ILogger<ForumPostController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            Context = dbContext;
            DS = Context.ForumPosts;
            _umService = umService;
        }

        // =======================================
        // Get CurrentUserInfo
        // =======================================

        public class UserInfo
        {
            public string UserName { get; set; } = "";
            public string UserRole { get; set; } = "";
        }

        [HttpGet("UserInfo")]
        public Response<UserInfo> GetUserInfo()
        {
            UserInfo ret = UserId.GetUserInfo(User);
            return new Response<UserInfo>(ret);
        }

        [HttpGet("CurrentUser")]
        public async Task<Response<ApplicationUser>> GetCurrentUser(string id)
        {
            string userId = UserId.Get(User);
            var user = await _umService.FindUserAsync(id);

            if (user == null)
                return new Response<ApplicationUser>(404, "Post not found");

            return new Response<ApplicationUser>(user);
        }

        // =======================================
        // Get List
        // =======================================


        [HttpGet("list")]
        public Response<List<ForumPost>> GetList(string? filter, string? userId, int? ForumThreadId, string? tagIds, bool? archived)
        {
            List<int>? tagIdNumbers = parseIntList(tagIds);
            if (tagIdNumbers == null)
                return new Response<List<ForumPost>>(415, "Tag id's were not in recognized format");
            bool showArchived = UserId.HasRole(User, Role.Admin, Role.Sys);
            List<ForumPost> items = Filter(filter, userId, ForumThreadId, tagIdNumbers, showArchived);
            return new(items);
        }


        // =======================================
        // Get Item
        // =======================================

        [HttpGet("Item")]
        public Response<ForumPost> GetItem(int id)
        {
            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);

            if (item == null)
                return new Response<ForumPost>(404, "Post not found");

            item.QuotedPost = item.QuotedPostId switch {
                0 => null,
                _ => DS.FirstOrDefault(x => x.Id == item.QuotedPostId)

            };
            return new Response<ForumPost>(item);
        }


        // =======================================
        // === Add Item
        // =======================================
        [HttpPost("Add")]
        public Response<ForumPost> PostAdd(
            int forumThreadId,
            string? tagIds,
            string? text,
            string? quotedText,
            int? quotedPostId
         )
        {
            if (!ModelState.IsValid)
                return new Response<ForumPost>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.User, Role.Admin, Role.Sys))
            {
                return new Response<ForumPost>(101, "No permission");
            }

            List<int>? tagIdNumbers = parseIntList(tagIds);
            if (tagIdNumbers == null)
                return new Response<ForumPost>(415, "Tag id's were not in recognized format");
            if (quotedPostId == 0)
                quotedPostId = null;
            List<Tag> tags = DbUtils.GetItemsByIds(Context.Tags, tagIdNumbers);
            ForumPost? item = new() {
                ForumThreadId = forumThreadId,
                Tags = tags,
                Text = text ?? "",
                QuotedText = quotedText ?? "",
                QuotedPostId = quotedPostId,
                UserId = UserId.Get(User),
                CreatedDate = DateTime.Now,
            };

            DS.Add(item);
            Context.SaveChanges();

            // Reload post from database

            item = DS.FirstOrDefault(x => x.Id == item.Id);
            if (item == null)
                return new Response<ForumPost>(
                    404,
                    "An error seems to have occured while saving the new post. Please reload the page and check that your new post has been added");

            item.QuotedPost = item.QuotedPostId switch {
                0 => null,
                _ => DS.FirstOrDefault(x => x.Id == item.QuotedPostId)
            };
            return new Response<ForumPost>(item);
        }

        // =======================================
        // === Update Item
        // === - Mod can make changes at any time
        // === - A user can change his own post, (except forumThreadId), and only withing 5 minutes from creation
        // =======================================

        [HttpPost("Update")]
        public Response<ForumPost> PostUpdate(
            int id,
            int forumThreadId,
            string? tagIds,
            string text,
            string quotedText,
            int? quotedPostId
        )
        {
            if (!ModelState.IsValid)
                return new Response<ForumPost>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.User, Role.Admin, Role.Sys))
                return new Response<ForumPost>(101, "No permission");

            List<int>? tagIdNumbers = parseIntList(tagIds);
            if (tagIdNumbers == null)
                return new Response<ForumPost>(415, "Tag id's were not in recognized format");

            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
                return new Response<ForumPost>(404, "Post not found");

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
                    return new Response<ForumPost>(101, "No permission");
            }

            if (quotedPostId != null)
            {
                ForumPost? quotedPost = DS.FirstOrDefault(item => item.Id == quotedPostId);
                if (quotedPost == null)
                    return new Response<ForumPost>(404, "Quoted Post not found");
                if (!quotedPost.Text.Contains(quotedText))
                {
                    return new Response<ForumPost>(101, "Quoted Post does not contain quoted string");
                }
            }


            item.ForumThreadId = forumThreadId;
            item.Tags = DbUtils.GetItemsByIds(Context.Tags, tagIdNumbers);
            item.Text = text;
            item.QuotedPostId = quotedPostId;
            item.QuotedText = quotedText;
            Context.SaveChanges();

            return new Response<ForumPost>(item);
        }

        // =======================================
        // === Delete Item 
        // =======================================

        [HttpPost("delete")]
        public Response<ForumPost> PostDelete(int id)
        {
            if (!ModelState.IsValid)
                return new Response<ForumPost>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<ForumPost>(101, "No permission");
            }

            ForumPost? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
                return new Response<ForumPost>(404, "Post not found");


            item.ArchivedDate = DateTime.Now;
            Context.SaveChanges();
            return new Response<ForumPost>(item);
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

        private List<ForumPost> Filter(string? filter, string? userId, int? forumThreadId, List<int>? tagIds, bool archived)
        {
            return DS
                .Include("QuotedPost")
                .Where(p =>
                (string.IsNullOrEmpty(filter) || p.Text.Contains(filter))
                &&
                (string.IsNullOrEmpty(userId) || p.UserId == userId)
                &&
                (forumThreadId == null || forumThreadId == 0 || p.ForumThreadId == forumThreadId)
                &&
                (tagIds == null || tagIds.Count == 0 || p.Tags.Any(t => tagIds.Any(tagId => tagId == t.Id)))
                &&
                (archived || p.ArchivedDate == null)
                )
                .ToList();
        }
    }
}
