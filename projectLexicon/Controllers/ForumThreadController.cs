#nullable enable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectLexicon.Models.Shared;
using System.Data;
using ProjectLexicon.Models.ForumThreads;
using ProjectLexicon.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;


namespace ProjectLexicon.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForumThreadController : Controller
    {
        private readonly ILogger<ForumThreadController> _logger;
        private ApplicationDbContext Context { get; set; }
        private DbSet<ForumThread> DS { get; set; }

        public ForumThreadController(ILogger<ForumThreadController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            Context = dbContext;
            DS = Context.ForumThreads;
        }

        // =======================================
        // Get List
        // =======================================

        [HttpGet("list")]
        public Response<List<ForumThread>> GetList(string? filter, int? userId, int? ForumCategoryId)
        {
            return new Response<List<ForumThread>>(Filter(filter, userId, ForumCategoryId));
        }

        // =======================================
        // Get Item
        // =======================================

        [HttpGet("Item")]
        public Response<ForumThread> GetItem(int id)
        {
            ForumThread? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
            {
                item = new ForumThread() { Name = "" };
            }
            return new Response<ForumThread>(item);
        }


        // =======================================
        // === Add Item
        // =======================================

        [HttpPost("Add")]
        public Response<ForumThread> PostAdd(int forumCategoryId, string name)
        {
            if (!ModelState.IsValid)
                return new Response<ForumThread>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin, Role.User))
            {
                return new Response<ForumThread>(101, "No permission");
            }

            ForumThread item = new();
            item.Name = name;
            item.ForumCategoryId = forumCategoryId;
            item.UserId = UserId.Get(User);
            item.CreatedDate = DateTime.Now;

            DS.Add(item);
            Context.SaveChanges();
            return new Response<ForumThread>(item);
        }

        // =======================================
        // === Update Item
        // === A thread can be moved to another category or change name only by moderator
        // =======================================

        [HttpPost("Update")]
        public Response<ForumThread> PostUpdate(int id, int forumCategoryId, string name)
        {
            if (!ModelState.IsValid)
                return new Response<ForumThread>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<ForumThread>(101, "No permission");
            }

            ForumThread? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
                return new Response<ForumThread>(404, "Thread not found");


            item.Name = name;
            item.ForumCategoryId = forumCategoryId;
            Context.SaveChanges();

            return new Response<ForumThread>(item);
        }

        // =======================================
        // === Delete Item 
        // === Deleting a thread also deletes all it's posts... is this the way we want it to work?
        // =======================================

        [HttpPost("delete")]
        public Response<ForumThread> PostDelete(int id)
        {
            if (!ModelState.IsValid)
                return new Response<ForumThread>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<ForumThread>(101, "No permission");
            }

            ForumThread? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
            {
                // We try delete item that does not exist, so basically a success?
                return new Response<ForumThread>();
            }
            // Warning! Do not use this on large datasets!
            // Context.ForumPost.RemoveRange(Context.ForumPost.Where(x => x.ThreadId = id));

            DS.Remove(item);
            Context.SaveChanges();
            return new Response<ForumThread>();
        }

        private List<ForumThread> Filter(string? filter, int? userId, int? ForumCategoryId)
        {
            if (string.IsNullOrEmpty(filter) && userId == 0 && ForumCategoryId == 0)
                return new();
            return DS.Where(p => (string.IsNullOrEmpty(filter) || p.Name.Contains(filter))
                &&
                (userId == null || userId == 0 || p.ForumCategoryId == ForumCategoryId)
                &&
                (ForumCategoryId == null || ForumCategoryId == 0 || p.ForumCategoryId == ForumCategoryId)
                ).ToList();
            ;
        }
    }
}
