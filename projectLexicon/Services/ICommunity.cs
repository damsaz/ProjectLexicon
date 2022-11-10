using ProjectLexicon.Models.Events;
using System.Collections.Generic;

namespace ProjectLexicon.Services
{
    public interface ICommunity
    {

        IEnumerable<CommunityEvent> GetAllCommunityEvents();
        CommunityEvent GetCommunityEventById(int id);
        void CreateCommunityEvent(CommunityEvent events);
        CommunityEvent UpdateAnEvent(CommunityEvent updatedEvent);
        void DeleteAnEvent(int id);
    }
}
