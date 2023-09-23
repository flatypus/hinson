/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "apple-blur": "rgba(255,255,255,0.1)",
      },
      backdropBlur: {
        "apple-blur": "16px",
      },
      fontFamily: {
        sf: ["San Francisco", "sans-serif"],
      },
    },
  },
  plugins: [],
};
