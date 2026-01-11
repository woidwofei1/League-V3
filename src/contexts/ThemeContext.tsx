import { useMemo, type ReactNode } from 'react';
import { useRivalryData, DEFAULT_TABLE_SLUG } from '../hooks/useRivalryData';
import { themeColors, ThemeContext, type ThemeMode, type ThemeContextValue } from './themeTypes';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { loading, summary } = useRivalryData(DEFAULT_TABLE_SLUG);

  const value = useMemo<ThemeContextValue>(() => {
    const leader = summary?.leader ?? null;
    const challenger = leader === 'bachi' ? 'crimebaker' : leader === 'crimebaker' ? 'bachi' : null;
    
    // Crimebaker = Pink theme, Bachi = Cyan theme
    const mode: ThemeMode = leader === 'crimebaker' ? 'pink' : leader === 'bachi' ? 'cyan' : 'neutral';

    return {
      mode,
      leader,
      challenger,
      leadMargin: summary?.leadMargin ?? 0,
      isLoading: loading,
      colors: themeColors[mode],
    };
  }, [loading, summary]);

  return (
    <ThemeContext.Provider value={value}>
      <div 
        className="theme-root" 
        data-theme={value.mode}
        style={{
          '--theme-primary': value.colors.primary,
          '--theme-primary-glow': value.colors.primaryGlow,
          '--theme-primary-dim': value.colors.primaryDim,
          '--theme-secondary': value.colors.secondary,
          '--theme-secondary-glow': value.colors.secondaryGlow,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
