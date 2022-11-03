using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLexicon.Models.Shared
{
    static public class DbUtils
    {
        static public List<TItem> GetItemsByIds<TItem>(DbSet<TItem> dbSet, List<int> ids)
            where TItem : EntityItem, new()
        {
            if (ids == null || ids.Count == 0)
                return new();
            List<TItem> items = dbSet.Where(item => ids.Contains(item.Id)).ToList();
            return items;
        }
    }
}
