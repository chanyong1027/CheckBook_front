/**
 * 도서 검색 커스텀 훅
 *
 * @description
 * - React Query 기반 무한 스크롤 검색
 * - 디바운스를 통한 API 호출 최적화
 * - 캐싱 및 백그라운드 리페치 지원
 * - 페이지네이션 자동 처리
 *
 * @example
 * const { books, isLoading, fetchNextPage, hasNextPage } = useBookSearch('리액트');
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchBooks } from '@/api/books';
import { QUERY_KEYS } from '@/utils/constants';
import type { Book, BookSearchResult } from '@/types/book';
import * as React from 'react';

/**
 * 도서 검색 옵션
 */
interface UseBookSearchOptions {
  /** 검색어 */
  query: string;
  /** 페이지당 결과 수 (기본값: 20) */
  pageSize?: number;
  /** 자동 검색 활성화 여부 (기본값: true) */
  enabled?: boolean;
  /** staleTime (기본값: 5분) */
  staleTime?: number;
}

/**
 * 도서 검색 훅
 *
 * @param options - 검색 옵션
 * @returns 검색 결과 및 페이지네이션 상태
 *
 * @example
 * // 기본 사용
 * const { books, isLoading, error } = useBookSearch({ query: '리액트' });
 *
 * @example
 * // 무한 스크롤
 * const { books, fetchNextPage, hasNextPage, isFetchingNextPage } = useBookSearch({
 *   query: '타입스크립트',
 *   pageSize: 10
 * });
 *
 * // 스크롤 이벤트에서
 * if (hasNextPage && !isFetchingNextPage) {
 *   fetchNextPage();
 * }
 */
export const useBookSearch = ({
  query,
  pageSize = 20,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5분
}: UseBookSearchOptions) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<BookSearchResult, Error>({
    // 쿼리 키에 검색어와 페이지 크기 포함
    queryKey: [QUERY_KEYS.BOOKS_SEARCH, query, pageSize],

    // 페이지 fetch 함수
    queryFn: ({ pageParam }) => fetchBooks(query, pageParam as number, pageSize),

    // 초기 페이지 파라미터 (React Query v5 필수)
    initialPageParam: 1,

    // 다음 페이지 파라미터 계산
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },

    // 이전 페이지 파라미터 계산 (선택적)
    getPreviousPageParam: (firstPage) => {
      return firstPage.page > 1 ? firstPage.page - 1 : undefined;
    },

    // 검색어가 비어있으면 쿼리 비활성화
    enabled: enabled && query.trim().length > 0,

    // 캐시 설정
    staleTime,
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)

    // 백그라운드 리페치 설정
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    // 재시도 설정
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 모든 페이지의 도서를 평탄화
  const books: Book[] = data?.pages.flatMap((page) => page.books) ?? [];

  // 전체 결과 수 (첫 페이지 기준)
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // 현재 로드된 페이지 수
  const loadedPages = data?.pages.length ?? 0;

  return {
    /** 검색된 도서 목록 (모든 페이지 통합) */
    books,

    /** 전체 결과 수 */
    totalCount,

    /** 현재 로드된 페이지 수 */
    loadedPages,

    /** 로딩 중 여부 (첫 페이지) */
    isLoading,

    /** 다음 페이지 로딩 중 여부 */
    isFetchingNextPage,

    /** 다음 페이지 존재 여부 */
    hasNextPage: hasNextPage ?? false,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

    /** 다음 페이지 가져오기 */
    fetchNextPage,

    /** 검색 재실행 */
    refetch,

    /** 검색 결과가 비어있는지 여부 */
    isEmpty: !isLoading && books.length === 0,
  };
};

/**
 * 디바운스된 도서 검색 훅
 *
 * @description
 * - 사용자 입력 중에는 검색을 지연시켜 API 호출 최적화
 * - 내부적으로 useBookSearch 사용
 *
 * @param query - 검색어
 * @param delay - 디바운스 지연 시간 (밀리초, 기본값: 500ms)
 * @returns useBookSearch와 동일한 반환값
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState('');
 * const { books, isLoading } = useDebouncedBookSearch(searchQuery, 300);
 *
 * // 사용자가 타이핑을 멈춘 후 300ms 뒤에 검색 실행
 */
export const useDebouncedBookSearch = (
  query: string,
  delay: number = 500,
  options?: Omit<UseBookSearchOptions, 'query'>
) => {
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  return useBookSearch({
    query: debouncedQuery,
    ...options,
  });
};
