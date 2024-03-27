/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1446px",
    },
    extend: {},
  },
  plugins: [],
};
