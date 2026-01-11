import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Swords, History, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { to: '/rivalry', label: 'Rivalry', icon: Swords },
  { to: '/match/new', label: 'Match', icon: BarChart3 },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        bg-bg-primary/80 backdrop-blur-xl
        border-t border-border-subtle/50
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch justify-around" style={{ minHeight: '56px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex-1 min-h-[48px]"
          >
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.1 }}
                className={`
                  relative flex flex-col items-center justify-center
                  h-full gap-1 py-2
                  transition-all duration-200
                  ${isActive
                    ? 'text-accent-pink'
                    : 'text-text-muted/40 hover:text-text-muted/60'
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="
                      absolute -top-px left-1/2 -translate-x-1/2
                      w-10 h-[3px]
                      bg-accent-pink
                      rounded-b-full
                      shadow-glow-pink
                    "
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Icon with glow when active */}
                <div className="relative">
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className={`
                      transition-all duration-200
                      ${isActive ? 'drop-shadow-[0_0_8px_var(--accent-pink-glow)]' : ''}
                    `}
                  />
                  
                  {/* Glow effect behind icon */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="
                        absolute inset-0 -z-10
                        bg-accent-pink/30 blur-lg rounded-full
                        scale-150
                      "
                    />
                  )}
                </div>
                
                {/* Label */}
                <span className={`
                  text-[10px] uppercase tracking-wider
                  transition-all duration-200
                  ${isActive 
                    ? 'font-semibold text-accent-pink' 
                    : 'font-normal'
                  }
                `}>
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
