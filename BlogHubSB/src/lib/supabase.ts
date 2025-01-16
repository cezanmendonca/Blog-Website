import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Set session lifetime to 1 hour (in seconds)
    // You can adjust this value as needed
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        const item = localStorage.getItem(key);
        const parsed = item ? JSON.parse(item) : null;
        if (parsed && parsed.expires_at) {
          // Set expiration to 1 hour from now when getting the session
          parsed.expires_at = Math.floor(Date.now() / 1000) + 3600; // 3600 seconds = 1 hour
          localStorage.setItem(key, JSON.stringify(parsed));
        }
        return parsed;
      },
      setItem: (key, value) => {
        if (value && typeof value === 'object') {
          // Set expiration to 1 hour from now when setting the session
          value.expires_at = Math.floor(Date.now() / 1000) + 3600; // 3600 seconds = 1 hour
        }
        localStorage.setItem(key, JSON.stringify(value));
      },
      removeItem: (key) => localStorage.removeItem(key),
    },
  },
});