/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',
          secondary: '#7C3AED',
          accent: '#38BDF8',
          success: '#22C55E',
          pink: '#EC4899',
          cyan: '#22D3EE',
          orange: '#F97316',
          canvas: '#F8FAFC',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.10)',
        glow: '0 22px 65px rgba(124, 58, 237, 0.28)',
        cyan: '0 18px 55px rgba(34, 211, 238, 0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
