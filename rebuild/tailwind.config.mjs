/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "480px",
      sm: "768px",
      nav: "856px",
      md: "992px",
      lg: "1200px",
      xl: "1440px",
    },
    extend: {
      fontFamily: {
        body: ["Roboto", "system-ui", "-apple-system", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
        ui: ["Montserrat", "system-ui", "sans-serif"],
        alt: ['"Josefin Sans"', "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Courier New"',
          "monospace",
        ],
      },
      colors: {
        accent: {
          from: "var(--accent-from)",
          to: "var(--accent-to)",
          text: "var(--accent-text)",
        },
        ink: {
          DEFAULT: "#111111",
          soft: "#333333",
          muted: "#666666",
        },
        paper: {
          DEFAULT: "#ffffff",
          soft: "#f7f7f7",
          gray: "#eeeeee",
        },
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.85rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.25rem", { lineHeight: "1.5" }],
      },
      zIndex: {
        1: "100",
        2: "200",
        3: "300",
        4: "400",
        5: "500",
        6: "600",
        7: "700",
        8: "800",
        9: "900",
        10: "1000",
      },
      transitionTimingFunction: {
        "in-out-sine": "var(--ease-in-out-sine)",
        "in-out-cubic": "var(--ease-in-out-cubic)",
        "fast-out-slow-in": "var(--ease-fast-out-slow-in)",
        "out-back": "var(--ease-out-back)",
        "page-cover": "var(--ease-page-cover)",
      },
      transitionDuration: {
        "page-cover": "var(--page-cover-duration)",
      },
    },
  },
  plugins: [],
};
