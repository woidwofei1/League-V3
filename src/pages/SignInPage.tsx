import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, AlertCircle, CheckCircle2, Wifi, Swords } from 'lucide-react';
import { createMyProfile, PLAYER_IDS } from '../lib/profile';
import { trace } from '../lib/bootTrace';

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
    
    if (!isAuthenticated) {
      setError('Still connecting... please wait.');
      return;
    }
    
    setIsLoading(true);
    trace('accessCode: validating', { codeLength: code.length });

    try {
      const trimmedCode = code.trim().toUpperCase();
      let playerId: string | null = null;
      let playerName: string | null = null;

      if (ACCESS_CODE_BACHI && trimmedCode === ACCESS_CODE_BACHI.toUpperCase()) {
        playerId = PLAYER_IDS.bachi;
        playerName = 'Bachi';
      } else if (ACCESS_CODE_CRIME && trimmedCode === ACCESS_CODE_CRIME.toUpperCase()) {
        playerId = PLAYER_IDS.crimebaker;
        playerName = 'Crimebaker';
      } else if (!ACCESS_CODE_BACHI && !ACCESS_CODE_CRIME) {
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
        setError('Invalid access code');
        setIsLoading(false);
        return;
      }

      trace('accessCode: code valid', { player: playerName });
      trace('accessCode: upserting profile', { playerId });
      await createMyProfile(playerId);
      trace('accessCode: profile saved successfully');

      // Navigate to the new home dashboard
      navigate('/home');
      onProfileCreated();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to select player';
      trace('accessCode: error', { error: errMsg });
      
      if (errMsg.includes('Not authenticated')) {
        setError('Session expired. Please refresh.');
      } else {
        setError(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
      {/* Table background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url(/tabla-bg.png)' }}
      />
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-pink-950/20 to-black pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500/20 to-cyan-500/20 border border-white/10 mb-6"
          >
            <Swords size={36} className="text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-display uppercase text-white mb-2"
          >
            Pink Room
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-display uppercase bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Rivalry
          </motion.p>
        </div>

        {/* Connection status */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-6"
        >
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-mono text-emerald-400 uppercase tracking-wider">Connected</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <Wifi className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">Connecting...</span>
            </div>
          )}
        </motion.div>

        {/* Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          {/* Code input */}
          <div className="glass-panel p-4">
            <label className="block text-xs text-white/40 font-mono uppercase tracking-wider mb-3">
              Access Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
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
                  w-full pl-12 pr-4 py-4
                  bg-white/5 border border-white/10 rounded-xl
                  text-white placeholder:text-white/30
                  focus:outline-none focus:border-cyan-500/50 focus:bg-white/10
                  transition-all uppercase tracking-widest font-mono text-lg
                "
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !code.trim() || !isAuthenticated}
            className="
              w-full py-4 rounded-xl font-display uppercase tracking-wider text-lg
              bg-gradient-to-r from-pink-600 to-pink-500
              hover:from-pink-500 hover:to-pink-400
              disabled:from-white/10 disabled:to-white/5 disabled:text-white/30
              text-white transition-all
              active:scale-[0.98]
            "
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </span>
            ) : !isAuthenticated ? (
              'Connecting...'
            ) : (
              'Enter Arena'
            )}
          </button>

          {/* Help text */}
          <p className="text-center text-white/30 text-sm font-mono">
            Ask your rival for your access code
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

export { AccessCodePage as SignInPage };
