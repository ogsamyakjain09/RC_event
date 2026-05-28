import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090');

// Keep auth token in sync
pb.authStore.onChange(() => {
  console.log('Auth changed:', pb.authStore.isValid);
});

export default pb;