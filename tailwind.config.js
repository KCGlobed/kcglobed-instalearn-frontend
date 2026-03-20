/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        xl: "1320px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#2563eb",
        secondary: "#1e293b",
        danger: "#ef4444",
        success: "#22c55e",
        dark: "#1d2026",
        perple: "#7367F0",
        "light-gray": "#363B4780",
      },
    },
  },
  plugins: [],
}