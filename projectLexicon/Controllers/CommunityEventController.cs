using Duende.IdentityServer.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProjectLexicon.Models.Events;
using ProjectLexicon.Models.ForumPosts;
using ProjectLexicon.Models.ForumThreads;
using ProjectLexicon.Models.Shared;
using ProjectLexicon.Models.Tags;
using ProjectLexicon.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLexicon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommunityEventController : Controller
    {
        private readonly ILogger<ForumThreadController> _logger;
        private ApplicationDbContext Context { get; set; }
        private DbSet<CommunityEvent> DS { get; set; }
        // private readonly ICommunity _community;

        public CommunityEventController(ILogger<ForumThreadController> logger, ApplicationDbContext dbContext)
        {
            // _community = community;
            _logger = logger;
            Context = dbContext;
            DS = Context.CommunityEvents;
        }

        // Get List

        [HttpGet("list")]
        public Response<List<CommunityEvent>> GetList()
        {
            List<CommunityEvent> events = DS.ToList();
            // return Ok(events);
            return new Response<List<CommunityEvent>>(events);
        }


        // Get Item

        [HttpGet("Item")]
        public Response<CommunityEvent> GetItem(int id)
        {
            CommunityEvent @event = DS.FirstOrDefault(e => e.Id == id);
            if (@event != null)
            {
                return new Response<CommunityEvent>(@event);
                // return Ok(@event);
            }
            return new Response<CommunityEvent>(404, "Item not found");
            //return BadRequest();
        }

        // Create event


        [HttpPost("Add")]
        public Response<CommunityEvent> PostAdd(CommunityEvent newEventFromUser)
        {
            if (!ModelState.IsValid || newEventFromUser == null)
                return new Response<CommunityEvent>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<CommunityEvent>(101, "No permission");
            }


            newEventFromUser.UserId = UserId.Get(User);
            newEventFromUser.Timestamp = DateTime.Now;
            DS.Add(newEventFromUser);
            Context.SaveChanges();
            return new Response<CommunityEvent>(newEventFromUser);
        }


        // Update

        [HttpPost("Update")]
        public Response<CommunityEvent> PostUpdate(CommunityEvent eventToBeUpdated)
        {
            if (!ModelState.IsValid || eventToBeUpdated == null)
                return new Response<CommunityEvent>(100, "Invalid input");
            if (!UserId.HasRole(User, Role.Admin))
            {
                return new Response<CommunityEvent>(101, "No permission");
            }

            var itemToUpdate = DS.FirstOrDefault(item => item.Id == eventToBeUpdated.Id);
            itemToUpdate.Content = eventToBeUpdated.Content;
            itemToUpdate.StartDate = eventToBeUpdated.StartDate;
            itemToUpdate.Subject = eventToBeUpdated.Subject;
            Context.SaveChanges();

            return new Response<CommunityEvent>(itemToUpdate);
            //return Ok(itemToUpdate);
        }

        // Delete

        [HttpPost("delete")]
        public Response<CommunityEvent> PostDelete(int id)
        {
            var itemToDelete = DS.FirstOrDefault(item => item.Id == id);
            if (itemToDelete != null)
            {
                DS.Remove(itemToDelete);
                Context.SaveChanges();
            }
            return new Response<CommunityEvent>();
        }
    }
}
