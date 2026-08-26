import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E8750A",
          light: "#FDF0E6",
          border: "#F5C48A",
        },
        ink: "#1A1A1A",
        muted: "#5C5C5C",
        page: "#F7F6F3",
        card: "#FFFFFF",
        line: "rgba(0,0,0,0.09)",
        success: {
          DEFAULT: "#2D7A4F",
          light: "#EAF4EE",
        },
        track: {
          a: "#E8750A",
          b: "#185FA5",
          c: "#2D7A4F",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
