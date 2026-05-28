import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function fixPermissions() {
  await pb.admins.authWithPassword('admin@runningchores.com', 'Admin@12345');
  
  const collections = ['events', 'tasks', 'vendors', 'team_members', 'vendor_assignments', 'budget_items', 'approvals' , 'notifications'];
  
  for (const name of collections) {
    const collection = await pb.collections.getOne(name);
    await pb.collections.update(collection.id, {
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
    });
    console.log(`✅ ${name} permissions fixed`);
  }
  
  console.log('🎉 All permissions fixed!');
}

fixPermissions().catch(console.error);