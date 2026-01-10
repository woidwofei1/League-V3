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
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/rivalry', label: 'Rivalry', icon: Swords },
  { to: '/history', label: 'History', icon: History },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
];

export function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-bg-primary/70 backdrop-blur-xl
        border-t border-border-subtle/30
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Nav container - min 44px tap targets */}
      <div className="flex items-stretch justify-around" style={{ minHeight: '50px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex-1 min-h-[44px]"
          >
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.08 }}
                className={`
                  relative flex flex-col items-center justify-center
                  h-full gap-0.5 py-2
                  transition-all duration-150
                  ${isActive
                    ? 'text-accent-pink'
                    : 'text-text-muted/30'
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="
                      absolute -top-px left-1/2 -translate-x-1/2
                      w-8 h-[2px]
                      bg-accent-pink
                      rounded-full
                    "
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={isActive ? 'drop-shadow-[0_0_6px_var(--accent-pink-glow)]' : ''}
                />
                <span className={`
                  text-[9px] tracking-wider uppercase
                  ${isActive ? 'font-semibold' : 'font-normal opacity-70'}
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
