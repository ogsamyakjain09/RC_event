import { useState } from 'react';
import pb from '../pocketbase';
import { useEvents } from '../context/EventContext';

interface CreateEventPageProps {
  onBack: () => void;
}

export function CreateEventPage({ onBack }: CreateEventPageProps) {
  const { refetchEvents } = useEvents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    event_name: '',
    event_type: 'wedding',
    couple_name_1: '',
    couple_name_2: '',
    event_date: '',
    venue_name: '',
    venue_city: '',
    total_guests_expected: '',
    total_budget: '',
    currency: 'INR',
    status: 'planning',
    readiness_score: 0,
    organization_id: 'org_001',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.event_name || !form.couple_name_1 || !form.event_date) {
      setError('Please fill in event name, couple name, and date!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // This saves the new event to PocketBase database
      await pb.collection('events').create({
        ...form,
        total_guests_expected: Number(form.total_guests_expected),
        total_budget: Number(form.total_budget),
      });
      await refetchEvents(); // Refresh events list
      onBack(); // Go back to dashboard
    } catch (err) {
      setError('Failed to create event. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">Create New Event</h2>

      <div className="space-y-4">

        <div>
          <label className="text-sm font-medium block mb-1">Event Name *</label>
          <input name="event_name" value={form.event_name} onChange={handleChange}
            placeholder="e.g. Priya & Arjun Wedding"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Event Type</label>
          <select name="event_type" value={form.event_type} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
            <option value="wedding">Wedding</option>
            <option value="mehndi">Mehndi</option>
            <option value="haldi">Haldi</option>
            <option value="reception">Reception</option>
            <option value="engagement">Engagement</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Bride/Partner 1 *</label>
            <input name="couple_name_1" value={form.couple_name_1} onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Groom/Partner 2</label>
            <input name="couple_name_2" value={form.couple_name_2} onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Event Date *</label>
          <input name="event_date" type="date" value={form.event_date} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Venue Name</label>
            <input name="venue_name" value={form.venue_name} onChange={handleChange}
              placeholder="e.g. Taj Palace"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">City</label>
            <input name="venue_city" value={form.venue_city} onChange={handleChange}
              placeholder="e.g. Mumbai"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Total Guests</label>
            <input name="total_guests_expected" type="number" value={form.total_guests_expected} onChange={handleChange}
              placeholder="500"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Budget (INR)</label>
            <input name="total_budget" type="number" value={form.total_budget} onChange={handleChange}
              placeholder="1000000"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none" />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={onBack}
            className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-accent transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-3 rounded-xl bg-brand-primary text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>

      </div>
    </div>
  );
}