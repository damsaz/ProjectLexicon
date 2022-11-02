using System.Collections.Generic;

namespace ProjectLexicon.Models
{
  
        public class ApplicationUserRoule
        {
            public string UserId { get; set; }

            public string RoleId { get; set; }


        }
        public class ApplicationUserRouleVM
        {

            public IList<ApplicationUserRoule> ApplicationUserRoules;
        }
    
}
