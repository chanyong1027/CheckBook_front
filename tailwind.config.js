/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 메인 색상: 노란색 계열로 변경
        primary: '#F7B731', // 노란색 (기존 wishlist 색상)
        secondary: '#FFF8E7', // 연한 노란색 배경
        accent: '#FF6B9D', // 핑크색 강조

        // 중립 색상
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#E5E7EB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          800: '#1F2937',
          900: '#111827',
        },

        // 상태 색상
        danger: '#E74C3C',
        success: '#58D68D',

        // 독서 상태별 색상
        wishlist: '#F7B731', // 노란색 (찜)
        reading: '#5DADE2', // 파란색 (읽는중)
        completed: '#58D68D', // 초록색 (완독)

        // 차트 색상 (추가)
        chart: {
          yellow: '#F7B731',
          gray: '#D1D5DB',
          orange: '#FF8C42',
          pink: '#FF6B9D',
          blue: '#5DADE2',
        },
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
