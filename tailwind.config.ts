import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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

        /* Depth system — botones "hundidos" (reposo) vs "flotando" (seleccionado) */
        groove:            "inset 0 1px 3px rgba(28,13,4,0.09), inset 0 -1px 0 rgba(255,255,255,0.6), 0 1px 1px rgba(28,13,4,0.02)",
        "groove-hover":     "inset 0 1px 2px rgba(28,13,4,0.06), inset 0 -1px 0 rgba(255,255,255,0.75), 0 3px 8px -2px rgba(28,13,4,0.10)",
        "groove-dk":        "inset 0 1px 3px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(212,148,78,0.05)",
        "groove-dk-hover":  "inset 0 1px 2px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(212,148,78,0.09), 0 3px 10px -2px rgba(0,0,0,0.4)",
        pop:                "0 1px 1px rgba(28,13,4,0.06), 0 4px 10px -2px rgba(28,13,4,0.18), 0 14px 28px -8px rgba(184,114,42,0.32), inset 0 1px 0 rgba(255,255,255,0.2)",
        "pop-dk":           "0 2px 6px -1px rgba(0,0,0,0.5), 0 12px 26px -6px rgba(212,148,78,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
        "pop-press":        "inset 0 2px 5px rgba(28,13,4,0.2)",
        "pop-dk-press":     "inset 0 2px 6px rgba(0,0,0,0.55)",

        /* Depth system — product cards */
        "card-pop":            "0 2px 4px rgba(28,13,4,0.10), 0 10px 22px -4px rgba(28,13,4,0.18), 0 24px 44px -12px rgba(184,114,42,0.30), inset 0 1px 0 rgba(255,255,255,0.7)",
        "card-pop-hover":      "0 4px 8px rgba(28,13,4,0.14), 0 16px 32px -6px rgba(28,13,4,0.24), 0 32px 56px -14px rgba(184,114,42,0.40), inset 0 1px 0 rgba(255,255,255,0.8)",
        "card-pop-dk":         "0 2px 4px rgba(0,0,0,0.5), 0 14px 28px -6px rgba(0,0,0,0.6), 0 28px 48px -14px rgba(212,148,78,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
        "card-pop-dk-hover":   "0 4px 10px rgba(0,0,0,0.55), 0 20px 38px -8px rgba(0,0,0,0.7), 0 34px 56px -14px rgba(212,148,78,0.38), inset 0 1px 0 rgba(255,255,255,0.12)",
        "card-press":          "inset 0 2px 6px rgba(28,13,4,0.14)",
        "card-press-dk":       "inset 0 2px 8px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
