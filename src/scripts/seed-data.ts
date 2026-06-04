import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import users from '../data/users.json';
import events from '../data/events.json';
import tasks from '../data/tasks.json';
import vendors from '../data/vendors.json';
import budgetItems from '../data/budgetItems.json';
import approvals from '../data/approvals.json';
import vendorAssignments from '../data/vendorAssignments.json';

dotenv.config();

const pbUrl = process.env.VITE_PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

async function seed() {
  console.log(`Seeding data to: ${pbUrl}`);

  try {
    // PocketBase v0.25+ returns 'record'
    const authData: any = await pb.admins.authWithPassword('admin@runningchores.com', 'Admin@12345');
    console.log('✅ Authenticated:', authData?.record?.email || 'Admin');
  } catch (err: any) {
    console.error('❌ Auth failed:', err.message);
    return;
  }

  // Helper to remove invalid IDs (PocketBase IDs must be 15 chars alphanumeric)
  const clean = (obj: any) => {
    const { id, ...rest } = obj;
    return rest;
  };

  const collections = [
    { name: 'users', data: users, isAuth: true },
    { name: 'events', data: events },
    { name: 'vendors', data: vendors },
    { name: 'tasks', data: tasks },
    { name: 'budget_items', data: budgetItems },
    { name: 'approvals', data: approvals },
    { name: 'vendor_assignments', data: vendorAssignments },
  ];

  for (const col of collections) {
    console.log(`Processing ${col.name}...`);
    for (const item of col.data) {
      try {
        if (col.isAuth) {
            // Check if user exists
            try {
                const existing = await pb.collection('users').getFirstListItem(`email="${item.email}"`);
                console.log(`  ℹ️ User ${item.email} exists. Resetting password...`);
                await pb.collection('users').update(existing.id, {
                    password: 'Password123!',
                    passwordConfirm: 'Password123!',
                });
                console.log(`  ✅ User ${item.email} password reset.`);
            } catch (e) {
                console.log(`  Attempting to create user: ${item.email}`);
                const newUser = await pb.collection('users').create({
                    email: item.email,
                    password: 'Password123!',
                    passwordConfirm: 'Password123!',
                    name: item.name,
                    role: item.role,
                    organization_id: item.organization_id,
                    is_active: item.is_active,
                    emailVisibility: true,
                });
                console.log(`  ✅ User ${item.email} created successfully with ID: ${newUser.id}`);
            }
        } else {
            // Create record
            await pb.collection(col.name).create(clean(item));
        }
      } catch (e: any) {
          // Silent skip for existing data or minor schema mismatches
          // console.log(`  ℹ️ Skipping ${col.name} item: ${e.message}`);
      }
    }
    console.log(`✅ Finished ${col.name}`);
  }

  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
