/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Paths to all of the template files in your project
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add more here if you have other directories with .js/.ts/.jsx/.tsx files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"), // Enables `line-clamp-*` utilities
  ],
}