/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        cream: {
          50: '#fefcf3',
          100: '#fef7e7',
          200: '#fdecc4',
          300: '#fbdc96',
          400: '#f8c767',
          500: '#f5b33f',
          600: '#e59a2a',
          700: '#c67e1f',
          800: '#a5651b',
          900: '#8a5219',
        },
        brown: {
          600: '#92400e',
        }
      },
    },
  },
  plugins: [],
}