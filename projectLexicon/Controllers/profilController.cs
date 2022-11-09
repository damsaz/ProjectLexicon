using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ProjectLexicon.Models;
using ProjectLexicon.Services;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ProjectLexicon.Controllers
{
	[ApiController]	
    [Route("api/[controller]")]


    public class profilController : Controller
	{
		private readonly ILogger<UsersController> _logger;
		private readonly IConfiguration _configuration;
		private readonly IUserManagementService _umService;
		private readonly IMapper _mapper;
		private readonly IHelperService _helperService;

		public profilController(
			IConfiguration configuration,
			ILogger<UsersController> logger,
			IUserManagementService umService,
			IMapper mapper,
			IHelperService helperService)
		{
			_configuration = configuration;
			_logger = logger;
			_umService = umService;
			_mapper = mapper;
			_helperService = helperService;
		}
		// GET: /<controller>/
		// GET: api/users/5
		// [HttpGet("{id}"), Name = "Get"]
		[HttpGet("{id}")]
		public async Task<ActionResult<UserModel>> Get(string id)
		{
			var user = await _umService.FindUserAsync(id);

			if (user == null)
				return NotFound();

			UserModel userModel = _mapper.Map<UserModel>(user);
			string userRole = await _umService.GetUserRoleAsync(user.Id, true);
			userModel.Role = userRole;

			return userModel;
		}
	}
}

