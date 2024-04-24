/** @type {import('tailwindcss').Config} */
// Base styles for media player and provider (~400B).
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
    },
    screens: {
      xs: "375px",
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1446px",
    },
    extend: {},
  },
  plugins: [
    require("@vidstack/react/tailwind.cjs"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
