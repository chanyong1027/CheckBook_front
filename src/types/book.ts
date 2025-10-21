/**
 * 도서 관련 타입 정의
 */

/**
 * 도서 대출 가능 여부
 */
export type BookAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';

/**
 * 도서 정보 인터페이스
 * @description 알라딘 API 및 도서관 API로부터 받아올 도서 기본 정보
 */
export interface Book {
  /** 도서 고유 ID */
  id: string;

  /** 도서 제목 */
  title: string;

  /** 저자 */
  author: string;

  /** 출판사 */
  publisher: string;

  /** 출판 연도 */
  pubYear: number;

  /** ISBN-13 (13자리 국제 표준 도서 번호) */
  isbn13: string;

  /** 표지 이미지 URL (선택적) */
  coverUrl?: string;

  /** 평균 별점 (선택적, 1-5점) */
  rating?: number;

  /** 대출 가능 여부 (선택적) */
  availability?: BookAvailability;

  /** 도서 설명 (선택적) */
  description?: string;

  /** 카테고리/장르 (선택적) */
  category?: string;

  /** 페이지 수 (선택적) */
  pages?: number;
}

/**
 * 도서 검색 결과 인터페이스
 */
export interface BookSearchResult {
  /** 검색된 도서 목록 */
  books: Book[];

  /** 전체 결과 수 */
  totalCount: number;

  /** 현재 페이지 */
  page: number;

  /** 페이지당 결과 수 */
  pageSize: number;

  /** 다음 페이지 존재 여부 */
  hasNextPage: boolean;
}

/**
 * 특정 도서관에서의 도서 가용성 정보
 */
export interface BookLibraryAvailability {
  /** 도서관 ID */
  libraryId: string;

  /** 도서 ID */
  bookId: string;

  /** 대출 가능 여부 */
  available: boolean;

  /** 소장 여부 */
  hasBook: boolean;

  /** 대출 가능 권수 (선택적) */
  availableCount?: number;

  /** 전체 소장 권수 (선택적) */
  totalCount?: number;

  /** 예약 대기 수 (선택적) */
  reservationCount?: number;

  /** 마지막 업데이트 시간 (선택적) */
  lastUpdated?: string;
}
