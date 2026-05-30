import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import pb from '../pocketbase';

interface CreateBudgetItemPageProps {
  eventId: string;
  onBack: () => void;
}

export function CreateBudgetItemPage({ eventId, onBack }: CreateBudgetItemPageProps) {
  const { vendors, refetchBudgetItems } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    category: '',
    vendor_id: '',
    allocated_amount: '',
    spent_amount: '0',
    status: 'active',
    notes: '',
    organization_id: 'org_001',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.category || !form.allocated_amount) {
      setError('Please fill in category and allocated amount!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await pb.collection('budget_items').create({
        ...form,
        event_id: eventId,
        allocated_amount: Number(form.allocated_amount),
        spent_amount: Number(form.spent_amount),
      });
      await refetchBudgetItems();
      onBack();
    } catch (err) {
      setError('Failed to add budget item. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">Add Budget Item</h2>

      <div className="space-y-4">

        <div>
          <label className="text-sm font-medium block mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
            <option value="">-- Select category --</option>
            <option value="decoration">Decoration</option>
            <option value="catering">Catering</option>
            <option value="photography">Photography</option>
            <option value="music">Music</option>
            <option value="venue">Venue</option>
            <option value="makeup">Makeup</option>
            <option value="transport">Transport</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Vendor (optional)</label>
          <select name="vendor_id" value={form.vendor_id} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
            <option value="">-- Select vendor --</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Allocated Amount (₹) *</label>
            <input name="allocated_amount" type="number" value={form.allocated_amount} onChange={handleChange}
              placeholder="200000"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Spent Amount (₹)</label>
            <input name="spent_amount" type="number" value={form.spent_amount} onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange}
            placeholder="Any notes about this budget item..."
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
            {loading ? 'Adding...' : 'Add Budget Item'}
          </button>
        </div>

      </div>
    </div>
  );
}
