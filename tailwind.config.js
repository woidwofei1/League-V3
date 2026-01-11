/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon palette
        neon: {
          DEFAULT: '#ff00ff',
          dim: '#b000b0',
          glow: 'rgba(255, 0, 255, 0.5)',
        },
        // Dark palette
        dark: {
          bg: '#050505',
          surface: '#0f172a',
          border: '#1e293b',
        },
        // Backgrounds
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-glass': 'var(--bg-glass)',
        
        // Accents
        'accent-pink': 'var(--accent-pink)',
        'accent-pink-soft': 'var(--accent-pink-soft)',
        'accent-pink-glow': 'var(--accent-pink-glow)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-cyan-glow': 'var(--accent-cyan-glow)',
        'accent-success': 'var(--accent-success)',
        'accent-danger': 'var(--accent-danger)',
        'accent-warning': 'var(--accent-warning)',
        
        // Text
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        
        // Borders
        'border-subtle': 'var(--border-subtle)',
        'border-active': 'var(--border-active)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Russo One"', 'sans-serif'],
        heading: ['"Russo One"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1', fontWeight: '400', letterSpacing: '0.05em' }],
        'display-lg': ['4rem', { lineHeight: '1', fontWeight: '400', letterSpacing: '0.05em' }],
        'headline': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'stat-large': ['3.5rem', { lineHeight: '1', fontWeight: '400' }],
        'stat-medium': ['2rem', { lineHeight: '1.2', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'label': ['0.65rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.1em' }],
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'glow-pink': '0 0 20px var(--accent-pink-glow)',
        'glow-pink-strong': '0 0 30px var(--accent-pink-glow-strong), 0 0 60px var(--accent-pink-glow)',
        'glow-cyan': '0 0 20px var(--accent-cyan-glow)',
        'glow-cyan-strong': '0 0 30px var(--accent-cyan-glow-strong), 0 0 60px var(--accent-cyan-glow)',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
