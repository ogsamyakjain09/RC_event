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
  } catch (err: any) {
    console.error('❌ Auth failed:', err.message);
    console.log('Check if your Railway URL is correct and you created the admin account.');
    return;
  }

  // Helper to remove invalid IDs (PocketBase IDs must be 15 chars alphanumeric)
  const clean = (obj: any) => {
    const { id, ...rest } = obj;
    return rest;
  };

  // Seed Users
  for (const user of users) {
    try {
      // For the users collection, we use .create
      // We check if it exists first by email
      try {
        await pb.collection('users').getFirstListItem(`email="${user.email}"`);
        console.log(`ℹ️ User ${user.email} already exists`);
      } catch (e) {
        await pb.collection('users').create({
          ...clean(user),
          password: 'Password123!',
          passwordConfirm: 'Password123!',
          emailVisibility: true,
        });
        console.log(`✅ User ${user.email} created`);
      }
    } catch (e: any) {
        console.log(`❌ Error creating user ${user.email}: ${e.message}`);
    }
  }

  // Seed Events
  for (const event of events) {
    try {
      await pb.collection('events').create(clean(event));
      console.log(`✅ Event ${event.event_name} created`);
    } catch (e: any) {
      console.log(`❌ Error creating event: ${e.message}`);
    }
  }

  // Seed Vendors
  for (const vendor of vendors) {
    try {
      await pb.collection('vendors').create(clean(vendor));
      console.log(`✅ Vendor ${vendor.name} created`);
    } catch (e: any) {
      console.log(`❌ Error creating vendor: ${e.message}`);
    }
  }

  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
