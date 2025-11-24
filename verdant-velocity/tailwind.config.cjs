/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#020617',
        elevated: '#0B1224',
        primary: '#E5E7EB',
        muted: '#9CA3AF',
        accent: {
          primary: '#22D3EE',
          secondary: '#A855F7',
          warm: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        body: ['"Satoshi"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 80px rgba(34, 211, 238, 0.25)',
      },
    },
  },
  plugins: [],
};
