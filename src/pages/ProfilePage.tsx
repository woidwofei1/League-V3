import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { PageTransition, Card, PlayerBadge, Button, Skeleton } from '../components';
import { getMyProfile, type Profile } from '../lib/profile';
import { signOut } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        // Get user ID
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id ?? null);

        // Get profile
        const profileData = await getMyProfile();
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleResetSession = async () => {
    if (!confirm('This will sign you out and clear your local session. You will need to re-enter your access code. Continue?')) {
      return;
    }

    setIsSigningOut(true);
    try {
      await signOut();
      // Clear any local storage
      localStorage.clear();
      // Force reload to trigger new anonymous session
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to sign out:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      setIsSigningOut(false);
    }
  };

  const playerName = profile?.player?.display_name ?? 'Unknown';
  const playerSlug = profile?.player?.slug;
  const isPlayerBachi = playerSlug === 'bachi';

  return (
    <PageTransition className="min-h-full">
      <header className="px-6 pt-8 pb-6">
        <h1 className="text-display text-text-primary">Profile</h1>
        <p className="text-body text-text-secondary mt-1">
          Your identity in the rivalry
        </p>
      </header>

      <div className="px-6 space-y-6">
        {/* Loading state */}
        {isLoading && (
          <>
            <Skeleton height="140px" className="w-full" />
            <Skeleton height="100px" className="w-full" />
          </>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="p-4 bg-accent-danger/10 border border-accent-danger/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5" />
            <p className="text-body text-accent-danger">{error}</p>
          </div>
        )}

        {/* Profile content */}
        {!isLoading && !error && profile && (
          <>
            {/* Player Card */}
            <Card variant="elevated" padding="lg" className="relative overflow-hidden">
              {/* Glow effect based on player */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 ${
                isPlayerBachi ? 'bg-accent-pink/15' : 'bg-accent-cyan/15'
              }`} />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className={isPlayerBachi ? 'text-accent-pink' : 'text-accent-cyan'} />
                  <span className="text-caption text-text-muted uppercase tracking-wider">
                    Claimed Player
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <PlayerBadge
                    name={playerName}
                    accent={isPlayerBachi ? 'pink' : 'cyan'}
                    isLeader={false}
                  />
                </div>

                <p className="text-body text-text-secondary mt-4">
                  You are playing as <span className={`font-semibold ${isPlayerBachi ? 'text-accent-pink' : 'text-accent-cyan'}`}>{playerName}</span> in this rivalry.
                </p>
              </div>
            </Card>

            {/* Venue/Table Card */}
            <Card variant="surface" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-accent-cyan" />
                <span className="text-caption text-text-muted uppercase tracking-wider">
                  Home Table
                </span>
              </div>
              <p className="text-headline text-text-primary">Pink Room Main</p>
              <p className="text-body text-text-secondary">Innsbruck</p>
            </Card>

            {/* Quick Action */}
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/t/pink-room-main')}
            >
              Go to Table
            </Button>

            {/* Dev Section */}
            <div className="pt-4 border-t border-border-subtle">
              <p className="text-caption text-text-muted uppercase tracking-wider mb-3">
                Developer Tools
              </p>
              
              {/* User ID */}
              <Card variant="glass" padding="sm" className="mb-3">
                <p className="text-caption text-text-muted">User ID</p>
                <p className="text-xs font-mono text-text-secondary break-all">
                  {userId ?? 'Unknown'}
                </p>
              </Card>

              {/* Reset Session Button */}
              <Button
                variant="danger"
                fullWidth
                onClick={handleResetSession}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} className="mr-2" />
                    Reset Local Session
                  </>
                )}
              </Button>
              <p className="text-caption text-text-muted text-center mt-2">
                Signs out and clears local data for testing
              </p>
            </div>
          </>
        )}

        {/* No profile state */}
        {!isLoading && !error && !profile && (
          <div className="text-center py-12">
            <User size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-body text-text-muted">No profile found</p>
            <p className="text-caption text-text-muted mt-1">
              Something went wrong. Try refreshing the page.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
