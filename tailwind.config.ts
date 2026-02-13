import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "uw-purple": "#4B2E83",
        "uw-purple-dark": "#33145C",
        "uw-purple-light": "#6A4FA0",
        "uw-gold": "#B7A57A",
        "uw-spirit-gold": "#FFC700",
        "uw-gold-light": "#E8E3D3",
      },
      fontFamily: {
        sans: ["Open Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
