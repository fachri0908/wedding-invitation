/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // teal / navy scale derived from the supplied palette
        // (#062A3B #0B7A75 #1BB7A6 #A6F0E6 #F2F7F6), kept under the `ice` key so
        // every existing `*-ice-*` class recolours at once
        ice: {
          50: '#F2F7F6',
          100: '#E3F3F0',
          200: '#A6F0E6',
          300: '#5FDDCB',
          400: '#1BB7A6',
          500: '#129E8F',
          600: '#0B7A75',
          700: '#0A5A56',
          800: '#062A3B',
          900: '#041A26',
        },
        frost: '#EAF6F3',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'ui-serif', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(6, 42, 59, 0.18)',
        ice: '0 10px 30px -10px rgba(27, 183, 166, 0.55)',
      },
      backgroundImage: {
        'ice-radial':
          'radial-gradient(ellipse at top, #E3F3F0 0%, #5FDDCB 55%, #1BB7A6 100%)',
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
        shimmerSweep: {
          '0%': { backgroundPosition: '-200% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        bokeh: {
          '0%,100%': {
            transform: 'translate3d(0,0,0) scale(1)',
            opacity: '0.55',
          },
          '50%': {
            transform: 'translate3d(20px,-30px,0) scale(1.18)',
            opacity: '0.95',
          },
        },
        aurora: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(40px,-30px,0) scale(1.25)' },
        },
        gateOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.08)' },
        },
        confettiOut: {
          '0%': {
            transform: 'translate(-50%,-50%) scale(0) rotate(0deg)',
            opacity: '1',
          },
          '60%': { opacity: '1' },
          '100%': {
            transform:
              'translate(calc(-50% + var(--cx, 0px)), calc(-50% + var(--cy, 0px))) scale(1) rotate(220deg)',
            opacity: '0',
          },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.85' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scrollDot: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(14px)', opacity: '0' },
        },
        sealBreak: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '15%': { transform: 'scale(1.15) rotate(-4deg)' },
          '30%': { transform: 'scale(0.95) rotate(3deg)' },
          '45%': { transform: 'scale(1.08) rotate(-2deg)' },
          '60%': {
            transform: 'scale(1.2) rotate(0deg)',
            filter: 'brightness(1.6)',
          },
          '100%': {
            transform: 'scale(2.6) rotate(0deg)',
            opacity: '0',
            filter: 'brightness(2) blur(6px)',
          },
        },
        sealIdle: {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-4px) rotate(2deg)' },
        },
        petalBurst: {
          '0%': {
            transform: 'translate(-50%,-50%) scale(0.2) rotate(0deg)',
            opacity: '0',
          },
          '15%': { opacity: '1' },
          '100%': {
            transform:
              'translate(calc(-50% + var(--bx, 0px)), calc(-50% + var(--by, 0px))) scale(1) rotate(var(--br, 180deg))',
            opacity: '0',
          },
        },
        sparkle: {
          '0%': { transform: 'translate(-50%,-50%) scale(0.4)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': {
            transform: 'translate(-50%, calc(-50% - 40px)) scale(0)',
            opacity: '0',
          },
        },
        twinkle: {
          '0%,100%': { opacity: '0.3', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        // origami bird flies across the screen along a gentle arc
        birdCross: {
          '0%': {
            transform:
              'translate3d(var(--bx0,-30vw), var(--by0,40vh), 0) rotate(var(--brot,8deg)) scale(var(--bs,1))',
            opacity: '0',
          },
          '12%': { opacity: '1' },
          '50%': {
            transform:
              'translate3d(50vw, var(--bymid,28vh), 0) rotate(var(--brot,8deg)) scale(var(--bs,1))',
          },
          '88%': { opacity: '1' },
          '100%': {
            transform:
              'translate3d(var(--bx1,130vw), var(--by1,34vh), 0) rotate(var(--brot,8deg)) scale(var(--bs,1))',
            opacity: '0',
          },
        },
        // wing flap (scaleY pivot at the fold)
        wingFlap: {
          '0%,100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.45)' },
        },
        // petal/leaf sweep one-shot across the viewport
        sweepAcross: {
          '0%': {
            transform:
              'translate3d(var(--sx0,-20vw), var(--sy0,0), 0) rotate(0deg)',
            opacity: '0',
          },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': {
            transform:
              'translate3d(var(--sx1,120vw), var(--sy1,0), 0) rotate(var(--srot,300deg))',
            opacity: '0',
          },
        },
        // envelope top flap swinging open
        flapOpen: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(-176deg)' },
        },
        // the letter card rising out of the envelope
        letterRise: {
          '0%': { transform: 'translateY(28%) scale(0.92)', opacity: '0.6' },
          '55%': { transform: 'translateY(-46%) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-46%) scale(1)', opacity: '1' },
        },
        // whole envelope settling/fading as we reveal the page
        envFade: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.12)', opacity: '0' },
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
        shimmerSweep: 'shimmerSweep 7s linear infinite',
        bokeh: 'bokeh 12s ease-in-out infinite',
        aurora: 'aurora 26s ease-in-out infinite',
        gateOut: 'gateOut 850ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        confettiOut:
          'confettiOut 1700ms cubic-bezier(0.22,1,0.36,1) forwards',
        pulseRing: 'pulseRing 2.4s ease-out infinite',
        spinSlow: 'spinSlow 60s linear infinite',
        scrollDot: 'scrollDot 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        sealBreak: 'sealBreak 900ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        sealIdle: 'sealIdle 4s ease-in-out infinite',
        petalBurst: 'petalBurst 1600ms cubic-bezier(0.22,1,0.36,1) forwards',
        sparkle: 'sparkle 900ms ease-out forwards',
        twinkle: 'twinkle 2.2s ease-in-out infinite',
        birdCross: 'birdCross 1900ms cubic-bezier(0.4,0,0.2,1) forwards',
        wingFlap: 'wingFlap 260ms ease-in-out infinite',
        sweepAcross: 'sweepAcross 1500ms cubic-bezier(0.36,0,0.2,1) forwards',
        flapOpen: 'flapOpen 900ms cubic-bezier(0.5,0,0.2,1) forwards',
        letterRise: 'letterRise 1400ms cubic-bezier(0.22,1,0.36,1) forwards',
        envFade: 'envFade 700ms ease-in forwards',
      },
    },
  },
  plugins: [],
};
