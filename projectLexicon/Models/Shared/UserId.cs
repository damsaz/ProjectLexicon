using Microsoft.Build.Framework;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using static ProjectLexicon.Controllers.ForumPostController;
using static System.Net.WebRequestMethods;

namespace ProjectLexicon.Models.Shared
{
    /// <summary>
    /// Static class for get id of current user, and for check if current user has access to role(s)
    /// Maybe there's a better way but i didn't find any
    /// </summary>
    static public class UserId
    {
        const string userKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        const string roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const string emailKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

        // Gets user ID
        public static string Get(ClaimsPrincipal user)
        {
            return user?.FindFirstValue(userKey) ?? "";
        }

        public static string GetUserName(ClaimsPrincipal user)
        {
            // Well yeah, this actually returns the email address and not the name,
            // which is stupid since we probably don't want the emailaddress publically visible.
            // As far as i can see there's no user name in the claims object?
            // Do we have usernames for public view at all in the database?
            return user?.FindFirstValue(emailKey) ?? "";
        }

        public static string GetRole(ClaimsPrincipal user)
        {
            if (user == null)
                return "";
            string[] roles = new string[] { Role.Sys, Role.Admin, Role.User };
            return roles.FirstOrDefault(role => HasRole(user, role)) ?? "";
        }

        public static bool HasRole(ClaimsPrincipal user, params string[] roles)
        {
            return null != user?.FindFirst(c => c.Type == roleKey && roles.Contains(c.Value));
        }

        public static UserInfo GetUserInfo(ClaimsPrincipal user)
        {
            return new UserInfo() {
                UserName = GetUserName(user),
                UserRole = GetRole(user)
            };
        }
    }
}
