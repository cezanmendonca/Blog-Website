/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f3f4f6', // light gray
        secondary: '#ffffff', // white
        accent: '#374151', // dark gray for text
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}