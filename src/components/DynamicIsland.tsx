import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Swords, User } from 'lucide-react';

interface DynamicIslandProps {
  lastMatchTime?: string;
  liveScore?: { playerA: number; playerB: number };
}

export function DynamicIsland({ }: DynamicIslandProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on match/arcade pages
  const hiddenPaths = ['/match/new', '/arcade'];
  const isHidden = hiddenPaths.includes(location.pathname);

  const currentPath = location.pathname;

  const handleNavigate = useCallback((path: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    navigate(path);
  }, [navigate]);

  if (isHidden) return null;

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-[100] safe-bottom"
    >
      {/* Gradient fade above nav */}
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Nav container */}
      <div className="bg-black/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-stretch justify-around max-w-md mx-auto">
          <NavItem
            icon={<Home size={22} />}
            label="Home"
            onClick={() => handleNavigate('/home')}
            active={currentPath === '/home' || currentPath === '/stats' || currentPath === '/history'}
          />

          {/* Prominent Fight Button */}
          <div className="relative -top-5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavigate('/match/new')}
              className="relative group"
            >
              {/* Pulse Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />

              {/* Button Body */}
              <div className="relative w-14 h-14 bg-gradient-to-tr from-gray-900 to-black rounded-full border border-white/20 flex items-center justify-center shadow-lg shadow-pink-500/20 z-10 overflow-hidden">
                {/* Inner Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 opacity-50" />

                {/* Animated Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-transparent"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent) border-box',
                    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                <Swords size={24} className="text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </div>

              {/* Label */}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-display uppercase tracking-wider text-white/80 font-bold drop-shadow-md">
                Arena
              </span>
            </motion.button>
          </div>

          <NavItem
            icon={<User size={22} />}
            label="Profile"
            onClick={() => handleNavigate('/profile')}
            active={currentPath === '/profile'}
          />
        </div>
      </div>
    </motion.nav>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
  active?: boolean;
}

function NavItem({ icon, label, onClick, accent = false, active = false }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 py-3 px-6 transition-all active:scale-95 ${accent
        ? 'text-white'
        : active
          ? 'text-white'
          : 'text-white/40 hover:text-white/70'
        }`}
    >
      {/* Active/Accent indicator */}
      {(active || accent) && (
        <motion.div
          layoutId="navIndicator"
          className={`absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full ${accent ? 'bg-gradient-to-r from-pink-500 to-cyan-500' : 'bg-white'
            }`}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      {/* Icon with glow for accent */}
      <div className={accent ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}>
        {icon}
      </div>

      <span className={`text-[10px] font-mono uppercase tracking-widest ${accent ? 'font-bold' : 'font-medium'
        }`}>
        {label}
      </span>
    </button>
  );
}
