// Supabase configuration for Mela
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://poyikbsrlwilpeojeuaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveWlrYnNybHdpbHBlb2pldWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjQwMjIsImV4cCI6MjA5MTE0MDAyMn0.0cQBLeXQpkGPaL7rLtViOaKGzJYQtd-WNPAVj5klKsk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = 'event-posters';
