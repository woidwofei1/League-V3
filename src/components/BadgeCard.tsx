import { motion } from 'framer-motion';
import { Flame, Sword, Trophy, Zap, Target, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type BadgeType = 
  | 'hot-hand' 
  | 'on-fire' 
  | 'giant-killer' 
  | 'champion' 
  | 'veteran' 
  | 'perfectionist';

interface BadgeConfig {
  icon: LucideIcon;
  name: string;
  description: string;
  color: string;
  bgColor: string;
}

const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
  'hot-hand': {
    icon: Flame,
    name: 'Hot Hand',
    description: '3+ win streak',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20',
  },
  'on-fire': {
    icon: Zap,
    name: 'On Fire',
    description: '5+ win streak',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
  },
  'giant-killer': {
    icon: Sword,
    name: 'Giant Killer',
    description: 'Beat higher-rated opponent',
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
  },
  'champion': {
    icon: Trophy,
    name: 'Champion',
    description: 'Current #1 ranked',
    color: 'text-accent-pink',
    bgColor: 'bg-accent-pink/20',
  },
  'veteran': {
    icon: Award,
    name: 'Veteran',
    description: '20+ matches played',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20',
  },
  'perfectionist': {
    icon: Target,
    name: 'Perfectionist',
    description: '70%+ win rate',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/20',
  },
};

interface BadgeCardProps {
  type: BadgeType;
  earned?: boolean;
  size?: 'sm' | 'md';
  showDescription?: boolean;
}

export function BadgeCard({ 
  type, 
  earned = true, 
  size = 'md',
  showDescription = true 
}: BadgeCardProps) {
  const config = BADGE_CONFIGS[type];
  const Icon = config.icon;
  
  const sizeStyles = {
    sm: {
      container: 'p-2',
      icon: 20,
      text: 'text-xs',
    },
    md: {
      container: 'p-3',
      icon: 28,
      text: 'text-caption',
    },
  };
  
  const styles = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={earned ? { scale: 1.05 } : {}}
      className={`
        ${styles.container}
        rounded-xl
        ${earned ? config.bgColor : 'bg-bg-glass'}
        border border-border-subtle
        flex flex-col items-center text-center
        transition-all duration-200
        ${!earned && 'opacity-40 grayscale'}
      `}
    >
      <Icon 
        size={styles.icon} 
        className={earned ? config.color : 'text-text-muted'} 
      />
      
      <span className={`
        ${styles.text} font-semibold mt-1.5
        ${earned ? 'text-text-primary' : 'text-text-muted'}
      `}>
        {config.name}
      </span>
      
      {showDescription && (
        <span className="text-[10px] text-text-muted mt-0.5">
          {config.description}
        </span>
      )}
    </motion.div>
  );
}

/**
 * Calculate which badges a player has earned
 */
export function calculateBadges(stats: {
  currentStreak: number;
  isLeader: boolean;
  totalMatches: number;
  winRate: number;
  hasGiantKill?: boolean;
}): BadgeType[] {
  const badges: BadgeType[] = [];
  
  if (stats.currentStreak >= 5) {
    badges.push('on-fire');
  } else if (stats.currentStreak >= 3) {
    badges.push('hot-hand');
  }
  
  if (stats.isLeader) {
    badges.push('champion');
  }
  
  if (stats.totalMatches >= 20) {
    badges.push('veteran');
  }
  
  if (stats.winRate >= 70 && stats.totalMatches >= 10) {
    badges.push('perfectionist');
  }
  
  if (stats.hasGiantKill) {
    badges.push('giant-killer');
  }
  
  return badges;
}
