import { useState } from 'react';
import pb from '../pocketbase';
import { useAppData } from '../context/AppDataContext';

interface CreateApprovalPageProps {
  eventId: string;
  onBack: () => void;
}

export function CreateApprovalPage({ eventId, onBack }: CreateApprovalPageProps) {
  const { refetchApprovals } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    requested_by: 'admin',
    status: 'pending',
    amount: '',
    organization_id: 'org_001',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      setError('Please fill in title and description!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await pb.collection('approvals').create({
        ...form,
        event_id: eventId,
        amount: Number(form.amount) || 0,
      });
      await refetchApprovals();
      onBack();
    } catch (err) {
      setError('Failed to create approval. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">Create Approval Request</h2>

      <div className="space-y-4">

        <div>
          <label className="text-sm font-medium block mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Extra budget for flowers"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Explain what needs approval..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Amount (₹) if applicable</label>
          <input name="amount" type="number" value={form.amount} onChange={handleChange}
            placeholder="50000"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Requested By</label>
          <select name="requested_by" value={form.requested_by} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="coordinator">Coordinator</option>
            <option value="couple">Wedding Couple</option>
          </select>
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
            {loading ? 'Creating...' : 'Create Approval'}
          </button>
        </div>

      </div>
    </div>
  );
}
