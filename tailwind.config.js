/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      screens: {
        mobile: "480px",
        tab: "768px",
        desktop: "1024px",
      },
    },
  },
  plugins: [],
};
