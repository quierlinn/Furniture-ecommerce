export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        primary: { DEFAULT: "hsl(221.2 83.2% 53.3%)", foreground: "hsl(210 40% 98%)" },
        muted: { DEFAULT: "hsl(210 40% 96.1%)", foreground: "hsl(215.4 16.3% 46.9%)" },
        // Add semantic colors: success, warning, error
      },
      fontFamily: { sans: ["Inter var", "Inter", "sans-serif"] },
      borderRadius: { lg: "0.5rem", md: "calc(0.5rem - 2px)", sm: "calc(0.5rem - 4px)" },
      keyframes: {
        "badge-pulse": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.8" } },
      },
      animation: { pulse: "badge-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
