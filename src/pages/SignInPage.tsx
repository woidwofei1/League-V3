import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, AlertCircle, CheckCircle2, Wifi } from 'lucide-react';
import { createMyProfile, PLAYER_IDS } from '../lib/profile';
import { trace } from '../lib/bootTrace';
import { Button } from '../components';

// Access codes from environment variables (with fallback to literal values for dev)
const ACCESS_CODE_BACHI = import.meta.env.VITE_ACCESS_CODE_BACHI as string | undefined;
const ACCESS_CODE_CRIME = import.meta.env.VITE_ACCESS_CODE_CRIMEBAKER as string | undefined;

interface AccessCodePageProps {
  onProfileCreated: () => void;
  isAuthenticated: boolean;
}

export function AccessCodePage({ onProfileCreated, isAuthenticated }: AccessCodePageProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Don't allow submission if not authenticated
    if (!isAuthenticated) {
      setError('Still connecting... please wait.');
      return;
    }
    
    setIsLoading(true);

    trace('accessCode: validating', { codeLength: code.length });

    try {
      // Validate access code and determine player
      const trimmedCode = code.trim().toUpperCase();
      let playerId: string | null = null;
      let playerName: string | null = null;

      // Check against env vars first, then fallback to literal names
      if (ACCESS_CODE_BACHI && trimmedCode === ACCESS_CODE_BACHI.toUpperCase()) {
        playerId = PLAYER_IDS.bachi;
        playerName = 'Bachi';
      } else if (ACCESS_CODE_CRIME && trimmedCode === ACCESS_CODE_CRIME.toUpperCase()) {
        playerId = PLAYER_IDS.crimebaker;
        playerName = 'Crimebaker';
      } else if (!ACCESS_CODE_BACHI && !ACCESS_CODE_CRIME) {
        // Fallback: if env vars not set, allow literal "BACHI" / "CRIMEBAKER"
        if (trimmedCode === 'BACHI') {
          playerId = PLAYER_IDS.bachi;
          playerName = 'Bachi';
        } else if (trimmedCode === 'CRIMEBAKER') {
          playerId = PLAYER_IDS.crimebaker;
          playerName = 'Crimebaker';
        }
      }

      if (!playerId) {
        trace('accessCode: invalid code');
        setError('Invalid access code. Please check and try again.');
        setIsLoading(false);
        return;
      }

      trace('accessCode: code valid', { player: playerName });

      // Create or update profile with the matched player
      trace('accessCode: upserting profile', { playerId });
      await createMyProfile(playerId);
      trace('accessCode: profile saved successfully');

      // Redirect to main table page
      navigate('/t/pink-room-main');
      onProfileCreated();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to select player';
      trace('accessCode: error', { error: errMsg });
      
      if (errMsg.includes('Not authenticated')) {
        setError('Session expired. Please refresh the page.');
      } else {
        setError(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if access codes are configured (allow fallback to literal names if not)
  const codesConfigured = ACCESS_CODE_BACHI || ACCESS_CODE_CRIME;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-primary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-display text-text-primary mb-2">
            Pink Room
            <br />
            <span className="text-accent-pink">Rivalry</span>
          </h1>
          <p className="text-body text-text-secondary">
            Enter your access code to continue
          </p>
        </div>

        {/* Connection status pill */}
        <div className="flex justify-center mb-4">
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-success/10 border border-accent-success/30 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-success" />
              <span className="text-caption text-accent-success">Connected</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full">
              <Wifi className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
              <span className="text-caption text-accent-cyan">Connecting...</span>
            </div>
          )}
        </div>

        {/* Access code form - always show, button disabled until authenticated */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-bg-surface border border-border-subtle rounded-lg p-4">
            <label className="block text-caption text-text-secondary mb-2">
              Access Code
            </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter your code"
                  required
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="characters"
                  className="
                    w-full pl-11 pr-4 py-3
                    bg-bg-elevated border border-border-subtle rounded-md
                    text-body text-text-primary placeholder:text-text-muted
                    focus:outline-none focus:border-accent-cyan
                    transition-colors uppercase tracking-widest font-mono
                  "
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-accent-danger/10 border border-accent-danger/30 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-accent-danger flex-shrink-0 mt-0.5" />
                <p className="text-caption text-accent-danger">{error}</p>
              </motion.div>
            )}

          <Button
            type="submit"
            disabled={isLoading || !code.trim() || !isAuthenticated}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Verifying...
              </>
            ) : !isAuthenticated ? (
              'Connecting...'
            ) : (
              'Continue'
            )}
          </Button>

          {!codesConfigured && (
            <p className="text-caption text-accent-warning text-center">
              Tip: Set VITE_ACCESS_CODE_BACHI and VITE_ACCESS_CODE_CRIMEBAKER in .env.local
            </p>
          )}

          <p className="text-caption text-text-muted text-center">
            Ask your rival for your access code
          </p>
        </form>
      </motion.div>
    </div>
  );
}

// Keep old export name for backwards compatibility
export { AccessCodePage as SignInPage };
