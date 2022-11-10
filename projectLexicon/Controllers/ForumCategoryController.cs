#nullable enable
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using ProjectLexicon.Models.Shared;
using System.Data;
using ProjectLexicon.Models.ForumCategories;
using ProjectLexicon.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using ProjectLexicon;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Duende.IdentityServer.Extensions;
using ProjectLexicon.Models.ForumThreads;

namespace ProjectLexicon.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForumCategoryController : ControllerBase
    {
        private readonly ILogger<ForumCategoryController> _logger;
        private ApplicationDbContext Context { get; set; }
        private DbSet<ForumCategory> DS { get; set; }

        public ForumCategoryController(ILogger<ForumCategoryController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            Context = dbContext;
            DS = Context.ForumCategories;
        }

        // =======================================
        // Get List - New version
        // =======================================

        [HttpGet("list")]
        public Response<List<ForumCategory>> GetList()
        {
            List<ForumCategory> ret = new();
            string? filter = null;
            ret.AddRange(string.IsNullOrEmpty(filter) ?
                DS :
                DS.Where(p => p.Name.Contains(filter))
             );
            return new Response<List<ForumCategory>>(ret);
        }


        // =======================================
        // Get Item
        // =======================================

        [HttpGet("Item")]
        public Response<ForumCategory> GetItem(int id)
        {
            ForumCategory? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
            {
                //return new Response(404, "Category not found");
                item = new ForumCategory() { Id = 0, Name = "" };
            }
            return new Response<ForumCategory>(item);
        }

        // =======================================
        // === Add Item
        // =======================================

        [HttpPost("Add")]
        public Response<ForumCategory> PostAdd(string name)
        {
            if (!ModelState.IsValid)
                return new Response<ForumCategory>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<ForumCategory>(101, "No permission");
            }
            ForumCategory? item = new() { Name = name, UserId = UserId.Get(User) };
            DS.Add(item);
            Context.SaveChanges();
            return new Response<ForumCategory>(item);
        }

        // =======================================
        // === Update Item
        // =======================================

        [HttpPost("Update")]
        public Response<ForumCategory> PostUpdate(int id, string name)
        {
            if (!ModelState.IsValid)
                return new Response<ForumCategory>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<ForumCategory>(101, "No permission");
            }

            ForumCategory? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
                return new Response<ForumCategory>(404, "Category not found");
            item.Name = name;
            Context.SaveChanges();

            return new Response<ForumCategory>(item);
        }

        // =======================================
        // === Delete Item 
        // =======================================

        [HttpPost("delete")]
        public Response<ForumCategory> PostDelete(int id)
        {
            if (!ModelState.IsValid)
                return new Response<ForumCategory>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<ForumCategory>(101, "No permission");
            }

            ForumCategory? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
            {
                // We try delete item that does not exist, so basically a success?
                return new Response<ForumCategory>();
            }

            var threads = Context.ForumThreads.Where(t => t.ForumCategoryId == id);
            if (threads != null && threads.Where(t => t.ArchivedDate == null).Any())
            {
                return new Response<ForumCategory>(102, "Can not delete the category because it has associated active threads");
            }

            if (threads != null && threads.Any())
            {
                item.ArchivedDate = DateTime.Now;
            }
            else
            {
                DS.Remove(item);
            }
            Context.SaveChanges();
            return new Response<ForumCategory>();
        }
    }
}
