import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { ensureAnonymousSession, onAuthStateChange } from '../lib/auth';
import { getMyProfile, type Profile } from '../lib/profile';
import { supabase } from '../lib/supabaseClient';
import { trace } from '../lib/bootTrace';
import { AccessCodePage } from '../pages/SignInPage';
import { ErrorPanel } from './ErrorPanel';

interface AuthGateProps {
  children: ReactNode;
}

// States:
// - 'loading': initial boot, checking/creating session
// - 'no-profile': have anonymous session, but no player claimed
// - 'authenticated': have session AND profile
// - 'error': something went wrong
type AuthState = 'loading' | 'no-profile' | 'authenticated' | 'error';

interface AuthError {
  message: string;
  details?: string;
}

trace('AuthGate: module loaded');

export function AuthGate({ children }: AuthGateProps) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<AuthError | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  trace('AuthGate: component render', { authState, isAuthenticated });

  // Initial auth check on mount
  useEffect(() => {
    let cancelled = false;
    trace('AuthGate: useEffect mount');

    async function checkAuth() {
      trace('auth: start');
      
      try {
        // Diagnostic: ping players table to verify DB connectivity
        trace('db: players ping start');
        const { data: pingData, error: pingError } = await supabase
          .from('players')
          .select('id')
          .limit(1);
        trace('db: players ping resolved', { 
          ok: !pingError, 
          error: pingError?.message,
          hasData: !!pingData?.length 
        });

        // Step 1: Ensure we have an anonymous session
        trace('auth: ensureAnonymousSession start');
        const session = await ensureAnonymousSession();
        trace('auth: ensureAnonymousSession resolved', { hasSession: !!session });
        
        if (cancelled) return;

        if (!session) {
          trace('auth: failed to create session -> error');
          setError({ message: 'Failed to create session', details: 'Could not establish anonymous session' });
          setAuthState('error');
          return;
        }

        // Mark as authenticated (we have a valid session)
        trace('auth: session established, marking authenticated');
        setIsAuthenticated(true);

        // Step 2: Get profile to see if player claimed
        trace('profile: fetch start');
        const profile = await getMyProfile();
        trace('profile: fetch end', { hasProfile: !!profile });
        
        if (cancelled) return;

        const newState = profile ? 'authenticated' : 'no-profile';
        trace('auth: final state', { state: newState });
        setAuthState(newState);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        trace('auth: ERROR', { error: errMsg });
        if (cancelled) return;
        
        setError({ message: 'Failed to connect', details: errMsg });
        setAuthState('error');
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    trace('AuthGate: subscribing to auth changes');
    const unsubscribe = onAuthStateChange(async (event, session) => {
      trace('auth: state changed', { event, hasSession: !!session });

      // Handle sign out - re-establish anonymous session
      if (event === 'SIGNED_OUT' || !session) {
        trace('auth: signed out, will re-establish anonymous session');
        setError(null);
        setAuthState('no-profile');
        return;
      }

      // Handle token refresh or initial session
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        // Skip if we're already authenticated (avoid unnecessary profile fetches)
        if (authState === 'authenticated') {
          trace('auth: already authenticated, skipping profile fetch');
          return;
        }

        try {
          trace('auth: getMyProfile start (after auth event)');
          const profile = await getMyProfile();
          trace('auth: getMyProfile resolved (after auth event)', { hasProfile: !!profile });
          setError(null);
          setAuthState(profile ? 'authenticated' : 'no-profile');
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          trace('auth: profile error after auth event', { error: errMsg });
          // Still let them try to claim a player
          setAuthState('no-profile');
        }
      }
    });

    return unsubscribe;
  }, [authState]);

  // Handle profile creation
  const handleProfileCreated = useCallback(async () => {
    try {
      await getMyProfile();
      setAuthState('authenticated');
    } catch {
      setAuthState('authenticated');
    }
  }, []);

  // Retry handler
  const handleRetry = useCallback(() => {
    setError(null);
    setAuthState('loading');
    // Re-trigger the effect by forcing a re-render
    window.location.reload();
  }, []);

  // Error state
  if (authState === 'error' && error) {
    return (
      <ErrorPanel
        title="Connection Error"
        message={error.message}
        details={error.details}
        hints={[
          'Check your internet connection',
          'Verify Supabase URL and key are correct',
          'Check browser console for errors',
        ]}
        onRetry={handleRetry}
      />
    );
  }

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary gap-4">
        <Loader2 className="w-8 h-8 text-accent-pink animate-spin" />
        <p className="text-caption text-text-muted">Connecting...</p>
      </div>
    );
  }

  // Anonymous session but no player claimed yet
  if (authState === 'no-profile') {
    return <AccessCodePage onProfileCreated={handleProfileCreated} isAuthenticated={isAuthenticated} />;
  }

  // Fully authenticated with profile
  return <>{children}</>;
}

// Export profile context for use in the app
export { type Profile };
