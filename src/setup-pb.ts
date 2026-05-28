import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setup() {
  // Login as admin
  await pb.admins.authWithPassword('admin@runningchores.com', 'Admin@12345');

  // Create events collection
  await pb.collections.create({
    name: 'events',
    type: 'base',
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
  });
  console.log('✅ events created');

  // Create tasks collection
  await pb.collections.create({
    name: 'tasks',
    type: 'base',
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
  });
  console.log('✅ tasks created');

  // Create vendors collection
  await pb.collections.create({
    name: 'vendors',
    type: 'base',
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
  });
  console.log('✅ vendors created');

  // Create team_members collection
  await pb.collections.create({
    name: 'team_members',
    type: 'base',
    fields: [
      { name: 'event_id', type: 'text' },
      { name: 'user_id', type: 'text' },
      { name: 'role', type: 'text' },
    ],
  });
  console.log('✅ team_members created');

  // Create vendor_assignments collection
  await pb.collections.create({
    name: 'vendor_assignments',
    type: 'base',
    fields: [
      { name: 'event_id', type: 'text' },
      { name: 'vendor_id', type: 'text' },
      { name: 'status', type: 'text' },
      { name: 'notes', type: 'text' },
    ],
  });
  console.log('✅ vendor_assignments created');

  console.log('🎉 ALL collections created successfully!');
}

setup().catch(console.error);