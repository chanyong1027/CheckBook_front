/**
 * 도서 관련 타입 정의
 */

/**
 * 도서 대출 가능 여부
 */
export type BookAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';

/**
 * 도서 정보 인터페이스 (백엔드 응답 구조에 맞춤)
 * @description 알라딘 API 및 도서관 API로부터 받아올 도서 기본 정보
 */
export interface Book {
  /** 도서 제목 */
  title: string;

  /** 저자 */
  author: string;

  /** 출판사 */
  publisher: string;

  /** ISBN-13 (13자리 국제 표준 도서 번호) */
  isbn13: string;

  /** 표지 이미지 URL */
  cover?: string;

  /** 도서 설명 */
  description?: string;

  /** 출판일 (YYYY-MM-DD) */
  publishedAt?: string;

  // Legacy fields for backward compatibility
  /** @deprecated Use isbn13 instead */
  id?: string;

  /** @deprecated Use publishedAt instead */
  pubYear?: number;

  /** @deprecated Use cover instead */
  coverUrl?: string;

  /** 평균 별점 (선택적, 1-5점) */
  rating?: number;

  /** 대출 가능 여부 (선택적) */
  availability?: BookAvailability;

  /** 카테고리/장르 (선택적) */
  category?: string;

  /** 페이지 수 (선택적) */
  pages?: number;
}

/**
 * 도서 검색 결과 인터페이스 (백엔드 응답 구조에 맞춤)
 */
export interface BookSearchResult {
  /** 전체 결과 수 */
  totalResults: number;

  /** 검색된 도서 목록 */
  books: Book[];
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

  /** 도서관 이름 */
  libraryName?: string;

  /** 도서관 주소 */
  libraryAddress?: string;

  /** 도서관 전화번호 */
  libraryPhone?: string;

  /** 도서관 홈페이지 */
  libraryHomepage?: string;

  /** 위도 */
  latitude?: number;

  /** 경도 */
  longitude?: number;

  /** 내 도서관 여부 (우선 표시용) */
  isFavorite?: boolean;

  /** 사용자로부터의 거리 (km, 클라이언트에서 계산) */
  distance?: number | null;

  /** 대출 가능 권수 (선택적) */
  availableCount?: number;

  /** 전체 소장 권수 (선택적) */
  totalCount?: number;

  /** 예약 대기 수 (선택적) */
  reservationCount?: number;

  /** 마지막 업데이트 시간 (선택적) */
  lastUpdated?: string;
}
