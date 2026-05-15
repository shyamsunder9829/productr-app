/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#172554',
          light: '#3b5fc0',
        },
        sidebar: '#1a2234',
        accent: '#e85d26',
      },
    },
  },
  plugins: [],
}