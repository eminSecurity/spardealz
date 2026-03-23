/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFF0EB',
          100: '#FFD9CC',
          500: '#FF6B35',
          600: '#E55A2B',
          700: '#CC4A21',
        },
        secondary: {
          DEFAULT: '#1A1A2E',
          50: '#F4F4F6',
          100: '#E8E8EC',
          900: '#1A1A2E',
        },
        hot: '#22C55E',
        cold: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
