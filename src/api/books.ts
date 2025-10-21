/**
 * 도서 관련 API
 *
 * @description
 * - 도서 검색, 상세 조회, 가용성 확인
 * - 알라딘 API 및 도서관 API 통합
 */

import { api } from './index';
import { Book, BookSearchResult, BookLibraryAvailability } from '@/types/book';
import { API_PATHS } from '@/utils/constants';

/**
 * 도서 검색
 *
 * @param query - 검색 키워드 (제목, 저자 등)
 * @param page - 페이지 번호 (1부터 시작)
 * @param pageSize - 페이지당 결과 수 (기본 20)
 * @returns 검색 결과 및 페이지네이션 정보
 *
 * @example
 * const result = await fetchBooks('리액트', 1, 20);
 * console.log(result.books); // Book[]
 * console.log(result.totalCount); // 전체 결과 수
 */
export const fetchBooks = async (
  query: string,
  page = 1,
  pageSize = 20
): Promise<BookSearchResult> => {
  const response = await api.get<BookSearchResult>(API_PATHS.SEARCH_BOOKS, {
    params: { q: query, page, pageSize },
  });
  return response.data;
};

/**
 * 도서 상세 정보 조회
 *
 * @param id - 도서 ID
 * @returns 도서 상세 정보
 *
 * @example
 * const book = await fetchBookDetail('book-123');
 * console.log(book.title); // 도서 제목
 */
export const fetchBookDetail = async (id: string): Promise<Book> => {
  const response = await api.get<Book>(API_PATHS.BOOK_DETAIL(id));
  return response.data;
};

/**
 * 특정 도서의 도서관별 가용성 조회
 *
 * @param bookId - 도서 ID
 * @param libraryIds - 도서관 ID 배열 (선택적, 없으면 내 도서관 기준)
 * @returns 도서관별 가용성 정보 배열
 *
 * @example
 * const availability = await fetchBookAvailability('book-123');
 * availability.forEach(item => {
 *   console.log(`${item.libraryId}: ${item.available ? '대출 가능' : '대출 중'}`);
 * });
 */
export const fetchBookAvailability = async (
  bookId: string,
  libraryIds?: string[]
): Promise<BookLibraryAvailability[]> => {
  const response = await api.get<BookLibraryAvailability[]>(
    API_PATHS.BOOK_AVAILABILITY(bookId),
    {
      params: libraryIds ? { libraryIds: libraryIds.join(',') } : undefined,
    }
  );
  return response.data;
};

/**
 * 도서 추천 목록 조회
 *
 * @param category - 카테고리 (선택적)
 * @param limit - 최대 결과 수 (기본 10)
 * @returns 추천 도서 목록
 *
 * @example
 * const recommended = await fetchRecommendedBooks('소설', 5);
 */
export const fetchRecommendedBooks = async (
  category?: string,
  limit = 10
): Promise<Book[]> => {
  const response = await api.get<Book[]>('/api/books/recommended', {
    params: { category, limit },
  });
  return response.data;
};

/**
 * 인기 도서 목록 조회
 *
 * @param period - 기간 ('week' | 'month' | 'year')
 * @param limit - 최대 결과 수 (기본 10)
 * @returns 인기 도서 목록
 *
 * @example
 * const popular = await fetchPopularBooks('week', 20);
 */
export const fetchPopularBooks = async (
  period: 'week' | 'month' | 'year' = 'week',
  limit = 10
): Promise<Book[]> => {
  const response = await api.get<Book[]>('/api/books/popular', {
    params: { period, limit },
  });
  return response.data;
};

/**
 * 신간 도서 목록 조회
 *
 * @param category - 카테고리 (선택적)
 * @param limit - 최대 결과 수 (기본 10)
 * @returns 신간 도서 목록
 *
 * @example
 * const newBooks = await fetchNewBooks('IT', 15);
 */
export const fetchNewBooks = async (category?: string, limit = 10): Promise<Book[]> => {
  const response = await api.get<Book[]>('/api/books/new', {
    params: { category, limit },
  });
  return response.data;
};
