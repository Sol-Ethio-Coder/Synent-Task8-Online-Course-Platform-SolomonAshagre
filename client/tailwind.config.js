/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#dcebe1',
          400: '#3f8f6b',
          600: '#256b4c',
          700: '#1F4B3F',
          900: '#12271f'
        },
        sun: {
          400: '#F2B441',
          500: '#E39F2B'
        },
        ink: '#1B1B18'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
