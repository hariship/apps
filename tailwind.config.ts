import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Earthy tones for the Star Trek inspired theme
        terracotta: {
          DEFAULT: "#8B4513",
          light: "#A0522D",
          dark: "#704214",
        },
        sand: {
          DEFAULT: "#D2B48C",
          light: "#DEB887",
          dark: "#C19A6B",
        },
        sage: {
          DEFAULT: "#6B8E4F",
          light: "#7FA05A",
          dark: "#5A7A43",
        },
        stone: {
          DEFAULT: "#918B7C",
          light: "#A8A295",
          dark: "#7A7465",
        },
        "dusty-purple": "#9B7BA6",
        "dusty-blue": "#5B8FA8",
      },
      fontFamily: {
        'display': ['Antonio', 'sans-serif'],
        'tech': ['Share Tech Mono', 'monospace'],
        'orbital': ['Orbitron', 'sans-serif'],
      },
      borderRadius: {
        'pill-left': '40px 0 0 40px',
        'pill-right': '0 20px 20px 0',
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;