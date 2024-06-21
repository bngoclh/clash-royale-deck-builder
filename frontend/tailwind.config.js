/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xsm: "240px",
      xs: "400px",
      sm: "640px",
      md: "760px",
      tab: "840px",
      lg: "1024px",
      xl: "1280px",
    },

    extend: {
      colors: {
        // these are the theme colors don't change them
        primary: "#A66EFC",
        secondary: "#000513",
      },
    },
  },
  plugins: [],
}

