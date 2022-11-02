using Microsoft.Build.Framework;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
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

        public static string Get(ClaimsPrincipal user)
        {
            return user?.FindFirstValue(userKey) ?? "";
        }
        public static bool HasRole(ClaimsPrincipal user, params string[] roles)
        {
            return null != user?.FindFirst(c => c.Type == roleKey && roles.Contains(c.Value));
        }
    }
}
