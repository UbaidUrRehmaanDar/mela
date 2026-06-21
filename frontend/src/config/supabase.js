// Supabase configuration for Mela
import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your new Supabase project credentials
// Get these from: Supabase Dashboard > Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = 'event-posters';
