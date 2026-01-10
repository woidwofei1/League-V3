import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-full bg-bg-primary">
      {/* Main content area with bottom padding for nav */}
      <main
        className={`
          flex-1 overflow-y-auto
          ${hideNav ? '' : 'pb-16'}
        `}
      >
        {children}
      </main>

      {/* Bottom navigation */}
      {!hideNav && <BottomNav />}
    </div>
  );
}
