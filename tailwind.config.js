/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          gold: '#B3A093',
          gold1: '#D6D6D6',
          gold2: '#CEC4BD',
          gold3: '#7A695D'
        },
        secondary: {
          brown: '#BD5F3B',
          brownDark: '#463F38'
        },
        text: {
          title: '#000000', // Black Title
          gray: '#6D6D6D', // Secondary text, MORE
          muted: '#626161', // Input text, searchbar icon,
          error: '#EA0061' // Validate error
        },
        alert: {
          success: '#75AF7A',
          error: '#BC303C'
        },
        divider: {
          light: '#C4C4C4', // TAB divider, input frame, CTA/disabled
          dark: '#000000', // TAB divider active
          medium: '#AFAFAF', // General divider
          soft: '#F2F2F2', // Softer divider
          bg: '#F3F3F3' // Background
        },
        tb: {
          header: '#EDE1D9',
          body: '#F1F1F1'
        },
        others: {
          original: '#F39800',
          hover: '#BF7905',
          click: '#BF7905',
          gray1: '#787878',
          gray2: '#E8E8E8',
          gray3: '#D6D6D6',
          gray4: '#C6C6C6',
          gray5: '#A3A3A3',
          gray6: '#F2ECE7',
          gray7: '#323232',
          gray8: '#E5E5E5',
          gray9: '#FFF6DD',
          gray10: '#FFE6BD',
        }
      },
      screens: {
        'hover-hover': { raw: '(hover: hover)' }
      },
      transitionDuration: {
        400: '400ms'
      },/**
       * Typography scale
       * - Mobile (default)
       * - Desktop tokens end with -d (use md:text-*-d)
       */
      fontSize: {
        // ---- Mobile ----
        'h1': ['34px', { lineHeight: '1.3' }],
        'h1a': ['34px', { lineHeight: '1.3' }], // use font-light
        'h2': ['30px', { lineHeight: '1.35' }],
        'h3': ['22px', { lineHeight: '1.4' }],
        'h4': ['18px', { lineHeight: '1.4' }],
        'h5': ['18px', { lineHeight: '1.6' }],
        'h6': ['16px', { lineHeight: '1.6' }],

        // ---- Desktop (apply with md:) ----
        'h1-d': ['36px', { lineHeight: '1.3' }],  // use font-bold
        'h1a-d': ['36px', { lineHeight: '1.3' }],  // use font-light
        'h2-d': ['32px', { lineHeight: '1.35' }], // use font-bold
        'h3-d': ['24px', { lineHeight: '1.4' }],  // use font-bold
        'h4-d': ['20px', { lineHeight: '1.4' }],  // use font-bold
        'h5-d': ['18px', { lineHeight: '1.6' }],
        'h6-d': ['16px', { lineHeight: '1.6' }],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      },
    }
  },
  plugins: []
}
