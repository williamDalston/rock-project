/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'geode-crack': 'geode-crack 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'burst': 'burst 0.5s ease-out forwards',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'level-up': 'level-up 0.8s ease-out',
        'confidence-pulse': 'confidence-pulse 2s ease-in-out infinite',
        'warning-flash': 'warning-flash 1s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'geode-crack': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '15%': { transform: 'scale(0.9)', filter: 'brightness(0.8)' },
          '30%': { transform: 'scale(1.1)', filter: 'brightness(1.2)' },
          '50%': { transform: 'scale(1.15) rotate(5deg)', filter: 'brightness(1.4)' },
          '70%': { transform: 'scale(1.1) rotate(-3deg)', filter: 'brightness(1.2)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'burst': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'sparkle': {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '25%': { opacity: '1', transform: 'scale(1) rotate(90deg)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8) rotate(180deg)' },
          '75%': { opacity: '1', transform: 'scale(1.1) rotate(270deg)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.7)' },
          '50%': { transform: 'scale(1.1)', boxShadow: '0 0 20px 10px rgba(245, 158, 11, 0.4)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)' },
        },
        'confidence-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'warning-flash': {
          '0%, 100%': { borderColor: 'rgba(239, 68, 68, 0.5)' },
          '50%': { borderColor: 'rgba(239, 68, 68, 1)' },
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
