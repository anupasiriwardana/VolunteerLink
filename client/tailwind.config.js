const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        karla: ['Karla', 'sans-serif'],
        dmserif:['DM Serif Text', 'serif'],
      },

      colors: {
        customGreen: '#1aac83',
      },

    },    
  },
  plugins: [
    flowbite.plugin(),
  ],
}