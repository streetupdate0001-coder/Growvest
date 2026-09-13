const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://growvestx.com'
import { supabase } from './lib/supabase';
export { supabase };
export default supabase;
