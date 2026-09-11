import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tmwcfmpzeflnfacndand.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtd2NmbXB6ZWZsbmZhY25kYW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2ODIyNDAsImV4cCI6MjEwNDI1ODI0MH0.tWJt6So2D42uMxJhNxoIIonT9HcpAw5on2Rv5NVDTds';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

export default supabase;
