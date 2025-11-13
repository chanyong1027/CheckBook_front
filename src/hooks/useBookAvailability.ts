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
 * @param isbn - 도서 ISBN-13
 * @param region - 지역 코드 (예: '11' for 서울) (선택적, 기본값: '11')
 * @param options - 추가 옵션
 * @returns 도서관별 가용성 정보 및 상태 (내 도서관 우선 정렬)
 *
 * @example
 * // 서울 지역 도서관 가용성 조회 (내 도서관 우선)
 * const { availability, isLoading } = useBookAvailability('9788937460890', '11');
 *
 * availability.forEach(item => {
 *   console.log(`${item.libraryName}: ${item.available ? '대출 가능' : '대출 중'}`);
 * });
 *
 * @example
 * // 수동 제어
 * const { availability, refetch } = useBookAvailability('9788937460890', '11', {
 *   enabled: false
 * });
 *
 * // 나중에 수동 실행
 * const handleCheck = () => {
 *   refetch();
 * };
 */
export const useBookAvailability = (
  isbn: string | undefined,
  region: string = '11', // 기본값: 서울
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
  }
) => {
  const {
    data: availability,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<BookLibraryAvailability[], Error>({
    queryKey: [QUERY_KEYS.BOOK_AVAILABILITY, isbn, region],
    queryFn: () => {
      if (!isbn) {
        throw new Error('ISBN is required');
      }
      return fetchBookAvailability(isbn, region);
    },
    enabled: !!isbn && !!region && (options?.enabled ?? true),
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
    /** 도서관별 가용성 정보 배열 (내 도서관 우선 정렬됨) */
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

    /** 조회된 도서관 수 */
    libraryCount: availability?.length ?? 0,
  };
};

/**
 * 특정 도서관에서의 도서 가용성만 조회하는 훅
 * (레거시 - 새로운 API에서는 지역별로 조회하므로 거의 사용하지 않음)
 *
 * @param isbn - 도서 ISBN-13
 * @param libraryId - 도서관 ID
 * @param region - 지역 코드
 * @returns 해당 도서관의 가용성 정보
 *
 * @example
 * const { isAvailable, availableCount, isLoading } = useBookAvailabilityAtLibrary(
 *   '9788937460890',
 *   '12345',
 *   '11'
 * );
 *
 * return (
 *   <div>
 *     {isLoading ? (
 *       <Skeleton />
 *     ) : isAvailable ? (
 *       <Badge>대출 가능</Badge>
 *     ) : (
 *       <Badge variant="gray">대출 중</Badge>
 *     )}
 *   </div>
 * );
 */
export const useBookAvailabilityAtLibrary = (
  isbn: string | undefined,
  libraryId: string | undefined,
  region: string = '11'
) => {
  const { availability, isLoading, isError, error, refetch } = useBookAvailability(
    isbn,
    region
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
