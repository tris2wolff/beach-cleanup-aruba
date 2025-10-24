/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
      },
      colors: {
        'beach-blue': '#234E70',
        'beach-teal': '#43cea2',
        'beach-cream': '#FFFCF2',
        'beach-yellow': '#F2C777',
      }
    },
  },
  plugins: [],
}
