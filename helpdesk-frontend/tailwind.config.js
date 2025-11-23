/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Status colors matching Figma design
        status: {
          pending: '#F59E0B',
          accepted: '#3B82F6',
          resolved: '#16A34A',
          rejected: '#DC2626'
        }
      },
      spacing: {
        // Common spacing values
        '4': '1rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem'
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px'
      }
    },
  },
  plugins: [],
}