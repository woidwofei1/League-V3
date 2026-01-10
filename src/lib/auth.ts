import { supabase } from './supabaseClient';
import { trace } from './bootTrace';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * Ensure we have an anonymous session.
 * If no session exists, creates one via signInAnonymously().
 * Returns the session.
 */
export async function ensureAnonymousSession(): Promise<Session> {
  trace('auth: ensure anonymous session start');
  
  // First check if we already have a session
  const { data: { session: existingSession }, error: getError } = await supabase.auth.getSession();
  
  if (getError) {
    trace('auth: getSession error', { error: getError.message });
    throw getError;
  }
  
  if (existingSession) {
    trace('auth: session confirmed (existing)', { userId: existingSession.user.id });
    return existingSession;
  }
  
  // No session - create an anonymous one
  trace('auth: no existing session, signing in anonymously');
  const { data, error: signInError } = await supabase.auth.signInAnonymously();
  
  if (signInError) {
    trace('auth: signInAnonymously error', { error: signInError.message });
    throw signInError;
  }
  
  if (!data.session) {
    trace('auth: signInAnonymously returned no session');
    throw new Error('Failed to create anonymous session');
  }
  
  trace('auth: anonymous signed in', { userId: data.session.user.id });
  
  // Verify session is now available
  const { data: { session: verifySession } } = await supabase.auth.getSession();
  if (verifySession) {
    trace('auth: session confirmed (verified after sign in)', { userId: verifySession.user.id });
    return verifySession;
  }
  
  return data.session;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

/**
 * Get the current session (if any).
 */
export async function getSession(): Promise<Session | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return session;
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}
