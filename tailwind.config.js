/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3563E9',
        secondary: '#EEF2FF',
        accent: '#58D68D',
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#E5E7EB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
        },
        danger: '#E74C3C',
        success: '#58D68D',
        wishlist: '#F7B731',
        reading: '#5DADE2',
        completed: '#58D68D',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'Noto Sans KR',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      spacing: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      fontSize: {
        h1: ['24px', { lineHeight: '1.5', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '1.5', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      letterSpacing: {
        tight: '-0.25px',
      },
      zIndex: {
        modal: '50',
        dropdown: '40',
        header: '30',
      },
    },
  },
  plugins: [],
};
