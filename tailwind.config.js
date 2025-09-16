/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          gold: '#B3A093',
          gold1: '#D6D6D6'
        },
        secondary: {
          brown: '#BD5F3B',
          brownDark: '#463F38'
        },
        text: {
          title: '#000000', // Black Title
          gray: '#6D6D6D', // Secondary text, MORE
          muted: '#626161' // Input text, searchbar icon
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
        btn: {
          confirm: '#F39800'
        }
      },
      screens: {
        'hover-hover': { raw: '(hover: hover)' }
      },
      transitionDuration: {
        400: '400ms'
      }
    }
  },
  plugins: []
}
