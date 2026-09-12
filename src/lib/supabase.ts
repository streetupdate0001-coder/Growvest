import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tmwcfmpzeflnfacndand.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtd2NmbXB6ZWZsbmZhY25kYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2ODIyNDAsImV4cCI6MjEwNDI1ODI0MH0.tWJt6So2D42uMxJhNxoIIonT9HcpAw5on2Rv5NVDTds';

// Safe in-memory storage fallback for restricted iframes
const inMemoryStorage = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

// Safe storage wrapper to prevent iframe SecurityError or null reference
const getSafeStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Test read/write
      const testKey = '__sb_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (_e) {
    // In restricted iframes, window.localStorage might throw SecurityError
  }
  return inMemoryStorage;
};

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: getSafeStorage()
  }
});

export default supabase;
