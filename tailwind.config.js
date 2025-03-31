/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      screens: {
        tp: "1199px",
      },
    },
  },
  plugins: [],
};
