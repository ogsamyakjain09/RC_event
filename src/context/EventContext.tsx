import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import pb from '../pocketbase';
import type { Event } from '../types';

interface EventContextType {
  events: Event[];
  activeEvent: Event | null;
  setActiveEvent: (event: Event) => void;
  getEventById: (id: string) => Event | undefined;
  loading: boolean;
  refetchEvents: () => void;
}

const EventContext = createContext<EventContextType>({
  events: [],
  activeEvent: null,
  setActiveEvent: () => {},
  getEventById: () => undefined,
  loading: false,
  refetchEvents: () => {},
});

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEvent, setActiveEventState] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      // This calls PocketBase API to get ALL events from database
      const records = await pb.collection('events').getFullList(
  
);
      const mapped = records.map((r) => ({
        id: r.id,
        organization_id: r.organization_id,
        event_name: r.event_name,
        event_type: r.event_type,
        couple_name_1: r.couple_name_1,
        couple_name_2: r.couple_name_2,
        event_date: r.event_date,
        venue_name: r.venue_name,
        venue_city: r.venue_city,
        total_guests_expected: r.total_guests_expected,
        total_budget: r.total_budget,
        currency: r.currency,
        status: r.status,
        readiness_score: r.readiness_score,
        created_by: r.created_by,
        created_at: r.created,
      })) as Event[];
      setEvents(mapped);
      if (mapped.length > 0 && !activeEvent) {
        setActiveEventState(mapped[0]);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const setActiveEvent = useCallback((event: Event) => {
    setActiveEventState(event);
  }, []);

  const getEventById = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events]
  );

  return (
    <EventContext.Provider value={{
      events,
      activeEvent,
      setActiveEvent,
      getEventById,
      loading,
      refetchEvents: fetchEvents,
    }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => useContext(EventContext);