import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

type TrendDirection = 'up' | 'down' | 'neutral';

interface TrendIndicatorProps {
  direction: TrendDirection;
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TrendIndicator({ 
  direction, 
  value, 
  size = 'md',
  showLabel = false 
}: TrendIndicatorProps) {
  const sizeStyles = {
    sm: { icon: 12, text: 'text-xs' },
    md: { icon: 16, text: 'text-sm' },
    lg: { icon: 20, text: 'text-base' },
  };

  const config = sizeStyles[size];

  if (direction === 'neutral') {
    return (
      <div className="flex items-center gap-1 text-text-muted">
        <Minus size={config.icon} />
        {showLabel && <span className={config.text}>—</span>}
      </div>
    );
  }

  const isUp = direction === 'up';
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        flex items-center gap-1
        ${isUp ? 'text-accent-success' : 'text-accent-danger'}
      `}
      style={{
        textShadow: isUp 
          ? '0 0 8px rgba(0, 255, 136, 0.5)' 
          : '0 0 8px rgba(255, 71, 87, 0.5)'
      }}
    >
      {isUp ? (
        <TrendingUp size={config.icon} strokeWidth={2.5} />
      ) : (
        <TrendingDown size={config.icon} strokeWidth={2.5} />
      )}
      
      {value !== undefined && (
        <span className={`${config.text} font-bold tabular-nums`}>
          {isUp ? '+' : ''}{value}
        </span>
      )}
      
      {showLabel && (
        <span className={`${config.text} font-medium`}>
          {isUp ? 'Hot' : 'Cold'}
        </span>
      )}
    </motion.div>
  );
}

/**
 * Calculate trend direction from recent match performance
 * Returns 'up' if recent win rate > overall, 'down' if less, 'neutral' otherwise
 */
export function calculateTrend(
  recentWins: number, 
  recentTotal: number, 
  overallWins: number, 
  overallTotal: number
): TrendDirection {
  if (recentTotal === 0 || overallTotal === 0) return 'neutral';
  
  const recentRate = recentWins / recentTotal;
  const overallRate = overallWins / overallTotal;
  
  const threshold = 0.1; // 10% difference needed
  
  if (recentRate > overallRate + threshold) return 'up';
  if (recentRate < overallRate - threshold) return 'down';
  return 'neutral';
}
