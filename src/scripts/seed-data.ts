import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import users from '../data/users.json';
import events from '../data/events.json';
import tasks from '../data/tasks.json';
import vendors from '../data/vendors.json';

dotenv.config();

const pbUrl = process.env.VITE_PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

async function seed() {
  console.log(`Seeding data to: ${pbUrl}`);

  try {
    await pb.admins.authWithPassword('admin@runningchores.com', 'Admin@12345');
    console.log('✅ Authenticated');
  } catch (err) {
    console.error('❌ Auth failed');
    return;
  }

  // Seed Users (Manually creating them in auth collection is tricky via SDK, 
  // but we can create them as records if the collection is 'base', 
  // however 'users' is usually 'auth' type).
  // For 'auth' collections, we use .create() with password.
  for (const user of users) {
    try {
      await pb.collection('users').create({
        ...user,
        password: 'Password123!',
        passwordConfirm: 'Password123!',
        emailVisibility: true,
      });
      console.log(`✅ User ${user.email} created`);
    } catch (e: any) {
        console.log(`ℹ️ User ${user.email} exists or error: ${e.message}`);
    }
  }

  // Seed Events
  for (const event of events) {
    try {
      await pb.collection('events').create(event);
      console.log(`✅ Event ${event.event_name} created`);
    } catch (e) {}
  }

  // Seed Vendors
  for (const vendor of vendors) {
    try {
      await pb.collection('vendors').create(vendor);
      console.log(`✅ Vendor ${vendor.name} created`);
    } catch (e) {}
  }

  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
