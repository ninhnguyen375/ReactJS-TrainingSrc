/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: ['./main.jsx', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      primaryColor: '#5ac2dc'
    },
    extend: {
      boxShadow: {
        normal: 'rgba(0, 0, 0, 0.15) 0px 2px 8px'
      }
    }
  },
  plugins: []
}
