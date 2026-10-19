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
        navy: {
          DEFAULT: "#121139",
          light: "#1e1d52",
          dark: "#0a091f",
        },
        gold: {
          DEFAULT: "#e5d9cd",
          light: "#f0ebe4",
          dark: "#d0bfae",
          muted: "rgba(229, 217, 205, 0.15)",
        },
        cream: "#e5d9cd",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease forwards",
        "fade-in-up": "fadeInUp 0.8s ease forwards",
        "draw-underline": "drawUnderline 1s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        drawUnderline: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(229, 217, 205, 0.4)" },
          "50%": { boxShadow: "0 0 0 16px rgba(229, 217, 205, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #e5d9cd 0%, #f0ebe4 50%, #e5d9cd 100%)",
        "navy-gradient": "linear-gradient(135deg, #121139 0%, #1e1d52 100%)",
        "hero-overlay": "linear-gradient(to right, rgba(18, 17, 57, 0.92) 0%, rgba(18, 17, 57, 0.5) 60%, rgba(18, 17, 57, 0.1) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
