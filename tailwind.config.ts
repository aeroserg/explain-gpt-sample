import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/modules/**/*.{ts,tsx}",
    "./src/layouts/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "gray-custom": "#d6dce4",
        "blue-lightest": "#e1ebff",
        "blue-key": "#3d7eff",
        "blue-gray-dark": "#4f5159",
        "blue-gray-even-lighter": "#e4e8ee",
        "blue-gray-light": "#a3a8b0",
        "blue-gray-lighter": "#D3D9E2",
        "blue-white": "#f8f9fc",
        "blue-lighter": "#7daffa",
        "gray-darker": "#2c2c32",
        "at-law": "#fa7d7d",
        "at-estate": "#bb7dfa",
        border: "#e3e9f2",
        card: "#fbfbfc",
      },
      borderRadius: {
        normal: "15px",
        small: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
