/**
 * CheckBook 프로젝트 상수 정의
 * - React Query 캐시 키
 * - API 엔드포인트 경로
 * - UI 디자인 시스템 상수
 */

/**
 * React Query 캐시 키
 * @description 쿼리 키는 문자열 리터럴로 정의하여 자동완성 지원
 */
export const QUERY_KEYS = {
  BOOKS_SEARCH: 'booksSearch',
  BOOK_DETAIL: 'bookDetail',
  BOOK_AVAILABILITY: 'bookAvailability',
  USER_LIBRARIES: 'userLibraries',
  USER_BOOK_STATE: 'userBookState',
  USER_PROFILE: 'userProfile',
} as const;

/**
 * API 엔드포인트 경로
 * @description 함수형 경로는 매개변수를 받아 동적으로 생성
 */
export const API_PATHS = {
  SEARCH_BOOKS: '/api/books/search',
  BOOK_DETAIL: (id: string) => `/api/books/${id}`,
  BOOK_AVAILABILITY: (id: string) => `/api/books/${id}/availability`,
  USER_LIBRARIES: '/api/me/libraries',
  USER_BOOK_STATE: (bookId: string) => `/api/me/books/${bookId}/state`,
} as const;

/**
 * UI 디자인 시스템 상수
 * @description Tailwind에서 사용할 수 없는 특수 값이나 z-index 등을 정의
 */
export const UI = {
  SPACING: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
  RADIUS: { sm: '6px', md: '12px', lg: '16px' },
  Z_INDEX: { modal: 50, dropdown: 40, header: 30 },
} as const;

/**
 * 비즈니스 로직 상수
 */
export const DEFAULT_SEARCH_RADIUS_KM = 5;
export const MAX_MY_LIBRARIES = 3;

/**
 * 독서 상태 라벨
 */
export const READING_STATE_LABELS = {
  WISHLIST: '찜',
  READING: '읽는 중',
  READ: '완독',
} as const;
