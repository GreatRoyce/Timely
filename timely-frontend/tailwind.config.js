/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },

        secondary: {
          DEFAULT: "#F8FAFC",
          foreground: "#111827",
        },

        background: "#F8FAFC",

        surface: "#FFFFFF",

        foreground: "#111827",

        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },

        border: "#E5E7EB",

        input: "#E5E7EB",

        ring: "#6366F1",

        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },

        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },

        danger: {
          DEFAULT: "#BA1A1A",
          foreground: "#FFFFFF",
        },

        info: {
          DEFAULT: "#0EA5E9",
          foreground: "#FFFFFF",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },

      boxShadow: {
        xs: "0 1px 2px rgba(15,23,42,.05)",

        sm: "0 2px 6px rgba(15,23,42,.06)",

        md: "0 8px 24px rgba(15,23,42,.08)",

        lg: "0 12px 40px rgba(15,23,42,.12)",

        xl: "0 20px 60px rgba(15,23,42,.16)",
      },
      fontSize: {
        xs: ["7.5px", { lineHeight: "12px", fontWeight: "400" }], // text-xs

        sm: ["10px", { lineHeight: "16px", fontWeight: "400" }], // paragraph

        base: ["12px", { lineHeight: "18px", fontWeight: "400" }],

        md: ["14px", { lineHeight: "20px", fontWeight: "400" }],

        lg: ["16px", { lineHeight: "24px", fontWeight: "500" }],

        xl: ["20px", { lineHeight: "28px", fontWeight: "600" }], // h5

        "2xl": ["24px", { lineHeight: "32px", fontWeight: "600" }], // h4

        "3xl": ["30px", { lineHeight: "38px", fontWeight: "700" }], // h3

        "4xl": ["40px", { lineHeight: "48px", fontWeight: "700" }], // h2

        "5xl": ["52px", { lineHeight: "60px", fontWeight: "800" }], // h1

        "6xl": ["64px", { lineHeight: "72px", fontWeight: "800" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(.22,1,.36,1)",
      },

      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },

      maxWidth: {
        content: "1280px",
      },
    },
  },

  plugins: [],
};
