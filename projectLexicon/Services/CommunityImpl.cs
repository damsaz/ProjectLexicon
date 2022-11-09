using ProjectLexicon.Models.Events;
using ProjectLexicon.Models.Shared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectLexicon.Services
{
    public class CommunityImpl : ICommunity
    {
        private readonly ApplicationDbContext _context;

        public CommunityImpl(ApplicationDbContext context)
        {
            _context = context;
        }

        // CreateEvent

        public void CreateCommunityEvent(CommunityEvent @event)
        {
            try
            {
                if (@event == null)
                {
                    throw new ArgumentNullException(nameof(@event));
                }
                _context.CommunityEvents.Add(@event);
                _context.SaveChanges();

            }
            catch (Exception ex)
            {
                Console.WriteLine($"There has occured an exeception ${ex.Message} on CreateCommunityEvent");
            }
        }

        // Get List

        public IEnumerable<CommunityEvent> GetAllCommunityEvents()
        {
            var events = _context.CommunityEvents.ToList();
            if (events != null)
            {
                return events;
            }

            return null;
        }

        // Get Item

        public CommunityEvent GetCommunityEventById(int id)
        {
            CommunityEvent @event = _context.CommunityEvents.FirstOrDefault(e => e.Id == id);
            if (@event != null)
            {
                return @event;
            }

            else
            {
                return null;
            }

        }

        // Update

        public CommunityEvent UpdateAnEvent(CommunityEvent updatedEvent)
        {
            //First we need the existing item 
            //then we want to update it with the updatedEvent 
            if (updatedEvent == null)
            {
                return null;
            }

            var itemToUpdate = _context.CommunityEvents.FirstOrDefault(item => item.Id == updatedEvent.Id);
            itemToUpdate.Content = updatedEvent.Content;
            itemToUpdate.StartDate = updatedEvent.StartDate;
            itemToUpdate.Subject = updatedEvent.Subject;

            _context.SaveChanges();

            return itemToUpdate;
        }

        // Delete

        public void DeleteAnEvent(int id)
        {
            var itemToDelete = _context.CommunityEvents.FirstOrDefault(item => item.Id == id);
            if (itemToDelete != null)
            {
                _context.CommunityEvents.Remove(itemToDelete);
                _context.SaveChanges();
            }
        }
    }
}
