/**
 * 도서 가용성 조회 커스텀 훅
 *
 * @description
 * - 특정 도서의 도서관별 대출 가능 여부 조회
 * - 내 도서관 기준 자동 조회
 * - 캐싱 및 백그라운드 리페치 지원
 *
 * @example
 * const { availability, isLoading } = useBookAvailability('book-123');
 */

import { useQuery } from '@tanstack/react-query';
import { fetchBookAvailability } from '@/api/books';
import { useLibraryStore } from '@/store/useLibraryStore';
import { QUERY_KEYS } from '@/utils/constants';
import type { BookLibraryAvailability } from '@/types/book';

/**
 * 도서 가용성 조회 훅
 *
 * @param bookId - 도서 ID
 * @param libraryIds - 조회할 도서관 ID 배열 (선택적, 없으면 내 도서관 기준)
 * @param options - 추가 옵션
 * @returns 도서관별 가용성 정보 및 상태
 *
 * @example
 * // 내 도서관 기준 조회
 * const { availability, isLoading } = useBookAvailability('book-123');
 *
 * availability.forEach(item => {
 *   console.log(`${item.libraryId}: ${item.available ? '대출 가능' : '대출 중'}`);
 * });
 *
 * @example
 * // 특정 도서관만 조회
 * const { availability } = useBookAvailability('book-123', ['lib-1', 'lib-2']);
 *
 * @example
 * // 수동 제어
 * const { availability, refetch } = useBookAvailability('book-123', undefined, {
 *   enabled: false
 * });
 *
 * // 나중에 수동 실행
 * const handleCheck = () => {
 *   refetch();
 * };
 */
export const useBookAvailability = (
  bookId: string | undefined,
  libraryIds?: string[],
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  }
) => {
  // 내 도서관 목록 가져오기 (libraryIds가 없을 때)
  const myLibraries = useLibraryStore((state) => state.myLibraries);
  const myLibraryIds = myLibraries.map((lib) => lib.id);

  // 사용할 도서관 ID 목록 결정
  const targetLibraryIds = libraryIds ?? myLibraryIds;

  const {
    data: availability,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<BookLibraryAvailability[], Error>({
    queryKey: [QUERY_KEYS.BOOK_AVAILABILITY, bookId, targetLibraryIds],
    queryFn: () => {
      if (!bookId) {
        throw new Error('Book ID is required');
      }
      return fetchBookAvailability(bookId, targetLibraryIds.length > 0 ? targetLibraryIds : undefined);
    },
    enabled: !!bookId && targetLibraryIds.length > 0 && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2분 (가용성은 자주 변경될 수 있음)
    gcTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: true, // 포커스 시 자동 갱신
    retry: 2,
    // 주기적 리페치 (선택적)
    refetchInterval: options?.refetchInterval,
  });

  // 가용성 정보를 도서관 ID로 매핑
  const availabilityMap = new Map(
    availability?.map((item) => [item.libraryId, item]) ?? []
  );

  // 대출 가능한 도서관 목록
  const availableLibraries = availability?.filter((item) => item.available) ?? [];

  // 대출 불가능한 도서관 목록
  const unavailableLibraries = availability?.filter((item) => !item.available) ?? [];

  return {
    /** 도서관별 가용성 정보 배열 */
    availability: availability ?? [],

    /** 가용성 정보를 도서관 ID로 빠르게 조회 */
    availabilityMap,

    /** 대출 가능한 도서관 목록 */
    availableLibraries,

    /** 대출 불가능한 도서관 목록 */
    unavailableLibraries,

    /** 대출 가능한 도서관이 하나라도 있는지 여부 */
    hasAvailable: availableLibraries.length > 0,

    /** 로딩 중 여부 */
    isLoading,

    /** 백그라운드 페칭 중 여부 */
    isFetching,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

    /** 수동 리페치 */
    refetch,

    /** 조회 중인 도서관 수 */
    libraryCount: targetLibraryIds.length,
  };
};

/**
 * 특정 도서관에서의 도서 가용성만 조회하는 훅
 *
 * @param bookId - 도서 ID
 * @param libraryId - 도서관 ID
 * @returns 해당 도서관의 가용성 정보
 *
 * @example
 * const { isAvailable, availableCount, isLoading } = useBookAvailabilityAtLibrary(
 *   'book-123',
 *   'lib-456'
 * );
 *
 * return (
 *   <div>
 *     {isLoading ? (
 *       <Skeleton />
 *     ) : isAvailable ? (
 *       <Badge>대출 가능 ({availableCount}권)</Badge>
 *     ) : (
 *       <Badge variant="gray">대출 중</Badge>
 *     )}
 *   </div>
 * );
 */
export const useBookAvailabilityAtLibrary = (
  bookId: string | undefined,
  libraryId: string | undefined
) => {
  const { availability, isLoading, isError, error, refetch } = useBookAvailability(
    bookId,
    libraryId ? [libraryId] : undefined
  );

  const libraryAvailability = availability.find((item) => item.libraryId === libraryId);

  return {
    /** 가용성 정보 */
    availability: libraryAvailability ?? null,

    /** 대출 가능 여부 */
    isAvailable: libraryAvailability?.available ?? false,

    /** 대출 가능 권수 */
    availableCount: libraryAvailability?.availableCount ?? 0,

    /** 전체 소장 권수 */
    totalCount: libraryAvailability?.totalCount ?? 0,

    /** 소장 여부 */
    hasBook: libraryAvailability?.hasBook ?? false,

    /** 로딩 중 여부 */
    isLoading,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

    /** 수동 리페치 */
    refetch,
  };
};
