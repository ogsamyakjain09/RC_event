import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

interface CreateTaskPageProps {
  eventId: string;
  onBack: () => void;
}

export function CreateTaskPage({ eventId, onBack }: CreateTaskPageProps) {
  const { createTask } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'not_started',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    vendor_id: '',
    organization_id: 'org_001',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title) {
      setError('Please enter task title!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createTask({
        ...form,
        event_id: eventId,
      });
      onBack();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">Create New Task</h2>

      <div className="space-y-4">

        <div>
          <label className="text-sm font-medium block mb-1">Task Title *</label>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Book venue"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Task details..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none">
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Due Date</label>
          <input name="due_date" type="date" value={form.due_date} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Assign To</label>
          <input name="assigned_to" value={form.assigned_to} onChange={handleChange}
            placeholder="e.g. admin, vendor, coordinator"
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
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>

      </div>
    </div>
  );
}