interface PlayerBadgeProps {
  name: string;
  accent?: 'pink' | 'cyan';
  isLeader?: boolean;
  className?: string;
}

export function PlayerBadge({
  name,
  accent = 'pink',
  isLeader = false,
  className = '',
}: PlayerBadgeProps) {
  const accentColor = accent === 'pink' ? 'bg-accent-pink' : 'bg-accent-cyan';
  const glowColor = accent === 'pink' ? 'shadow-glow-pink' : 'shadow-glow-cyan';

  return (
    <div
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 rounded-full
        bg-bg-surface border border-border-subtle
        ${isLeader ? glowColor : ''}
        ${className}
      `}
    >
      <span className={`w-2 h-2 rounded-full ${accentColor}`} />
      <span className="text-body font-semibold text-text-primary">{name}</span>
      {isLeader && (
        <span className="text-caption text-accent-pink">👑</span>
      )}
    </div>
  );
}
