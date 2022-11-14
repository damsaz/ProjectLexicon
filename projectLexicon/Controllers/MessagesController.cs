using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using AutoMapper;
using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ProjectLexicon.Controllers;
using ProjectLexicon.Models;
using ProjectLexicon.Models.ForumCategories;
using ProjectLexicon.Models.Shared;
using ProjectLexicon.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProjectLexicon
{
    [Route("api/[controller]")]
    public class MessagesController : Controller
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IUserManagementService _umService;
        private readonly IMapper _mapper;
        private readonly IHelperService _helperService;
        private ApplicationDbContext Context { get; set; }
        private DbSet<Message> DS { get; set; }
        private DbSet<Conversation> DC { get; set; }
        public MessagesController(
            IConfiguration configuration,
            ILogger<UsersController> logger,
            IUserManagementService umService,
            IMapper mapper,
            IHelperService helperService
            , ApplicationDbContext dbContext)
        {
            _configuration = configuration;
            _logger = logger;
            _umService = umService;
            _mapper = mapper;
            _helperService = helperService;
            Context = dbContext;
            DS = Context.Message;
            DC = Context.Conversations;
        }
        // GET: api/values
        [HttpGet("{id}")]
        public List<Message> Get(string id)
        {
            List<Message> result = Context.Message.Where(x => x.Conversationtoken==(UserId.Get(User))+id || x.Conversationtoken == id+ (UserId.Get(User))).ToList();
            return result;
        }

        // GET api/values/5
        [HttpGet("GetUser")]
        public List<UserChatList> GetUser()
        {
            List<UserChatList> userChatLists = new List<UserChatList>();
            List<string> result = Context.Conversations.Where(x => x.Conversationtoken.Contains(UserId.Get(User))).Select(y=>y.Conversationtoken).ToList();
            foreach(string i in result)
            {
                UserChatList userChatList = new() { Userid = i.Replace(UserId.Get(User), ""), UserName = Context .Users.Where(m=>m.Id== i.Replace(UserId.Get(User),"")).Select(m=>m.FullName).FirstOrDefault()};
                // UserChatList result = Context.Conversations.Where(x => x.Conversationtoken.Contains(UserId.Get(User))).Select(y => y.Conversationtoken).ToList();
                userChatLists.Add(userChatList);
                }
             return userChatLists;
        }

        // POST api/values
        [HttpGet("Add")]
        public Response Post(string? Text,string? Rid)
        {
            
            if (!ModelState.IsValid)
                return new Response(100, "Invalid input");

            
            Conversation con = DC.Where(m => m.Conversationtoken == UserId.Get(User) + Rid || m.Conversationtoken == Rid + UserId.Get(User)).FirstOrDefault();
            if (con == null)
            {
                con = new() { Conversationtoken = UserId.Get(User) + Rid };
            DC.Add(con);
            }
            Message? item = new()
            {
                Text = Text,
                SID = UserId.Get(User),
                RID = Rid,
                CreatedTime = DateTime.Now
        ,
                Conversationtoken = con.Conversationtoken
            };
            DS.Add(item);
            Context.SaveChanges();
            return new Response(item);

        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

