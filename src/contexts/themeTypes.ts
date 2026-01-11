import { createContext } from 'react';

export type ThemeMode = 'pink' | 'cyan' | 'neutral';

export interface ThemeContextValue {
  mode: ThemeMode;
  leader: 'bachi' | 'crimebaker' | null;
  challenger: 'bachi' | 'crimebaker' | null;
  leadMargin: number;
  isLoading: boolean;
  colors: {
    primary: string;
    primaryGlow: string;
    primaryDim: string;
    secondary: string;
    secondaryGlow: string;
  };
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const themeColors = {
  pink: {
    primary: '#ff00ff',
    primaryGlow: 'rgba(255, 0, 255, 0.5)',
    primaryDim: '#b000b0',
    secondary: '#00F0FF',
    secondaryGlow: 'rgba(0, 240, 255, 0.35)',
  },
  cyan: {
    primary: '#00F0FF',
    primaryGlow: 'rgba(0, 240, 255, 0.5)',
    primaryDim: '#00a0b0',
    secondary: '#ff00ff',
    secondaryGlow: 'rgba(255, 0, 255, 0.35)',
  },
  neutral: {
    primary: '#ffffff',
    primaryGlow: 'rgba(255, 255, 255, 0.3)',
    primaryDim: '#888888',
    secondary: '#888888',
    secondaryGlow: 'rgba(136, 136, 136, 0.3)',
  },
};
