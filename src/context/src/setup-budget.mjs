import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

async function setup() {
  await pb.admins.authWithPassword('admin@runningchores.com', 'Admin@12345');
  
  await pb.collections.create({
    name: 'budget_items',
    type: 'base',
    fields: [
      { name: 'event_id', type: 'text' },
      { name: 'organization_id', type: 'text' },
      { name: 'category', type: 'text' },
      { name: 'vendor_id', type: 'text' },
      { name: 'allocated_amount', type: 'number' },
      { name: 'spent_amount', type: 'number' },
      { name: 'status', type: 'text' },
      { name: 'notes', type: 'text' },
    ],
  });
  console.log('✅ budget_items collection created!');
}

setup().catch(console.error);
