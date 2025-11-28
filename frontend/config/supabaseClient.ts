import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project URL and Anon Key
const supabaseUrl = 'https://bpsktktmazigrifcnzum.supabase.co'; // e.g., https://your-project.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwc2t0a3RtYXppZ3JpZmNuenVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyOTU1MjUsImV4cCI6MjA3OTg3MTUyNX0.hVc9nYO4QwqQN8yGupxD3g1zIX_RUEFt2XSVtbTocQU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // This ensures the session is persisted (default is true)
    autoRefreshToken: true, // Automatically refresh the token when it expires
    detectSessionInUrl: false, // Not needed for React Native
    storage:AsyncStorage
  },
});