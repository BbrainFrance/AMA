import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        carbon: {
          DEFAULT: "#0A0A0B",
          900: "#0A0A0B",
          800: "#111113",
          700: "#1A1A1D",
          600: "#26262B",
          500: "#3A3A41",
        },
        racing: {
          DEFAULT: "#E10600",
          50: "#FFE5E3",
          100: "#FFB8B3",
          500: "#E10600",
          600: "#B80500",
          700: "#8F0400",
        },
        bone: {
          DEFAULT: "#F5F1EA",
          50: "#FAF7F2",
          100: "#F5F1EA",
          200: "#E8E2D7",
        },
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.08)",
        ring: "#E10600",
        background: "#0A0A0B",
        foreground: "#F5F1EA",
        muted: {
          DEFAULT: "#1A1A1D",
          foreground: "#9A9A9F",
        },
        card: {
          DEFAULT: "#111113",
          foreground: "#F5F1EA",
        },
        popover: {
          DEFAULT: "#111113",
          foreground: "#F5F1EA",
        },
        primary: {
          DEFAULT: "#E10600",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1A1A1D",
          foreground: "#F5F1EA",
        },
        accent: {
          DEFAULT: "#26262B",
          foreground: "#F5F1EA",
        },
        destructive: {
          DEFAULT: "#E10600",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(225, 6, 0, 0.7)" },
          "50%": { boxShadow: "0 0 0 12px rgba(225, 6, 0, 0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
