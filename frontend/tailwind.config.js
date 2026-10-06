/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#111111',
          light: '#171717',
          card: '#222222'
        },
        alabaster: {
          DEFAULT: '#FFFFFF',
          card: '#F4F4F4'
        },
        porcelain: '#FFFFFF',
        gold: {
          DEFAULT: '#E5192B',
          light: '#F14462',
          dark: '#AD0026'
        },
        vermillion: {
          DEFAULT: '#E5192B',
          glow: '#FF4D40'
        },
        border: {
          light: '#E2E2E2',
          dark: '#303030'
        }
      },
      fontFamily: {
        headline: ['Barlow Condensed', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};

