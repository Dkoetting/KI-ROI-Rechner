/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef1f8',
          100: '#d5dcec',
          200: '#aab8d9',
          300: '#7f95c6',
          400: '#5471b3',
          500: '#2a4ea0',
          600: '#1f3c80',
          700: '#1a3a6b',
          800: '#0f2244',
          900: '#081832',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
