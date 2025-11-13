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
 * @param size - 페이지당 결과 수 (기본 12)
 * @returns 검색 결과 및 페이지네이션 정보
 *
 * @example
 * const result = await fetchBooks('리액트', 1, 12);
 * console.log(result.books); // Book[]
 * console.log(result.totalResults); // 전체 결과 수
 */
export const fetchBooks = async (
  query: string,
  page = 1,
  size = 12
): Promise<BookSearchResult> => {
  const response = await api.get<BookSearchResult>(API_PATHS.SEARCH_BOOKS, {
    params: { query, page, size },
  });
  return response.data;
};

/**
 * 도서 상세 정보 조회
 *
 * @param isbn - 도서 ISBN-13
 * @returns 도서 상세 정보
 *
 * @example
 * const book = await fetchBookDetail('9788937460890');
 * console.log(book.title); // 도서 제목
 */
export const fetchBookDetail = async (isbn: string): Promise<Book> => {
  const response = await api.get<Book>(`/api/books/detail/${isbn}`);
  return response.data;
};

/**
 * 특정 도서의 도서관별 가용성 조회
 *
 * @param isbn - 도서 ISBN-13
 * @param region - 지역 코드 (예: '11' for 서울)
 * @returns 도서관별 가용성 정보 배열 (내 도서관 우선 정렬)
 *
 * @example
 * const availability = await fetchBookAvailability('9788937460890', '11');
 * availability.forEach(item => {
 *   console.log(`${item.libraryName}: ${item.available ? '대출 가능' : '대출 중'}`);
 * });
 */
export const fetchBookAvailability = async (
  isbn: string,
  region: string
): Promise<BookLibraryAvailability[]> => {
  const response = await api.get<any[]>(
    '/api/libraries/book-status',
    {
      params: { isbn, region },
    }
  );

  // 백엔드 LibraryBookStatusDto를 프론트엔드 BookLibraryAvailability로 변환
  return response.data.map((item: any) => ({
    libraryId: String(item.libId),
    bookId: isbn,
    available: item.loanAvailable === true,
    hasBook: item.hasBook === true,
    libraryName: item.libName,
    libraryAddress: item.address,
    libraryPhone: item.tel,
    libraryHomepage: item.homepage,
    latitude: item.latitude,
    longitude: item.longitude,
    isFavorite: item.isFavorite === true,
  }));
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
 * 베스트셀러 도서 목록 조회 (알라딘 API 기반)
 *
 * @returns 베스트셀러 도서 목록
 *
 * @example
 * const bestsellers = await fetchBestsellers();
 */
export const fetchBestsellers = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>('/api/books/bestsellers');
  return response.data;
};

/**
 * 인기 도서 목록 조회
 * @deprecated Use fetchBestsellers instead
 */
export const fetchPopularBooks = async (
  period: 'week' | 'month' | 'year' = 'week',
  limit = 10
): Promise<Book[]> => {
  // Fallback to bestsellers
  return fetchBestsellers();
};

/**
 * 신간 도서 목록 조회 (알라딘 API 기반)
 *
 * @returns 신간 도서 목록
 *
 * @example
 * const newReleases = await fetchNewReleases();
 */
export const fetchNewReleases = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>('/api/books/new-releases');
  return response.data;
};

/**
 * 신간 도서 목록 조회
 * @deprecated Use fetchNewReleases instead
 */
export const fetchNewBooks = async (category?: string, limit = 10): Promise<Book[]> => {
  // Fallback to new releases
  return fetchNewReleases();
};
