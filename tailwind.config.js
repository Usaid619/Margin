export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        paper: '#F2EDE3',
        cream: '#E8DFCC',
        ink: '#12110F',
        charcoal: '#2B2925',
        forest: '#3D4A3B',
        navy: '#1B2333',
        amber: '#B5762F',
        ember: '#8A5520',
        glow: '#D39A55',
        mute: '#6E685F',
        night: '#151410',
        bone: '#E6DDCB',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        writing: ['Literata', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        label: '0.22em',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      keyframes: {
        caret: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        bar: {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1)' },
        },
        hint: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '50.1%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        stream: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        caret: 'caret 1.05s steps(1) infinite',
        'spin-slow': 'spinSlow 80s linear infinite',
        bar: 'bar 1.1s ease-in-out infinite',
        hint: 'hint 2.4s cubic-bezier(0.76, 0, 0.24, 1) infinite',
        stream: 'stream 28s linear infinite',
      },
    },
  },
  plugins: [],
};
