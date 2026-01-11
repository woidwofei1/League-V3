import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Swords, History } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { to: '/rivalry', label: 'Rivalry', icon: Swords },
  { to: '/match/new', label: 'Fight', icon: Swords, isCenter: true },
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
            className={`flex-1 min-h-[48px] ${item.isCenter ? 'relative' : ''}`}
          >
            {({ isActive }) => (
              item.isCenter ? (
                // Center Fight Button - MEGA Prominent & Animated
                <div className="relative flex items-center justify-center h-full">
                  {/* Floating button container */}
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute -top-10"
                  >
                    {/* Mega outer glow - pulsing rings */}
                    <motion.div
                      className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-2xl"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    
                    {/* Second glow layer */}
                    <motion.div
                      className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 blur-xl"
                      animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.8, 0.5],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    
                    {/* Spinning ring effect */}
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-transparent"
                      style={{
                        background: 'linear-gradient(black, black) padding-box, linear-gradient(90deg, #22d3ee, #ec4899, #22d3ee) border-box',
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    
                    {/* Main button - bigger */}
                    <motion.div
                      className="relative w-20 h-20 rounded-full bg-black flex items-center justify-center border-2 border-white/30"
                      animate={{
                        boxShadow: [
                          '0 0 30px rgba(236,72,153,0.6), 0 0 60px rgba(34,211,238,0.4), inset 0 0 20px rgba(168,85,247,0.3)',
                          '0 0 50px rgba(34,211,238,0.8), 0 0 80px rgba(236,72,153,0.5), inset 0 0 30px rgba(168,85,247,0.5)',
                          '0 0 30px rgba(236,72,153,0.6), 0 0 60px rgba(34,211,238,0.4), inset 0 0 20px rgba(168,85,247,0.3)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {/* Inner gradient overlay */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-transparent to-pink-500/20"
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      
                      {/* Crossed swords icon container */}
                      <motion.div
                        className="relative"
                        animate={{
                          scale: [1, 1.15, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Swords
                          size={36}
                          strokeWidth={2}
                          className="text-white"
                          style={{
                            filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.9)) drop-shadow(0 0 30px rgba(236,72,153,0.8))',
                          }}
                        />
                      </motion.div>
                      
                      {/* Spark particles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full bg-white"
                          style={{
                            top: '50%',
                            left: '50%',
                          }}
                          animate={{
                            x: [0, Math.cos((i * 120 * Math.PI) / 180) * 40],
                            y: [0, Math.sin((i * 120 * Math.PI) / 180) * 40],
                            opacity: [1, 0],
                            scale: [0.5, 1.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: 'easeOut',
                          }}
                        />
                      ))}
                    </motion.div>
                    
                    {/* Label below button - gradient animated */}
                    <motion.p 
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] font-black whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(90deg, #22d3ee, #ec4899, #22d3ee)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(236,72,153,0.5)',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '200% 0%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      Fight
                    </motion.p>
                  </motion.div>
                </div>
              ) : (
                // Regular nav items
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
              )
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
