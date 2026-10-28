/** @type {import('tailwindcss').Config */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        metron: {
          bg: '#0B0F19',
          surface: '#161F30',
          border: '#1F2937',
          cyan: '#00E5FF',
          amber: '#FFB300',
          violet: '#7C4DFF',
          crimson: '#FF1744',
          green: '#00E676',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
