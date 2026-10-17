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
          sidebar: '#020617', // near-black navy for sidebar
          card: '#090E1A',    // card background
          cardHover: '#0E1626',
          main: '#0B1120',    // main area background
          slate: '#1E293B',   // secondary dark slate
          border: '#1E293B',  // subtle borders
          borderLight: '#334155',
          input: '#060B14',
          accent: {
            purple: '#C084FC',
            purpleBg: 'rgba(192, 132, 252, 0.1)',
            purpleBorder: 'rgba(192, 132, 252, 0.25)',
            blue: '#38BDF8',
            emerald: '#34D399',
            amber: '#FBBF24',
            rose: '#FB7185',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
