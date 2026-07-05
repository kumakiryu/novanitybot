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
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        card:       "#111113",
        border:     "rgba(255,255,255,0.06)",
        muted:      "#71717a",
        primary: {
          DEFAULT:    "#d946ef",
          foreground: "#ffffff",
        },
        sidebar: "#0c0c0e",
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
