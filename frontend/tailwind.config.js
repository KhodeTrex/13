/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eaf6ff',
          100: '#d6eeff',
          200: '#b5e0ff',
          300: '#8ccfff',
          400: '#5db7ff',
          500: '#389dff',
          600: '#1d7ef0',
          700: '#1865c1',
          800: '#144f95',
          900: '#123f76',
        },
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0, 136, 255, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
