/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        ice: {
          50: '#F5FBFD',
          100: '#E6F4FA',
          200: '#CCE9F5',
          300: '#A8D8EA',
          400: '#7CC3DC',
          500: '#4FAECF',
          600: '#3B8FAE',
          700: '#2C6E88',
          800: '#1E4E62',
          900: '#112D3A',
        },
        frost: '#EAF6FB',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'ui-serif', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 80, 120, 0.18)',
        ice: '0 10px 30px -10px rgba(79, 174, 207, 0.55)',
      },
      backgroundImage: {
        'ice-radial':
          'radial-gradient(ellipse at top, #E6F4FA 0%, #A8D8EA 55%, #4FAECF 100%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%,100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        swayslow: {
          '0%,100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        fall: {
          '0%': {
            transform: 'translate3d(0,-10vh,0) rotate(0deg)',
            opacity: '0',
          },
          '10%': { opacity: '0.85' },
          '90%': { opacity: '0.85' },
          '100%': {
            transform: 'translate3d(40px,110vh,0) rotate(360deg)',
            opacity: '0',
          },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(18px,-12px,0) rotate(8deg)' },
        },
        bobx: {
          '0%,100%': { transform: 'translateX(-8px)' },
          '50%': { transform: 'translateX(8px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 4s ease-in-out infinite',
        sway: 'sway 6s ease-in-out infinite',
        swayslow: 'swayslow 9s ease-in-out infinite',
        fall: 'fall 18s linear infinite',
        drift: 'drift 7s ease-in-out infinite',
        bobx: 'bobx 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
