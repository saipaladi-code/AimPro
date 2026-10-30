/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090E',
          900: '#0B0E14',
          850: '#0F141F',
          800: '#141C2B',
          750: '#1A2438',
          700: '#222F47',
          600: '#2E3E5C',
          500: '#475569',
        },
        brand: {
          purple: {
            DEFAULT: '#8B5CF6',
            hover: '#7C3AED',
            light: '#A78BFA',
            dark: '#6D28D9',
            glow: 'rgba(139, 92, 246, 0.35)',
          },
          cyan: {
            DEFAULT: '#06B6D4',
            hover: '#0891B2',
            light: '#22D3EE',
            glow: 'rgba(6, 182, 212, 0.35)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        gaming: ['Rajdhani', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "radial-gradient(rgba(139, 92, 246, 0.12) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}

