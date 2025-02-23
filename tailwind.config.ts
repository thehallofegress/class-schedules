import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",         // ✅ Includes all pages & layout.tsx
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}", // ✅ Ensures app/components/ is scanned
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",       // ✅ If using Pages Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",  // ✅ Shared components
    "./public/**/*.html",                     // ✅ If using static HTML files
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        textPrimary: "var(--text-primary)", // Add primary text color
        textSecondary: "var(--text-secondary)", // Add secondary text color
        textMuted: "var(--text-muted)", // Muted text for less emphasis
      },
    },
  },
  plugins: [],
} satisfies Config;
