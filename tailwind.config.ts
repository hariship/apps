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
        // Blue tones like blog
        terracotta: {
          DEFAULT: "#6b8caf",
          light: "#6b8caf",
          dark: "#6b8caf",
        },
        sand: {
          DEFAULT: "#DEB887",
          light: "#F5DEB3",
          dark: "#D2B48C",
        },
        forest: {
          DEFAULT: "#556B2F",
          light: "#6B8E23",
          dark: "#483C32",
        },
        stone: {
          DEFAULT: "#A0A0A0",
          light: "#C0C0C0",
          dark: "#808080",
        },
        sage: {
          DEFAULT: "#87A96B",
          light: "#9CB86F",
          dark: "#6B8E23",
        },
        earth: {
          green: "#8FBC8F",
          brown: "#8B7355",
          gray: "#696969",
        },
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
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};

export default config;