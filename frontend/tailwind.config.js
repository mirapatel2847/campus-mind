/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        campus: {
          dark: '#0A0E17',
          card: '#111726',
          border: '#1F293D',
          hover: '#192237',
          input: '#0D1322',
        }
      }
    },
  },
  plugins: [],
}
