import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { DynamicIsland } from './DynamicIsland';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const location = useLocation();
  const { matches } = useRivalryData(DEFAULT_TABLE_SLUG);
  const lastMatchTime = matches[0]?.played_at;

  // Pages that need full screen (no nav, no default padding)
  const isFullScreenPage = ['/', '/match/new', '/arcade'].includes(location.pathname);

  // Navigation visibility
  const shouldShowNav = !hideNav && !isFullScreenPage;

  return (
    <div className="flex flex-col min-h-full bg-bg-primary text-text-primary transition-colors duration-500">
      {/* Main content area */}
      <main
        className={`
          flex-1 w-full max-w-md mx-auto
          ${!isFullScreenPage ? 'pb-24' : ''}
        `}
      >
        {children}
      </main>

      {/* Dynamic Island Navigation */}
      {shouldShowNav && (
        <DynamicIsland lastMatchTime={lastMatchTime} />
      )}
    </div>
  );
}
