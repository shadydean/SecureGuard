/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#ccffd9',
        'custom-pink': '#ffe6f2',
      },
    },
  },
  plugins: [],
}