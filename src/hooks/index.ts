/**
 * Custom Hooks 모듈
 *
 * @description
 * CheckBook 애플리케이션의 모든 커스텀 훅을 중앙에서 관리하고 export합니다.
 *
 * @example
 * import { useBookSearch, useAuth, useUserLibrary } from '@/hooks';
 */

// ==================== 도서 검색 및 조회 ====================
export {
  useBookSearch,
  useDebouncedBookSearch,
} from './useBookSearch';

export {
  useBookDetail,
  useBookDetails,
} from './useBookDetail';

export {
  useBookAvailability,
  useBookAvailabilityAtLibrary,
} from './useBookAvailability';

// ==================== 사용자 인증 ====================
export {
  useAuth,
  useRequireAuth,
  useIsAuthenticated,
} from './useAuth';

// ==================== 도서관 관리 ====================
export {
  useUserLibrary,
  useIsLibraryRegistered,
  useCanAddLibrary,
} from './useUserLibrary';

// ==================== 독서 상태 관리 ====================
export {
  useUserBookState,
  useUserBookStates,
  useWishlistBooks,
  useReadingBooks,
  useReadBooks,
} from './useUserBookState';

// ==================== 위치 정보 ====================
export { useGeolocation } from './useGeolocation';
