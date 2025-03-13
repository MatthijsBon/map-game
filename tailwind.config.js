/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      grey: {
        100: "#ffffff",
        300: "#e6e6e9",
      },
      blue: {
        100: "#0063d3",
        900: "#003082",
      },
      yellow: "#ffc917",
    },
    extend: {},
  },
  plugins: [],
};
