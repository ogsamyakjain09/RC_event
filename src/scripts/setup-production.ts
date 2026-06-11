import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config();

const pbUrl = process.env.VITE_PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

async function setup() {
  console.log(`Connecting to PocketBase at: ${pbUrl}`);
  
  try {
    const health = await pb.health.check();
    console.log('✅ Connectivity Check (Health):', JSON.stringify(health));
  } catch (err: any) {
    console.error('❌ Internal Connectivity Check Failed:', err.message);
  }

  try {
    console.log('Attempting admin login...');
    // Login as admin
    // In PB v0.23+, authData returns 'record' instead of 'admin' for admin auth as well
    const authData = await pb.admins.authWithPassword('admin@runningchores.com', 'Admin@12345');
    console.log('✅ Authenticated as admin:', authData?.record?.email || authData?.admin?.email || 'Success');
  } catch (err: any) {
    console.error('❌ Failed to authenticate as admin.');
    console.log('Error Status:', err?.status || 'N/A');
    console.log('Error Message:', err?.message || 'N/A');
    console.log('Error Data:', JSON.stringify(err?.data || {}));
    console.log('DEBUG: Make sure you created the admin at the Railway URL /_/');
    console.log('DEBUG: Current VITE_PB_URL is:', pbUrl);
    return;
  }

  const collections = [
    {
      name: 'events',
      fields: [
        { name: 'organization_id', type: 'text' },
        { name: 'event_name', type: 'text' },
        { name: 'event_type', type: 'text' },
        { name: 'couple_name_1', type: 'text' },
        { name: 'couple_name_2', type: 'text' },
        { name: 'event_date', type: 'date' },
        { name: 'venue_name', type: 'text' },
        { name: 'venue_city', type: 'text' },
        { name: 'total_guests_expected', type: 'number' },
        { name: 'total_budget', type: 'number' },
        { name: 'currency', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'readiness_score', type: 'number' },
        { name: 'created_by', type: 'text' },
      ],
    },
    {
      name: 'tasks',
      fields: [
        { name: 'event_id', type: 'text' },
        { name: 'organization_id', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'priority', type: 'text' },
        { name: 'due_date', type: 'date' },
        { name: 'assigned_to', type: 'text' },
        { name: 'vendor_id', type: 'text' },
        { name: 'completed_at', type: 'date' },
      ],
    },
    {
      name: 'vendors',
      fields: [
        { name: 'organization_id', type: 'text' },
        { name: 'name', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'average_rating', type: 'number' },
        { name: 'total_reviews', type: 'number' },
        { name: 'is_verified', type: 'bool' },
        { name: 'is_active', type: 'bool' },
      ],
    },
    {
      name: 'budget_items',
      fields: [
        { name: 'event_id', type: 'text' },
        { name: 'organization_id', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'vendor_id', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'allocated_amount', type: 'number' },
        { name: 'estimated_amount', type: 'number' },
        { name: 'spent_amount', type: 'number' },
        { name: 'status', type: 'text' },
        { name: 'payment_date', type: 'date' },
      ],
    },
    {
      name: 'approvals',
      fields: [
        { name: 'event_id', type: 'text' },
        { name: 'organization_id', type: 'text' },
        { name: 'approval_type', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'requested_by', type: 'text' },
        { name: 'approver_id', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'approval_date', type: 'date' },
        { name: 'approval_comments', type: 'text' },
        { name: 'due_date', type: 'date' },
        { name: 'metadata', type: 'json' },
      ],
    },
    {
        name: 'notifications',
        fields: [
            { name: 'organization_id', type: 'text' },
            { name: 'user_id', type: 'text' },
            { name: 'type', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'body', type: 'text' },
            { name: 'related_entity_type', type: 'text' },
            { name: 'related_entity_id', type: 'text' },
            { name: 'is_read', type: 'bool' },
        ],
    },
    {
      name: 'vendor_assignments',
      fields: [
        { name: 'event_id', type: 'text' },
        { name: 'vendor_id', type: 'text' },
        { name: 'task_id', type: 'text' },
        { name: 'organization_id', type: 'text' },
        { name: 'assignment_scope', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'confirmed_at', type: 'date' },
        { name: 'start_date', type: 'date' },
        { name: 'end_date', type: 'date' },
      ],
    },
  ];

  for (const col of collections) {
    try {
      await pb.collections.create({
        name: col.name,
        type: 'base',
        fields: col.fields,
      });
      console.log(`✅ Collection "${col.name}" created`);
    } catch (err: any) {
      if (err.status === 400) {
        console.log(`ℹ️ Collection "${col.name}" already exists`);
      } else {
        console.error(`❌ Error creating "${col.name}":`, err.message);
      }
    }
  }

  console.log('🎉 Database setup complete!');
}

setup().catch(console.error);
