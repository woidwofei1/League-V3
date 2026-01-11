import { Flame, Trophy } from 'lucide-react';

interface StatStripProps {
  streakCount: number;
  streakHolder: string;
  maxStreak: number;
  maxStreakHolder?: string;
}

export function StatStrip({ streakCount, streakHolder, maxStreak, maxStreakHolder }: StatStripProps) {
  const hasActiveStreak = streakCount > 0;

  return (
    <div className="glass-panel px-4 py-3 flex items-center justify-between">
      {/* Active Streak */}
      <div className="flex items-center gap-2">
        <Flame 
          size={16} 
          className={hasActiveStreak ? 'text-orange-500' : 'text-slate-500'} 
        />
        <span className="text-xs text-slate-400 uppercase tracking-wide">
          Active Streak:
        </span>
        {hasActiveStreak ? (
          <span className="text-xs text-white font-semibold">
            {streakHolder} ({streakCount})
          </span>
        ) : (
          <span className="text-xs text-slate-500">None</span>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-slate-700" />

      {/* Record Streak */}
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-yellow-500" />
        <span className="text-xs text-slate-400 uppercase tracking-wide">
          Record:
        </span>
        <span className="text-xs text-white font-semibold">
          {maxStreak}{maxStreakHolder ? ` (${maxStreakHolder})` : ''}
        </span>
      </div>
    </div>
  );
}
