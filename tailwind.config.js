/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-glass': 'var(--bg-glass)',
        
        // Accents
        'accent-pink': 'var(--accent-pink)',
        'accent-pink-glow': 'var(--accent-pink-glow)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-cyan-glow': 'var(--accent-cyan-glow)',
        'accent-success': 'var(--accent-success)',
        'accent-danger': 'var(--accent-danger)',
        
        // Text
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        
        // Borders
        'border-subtle': 'var(--border-subtle)',
        'border-active': 'var(--border-active)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'headline': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'stat-large': ['3rem', { lineHeight: '1', fontWeight: '800' }],
        'stat-medium': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'glow-pink': '0 0 20px var(--accent-pink-glow)',
        'glow-cyan': '0 0 20px var(--accent-cyan-glow)',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
    },
  },
  plugins: [],
}
