import { createClient } from '@supabase/supabase-js';

// Note: trace import would create circular dependency, so we use console directly here
console.log('[BOOT] supabaseClient: module loading');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

console.log('[BOOT] supabaseClient: env check', { 
  hasUrl: !!supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 30) + '...' 
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[BOOT] supabaseClient: MISSING ENV VARS');
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

console.log('[BOOT] supabaseClient: creating client');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('[BOOT] supabaseClient: client created');
