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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-plum": "#3E1F47",
        "brand-umber": "#8B4513",
        "brand-gold": "#D4AF37",
        "brand-bone": "#F5F5F0",
        "brand-charcoal": "#333333",
      },
      fontFamily: {
        sans: ["var(--font-satoshi)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      borderColor: {
        brutalist: "rgba(62, 31, 71, 0.2)", // brand-plum at 20%
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
