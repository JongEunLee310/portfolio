import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#020712",
          navy: "#06101f",
          surface: "#0d1b2f",
          blue: "#2563eb",
          blueLight: "#3b82f6",
        },
      },
      boxShadow: {
        card: "0 12px 30px rgba(15, 23, 42, 0.08)",
        "card-hover": "0 18px 45px rgba(15, 23, 42, 0.14)",
        glow: "0 0 40px rgba(37, 99, 235, 0.35)",
        "blue-soft": "0 12px 32px rgba(37, 99, 235, 0.18)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 70% 30%, rgba(37,99,235,0.25), transparent 35%), linear-gradient(180deg, #020712 0%, #06101f 100%)",
        "blue-gradient": "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
