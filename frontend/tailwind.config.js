/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#19FFD6',
          'dark-cyan': '#00967B',
          orange: '#FF8826',
          gray: '#B0B6B6',
          'dark-gray': '#1a1a1a',
          'darker': '#0a0a0a',
        },
      },
      fontFamily: {
        mono: ['PT Mono', 'monospace'],
        'tech': ['Lucida Console', 'Courier New', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-in',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(25, 255, 214, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(25, 255, 214, 0.8)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(25, 255, 214, 0.5)',
        'cyber-orange': '0 0 20px rgba(255, 136, 38, 0.5)',
      },
    },
  },
  plugins: [],
}
