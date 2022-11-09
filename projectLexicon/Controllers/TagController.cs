﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectLexicon.Models.Tags;
using ProjectLexicon.Models.Shared;
using Microsoft.Extensions.Logging;
using ProjectLexicon.Services;
using System.Collections.Generic;
using System.Linq;
using ProjectLexicon.Models.ForumCategories;

namespace ProjectLexicon.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class TagController : Controller
    {
        private readonly ILogger<TagController> _logger;
        private ApplicationDbContext Context { get; set; }
        private DbSet<Tag> DS { get; set; }

        public TagController(ILogger<TagController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            Context = dbContext;
            DS = Context.Tags;
        }

        // =======================================
        // Get List
        // =======================================

        [HttpGet("list")]
        public Response<List<Tag>> GetList(string filter)
        {
            List<Tag> ret = new();
            ret.AddRange(string.IsNullOrEmpty(filter) ?
                DS :
                DS.Where(p => p.Name.Contains(filter))
             );
            return new Response<List<Tag>>(ret);
        }

        // =======================================
        // Get Item
        // =======================================

        [HttpGet("Item")]
        public Response<Tag> GetItem(int id)
        {
            Tag? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null) {
                item = new() { Name = "" };
            }
            return new Response<Tag>(item);
        }

        // =======================================
        // === Add Item
        // =======================================

        [HttpPost("Add")]
        public Response<Tag> PostAdd(string name)
        {
            if (!ModelState.IsValid)
                return new Response<Tag>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin)) {
                return new Response<Tag>(101, "No permission");
            }


            Tag? item = new() { Name = name, UserId = UserId.Get(User) };
            DS.Add(item);
            Context.SaveChanges();
            return new Response<Tag>(item);
        }

        // =======================================
        // === Update Item
        // =======================================

        [HttpPost]
        [HttpPost("Update")]
        public Response<Tag> PostUpdate(int id, string name)
        {
            if (!ModelState.IsValid)
                return new Response<Tag>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin)) {
                return new Response<Tag>(101, "No permission");
            }

            Tag? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null)
                return new Response<Tag>(404, "Tag not found");
            item.Name = name;
            Context.SaveChanges();

            return new Response<Tag>(item);
        }

        // =======================================
        // === Delete Item 
        // =======================================

        [HttpPost("delete")]
        public Response<Tag> PostDelete(int id)
        {
            if (!ModelState.IsValid)
                return new Response<Tag>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin)) {
                return new Response<Tag>(101, "No permission");
            }

            Tag? item = DS.FirstOrDefault(item => item.Id == id);
            if (item == null) {
                // We try delete item that does not exist, so basically a success?
                return new Response<Tag>();
            }
            DS.Remove(item);
            Context.SaveChanges();
            return new Response<Tag>();

        }
    }
}
