import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging
console.log('Supabase URL:', supabaseUrl ? '✓ Loaded' : '✗ Missing');
console.log('Supabase Key:', supabaseAnonKey ? '✓ Loaded' : '✗ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found!');
  console.error('Please ensure .env.local exists with:');
  console.error('EXPO_PUBLIC_SUPABASE_URL=your_url');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key');
  console.error('Then restart the Expo server with: npx expo start -c');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // For demo purposes, we'll use a simple auth flow
    // In production, implement proper authentication
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
