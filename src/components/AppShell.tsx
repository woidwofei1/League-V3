import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { DynamicIsland } from './DynamicIsland';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
  useNewNav?: boolean;
}

export function AppShell({ children, hideNav = false, useNewNav = true }: AppShellProps) {
  const location = useLocation();
  const { matches } = useRivalryData(DEFAULT_TABLE_SLUG);
  const lastMatchTime = matches[0]?.played_at;

  // Hide nav on certain pages
  const hideOnPaths = ['/match/new', '/arcade'];
  const shouldHideNav = hideNav || hideOnPaths.includes(location.pathname);

  // Use Face-Off screen as root - it has its own full-screen layout
  const isFullScreenPage = location.pathname === '/' || location.pathname === '/arcade';

  return (
    <div className="flex flex-col min-h-full bg-bg-primary">
      {/* Main content area */}
      <main
        className={`
          flex-1 overflow-y-auto
          ${!isFullScreenPage && !shouldHideNav ? 'pb-20' : ''}
        `}
      >
        {children}
      </main>

      {/* Dynamic Island Navigation (Phase 2) */}
      {useNewNav && !shouldHideNav && (
        <DynamicIsland lastMatchTime={lastMatchTime} />
      )}
    </div>
  );
}
