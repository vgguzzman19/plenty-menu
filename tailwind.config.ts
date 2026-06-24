import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          espresso:  "#1C0D04",
          roast:     "#3A1808",
          brown:     "#6B3520",
          caramel:   "#B8722A",
          honey:     "#D4944E",
          amber:     "#E8A85C",
          cream:     "#F5E6CC",
          parchment: "#FAFAF5",
          paper:     "#F2EBE0",
          stone:     "#E8DECE",
          border:    "#DDD0B8",
          muted:     "#9A8470",
          light:     "#EDD9B8",
          sand:      "#F5EEE4",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:         "0 1px 3px rgba(28,13,4,0.06), 0 4px 16px rgba(28,13,4,0.04)",
        "card-hover": "0 6px 24px rgba(28,13,4,0.12), 0 2px 6px rgba(28,13,4,0.06)",
        elevated:     "0 8px 40px rgba(28,13,4,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
