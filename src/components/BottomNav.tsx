import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Table2, Swords, History, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { to: '/t/pink-room-main', label: 'Table', icon: Table2 },
  { to: '/rivalry', label: 'Rivalry', icon: Swords },
  { to: '/history', label: 'History', icon: History },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
];

export function BottomNav() {
  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0
        bg-bg-surface/80 backdrop-blur-md
        border-t border-border-subtle/50
      "
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Nav container - min 44px tap targets */}
      <div className="flex items-stretch justify-around" style={{ minHeight: '52px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex-1 min-h-[44px]"
          >
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.1 }}
                className={`
                  relative flex flex-col items-center justify-center
                  h-full gap-0.5 py-2
                  transition-all duration-150
                  ${isActive
                    ? 'text-accent-pink'
                    : 'text-text-muted/40'
                  }
                `}
              >
                {/* Active glow indicator */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="
                      absolute -top-px left-1/2 -translate-x-1/2
                      w-10 h-0.5
                      bg-accent-pink
                      shadow-glow-pink
                      rounded-full
                    "
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={isActive ? 'drop-shadow-[0_0_8px_var(--accent-pink-glow)]' : ''}
                />
                <span className={`
                  text-[10px] tracking-wide
                  ${isActive ? 'font-semibold opacity-100' : 'font-normal opacity-60'}
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
