/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: 'var(--bg-void)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        elevated: 'var(--bg-elevated)',
        amber: 'var(--amber)',
        'amber-glow': 'var(--amber-glow)',
        teal: 'var(--teal)',
        rose: 'var(--rose)',
        primary: '#ffffff',
        secondary: '#94a3b8',
        dim: '#64748b'
      }
    }
  },
  plugins: []
};

