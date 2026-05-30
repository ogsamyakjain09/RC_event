import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import pb from '../pocketbase';

interface CreateVendorAssignmentPageProps {
  eventId: string;
  onBack: () => void;
}

export function CreateVendorAssignmentPage({ eventId, onBack }: CreateVendorAssignmentPageProps) {
  const { vendors, refetchTasks } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    vendor_id: '',
    status: 'pending',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.vendor_id) {
      setError('Please select a vendor!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await pb.collection('vendor_assignments').create({
        event_id: eventId,
        vendor_id: form.vendor_id,
        status: form.status,
        notes: form.notes,
      });
      onBack();
    } catch (err) {
      setError('Failed to add vendor. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">Add Vendor to Event</h2>

      <div className="space-y-4">

        <div>
          <label className="text-sm font-medium block mb-1">Select Vendor *</label>
          <select name="vendor_id" value={form.vendor_id} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
            <option value="">-- Select a vendor --</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange}
            placeholder="Any notes about this vendor assignment..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
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
            {loading ? 'Adding...' : 'Add Vendor'}
          </button>
        </div>

      </div>
    </div>
  );
}