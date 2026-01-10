interface StatTileProps {
  label: string;
  value: string | number;
  accent?: 'default' | 'pink' | 'cyan';
  size?: 'md' | 'lg';
  className?: string;
}

const accentStyles = {
  default: 'text-text-primary',
  pink: 'text-accent-pink',
  cyan: 'text-accent-cyan',
};

export function StatTile({
  label,
  value,
  accent = 'default',
  size = 'md',
  className = '',
}: StatTileProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-caption text-text-muted uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`
          tabular-nums font-extrabold
          ${size === 'lg' ? 'text-stat-large' : 'text-stat-medium'}
          ${accentStyles[accent]}
        `}
      >
        {value}
      </span>
    </div>
  );
}
