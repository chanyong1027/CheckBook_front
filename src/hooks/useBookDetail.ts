/**
 * 도서 상세 정보 조회 커스텀 훅
 *
 * @description
 * - React Query 기반 도서 상세 정보 조회
 * - 캐싱 및 백그라운드 리페치 지원
 * - 에러 및 로딩 상태 관리
 *
 * @example
 * const { book, isLoading, error } = useBookDetail('book-123');
 */

import { useQuery } from '@tanstack/react-query';
import { fetchBookDetail } from '@/api/books';
import { QUERY_KEYS } from '@/utils/constants';
import type { Book } from '@/types/book';

/**
 * 도서 상세 정보 조회 훅
 *
 * @param bookId - 도서 ID
 * @param options - 추가 옵션
 * @returns 도서 상세 정보 및 상태
 *
 * @example
 * // 기본 사용
 * const { book, isLoading, error } = useBookDetail('book-123');
 *
 * if (isLoading) return <Skeleton />;
 * if (error) return <ErrorState error={error} />;
 * if (!book) return <NotFound />;
 *
 * return <BookDetail book={book} />;
 *
 * @example
 * // 수동 리페치
 * const { book, refetch } = useBookDetail('book-123');
 *
 * const handleRefresh = () => {
 *   refetch();
 * };
 */
export const useBookDetail = (
  bookId: string | undefined,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  const {
    data: book,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Book, Error>({
    queryKey: [QUERY_KEYS.BOOK_DETAIL, bookId],
    queryFn: () => {
      if (!bookId) {
        throw new Error('Book ID is required');
      }
      return fetchBookDetail(bookId);
    },
    enabled: !!bookId && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    /** 도서 상세 정보 */
    book: book ?? null,

    /** 로딩 중 여부 (첫 로드) */
    isLoading,

    /** 백그라운드 페칭 중 여부 */
    isFetching,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

    /** 수동 리페치 */
    refetch,

    /** 도서가 없는지 여부 */
    isNotFound: !isLoading && !book,
  };
};

/**
 * 여러 도서의 상세 정보를 동시에 조회하는 훅
 *
 * @param bookIds - 도서 ID 배열
 * @returns 도서 상세 정보 배열 및 상태
 *
 * @example
 * const { books, isLoading } = useBookDetails(['book-1', 'book-2', 'book-3']);
 *
 * return (
 *   <div>
 *     {books.map(book => book && <BookCard key={book.id} book={book} />)}
 *   </div>
 * );
 */
export const useBookDetails = (bookIds: string[]) => {
  const queries = bookIds.map((id) => ({
    queryKey: [QUERY_KEYS.BOOK_DETAIL, id],
    queryFn: () => fetchBookDetail(id),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  }));

  // useQueries를 사용하여 병렬 처리
  const results = queries.map((query) =>
    useQuery<Book, Error>(query)
  );

  const books = results.map((result) => result.data ?? null);
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const errors = results
    .map((result) => result.error)
    .filter((error): error is Error => error !== null);

  return {
    /** 도서 상세 정보 배열 (null 포함 가능) */
    books,

    /** 하나라도 로딩 중이면 true */
    isLoading,

    /** 하나라도 에러가 발생하면 true */
    isError,

    /** 발생한 에러 배열 */
    errors,

    /** 모든 도서가 로드되었는지 여부 */
    isAllLoaded: !isLoading && books.every((book) => book !== null),
  };
};
