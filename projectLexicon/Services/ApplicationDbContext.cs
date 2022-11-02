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

namespace ProjectLexicon.Services
{
	public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
	{
		public DbSet<Gender> Genders { get; set; }

		public ApplicationDbContext(
			DbContextOptions options,
			IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
		{
		}
	}
}
