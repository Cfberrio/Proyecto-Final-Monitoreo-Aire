/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#00E400',
          moderate: '#FFFF00',
          sensitive: '#FF7E00',
          unhealthy: '#FF0000',
          very_unhealthy: '#8F3F97',
          hazardous: '#7E0023',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xl: '24px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 240ms ease-out',
      },
    },
  },
  plugins: [],
}
