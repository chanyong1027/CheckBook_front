/**
 * 사용자 관련 타입 정의
 */

/**
 * 독서 상태 타입
 */
export type ReadingState = 'WISHLIST' | 'READING' | 'READ';

/**
 * 성별 타입
 */
export type Gender = 'male' | 'female';

/**
 * 연령대 타입
 */
export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대' | '60대 이상';

/**
 * 사용자 정보 인터페이스
 */
export interface User {
  /** 사용자 고유 ID */
  id: string;

  /** 이메일 주소 */
  email: string;

  /** 닉네임 */
  nickname: string;

  /** 성별 (선택적) */
  gender?: Gender;

  /** 연령대 (선택적) */
  ageGroup?: AgeGroup;

  /** 프로필 이미지 URL (선택적) */
  profileImageUrl?: string;

  /** 가입일 (선택적) */
  createdAt?: string;

  /** 마지막 수정일 (선택적) */
  updatedAt?: string;

  /** 마지막 로그인 시간 (선택적) */
  lastLoginAt?: string;
}

/**
 * 사용자의 도서별 독서 상태 인터페이스
 */
export interface UserBookState {
  /** 도서 ID */
  bookId: string;

  /** 독서 상태 (찜, 읽는 중, 완독) */
  state: ReadingState;

  /** 별점 (선택적, 1-5점) */
  rating?: number;

  /** 코멘트/리뷰 (선택적) */
  comment?: string;

  /** 읽기 시작한 날짜 (선택적, ISO 8601 형식) */
  startDate?: string;

  /** 읽기 완료한 날짜 (선택적, ISO 8601 형식) */
  endDate?: string;

  /** 생성일시 (선택적) */
  createdAt?: string;

  /** 수정일시 (선택적) */
  updatedAt?: string;
}

/**
 * 사용자 독서 통계 인터페이스 (선택적)
 */
export interface UserReadingStats {
  /** 총 찜한 책 수 */
  wishlistCount: number;

  /** 읽는 중인 책 수 */
  readingCount: number;

  /** 완독한 책 수 */
  readCount: number;

  /** 평균 별점 (선택적) */
  averageRating?: number;

  /** 올해 완독한 책 수 (선택적) */
  yearlyReadCount?: number;

  /** 이번 달 완독한 책 수 (선택적) */
  monthlyReadCount?: number;
}

/**
 * 사용자 인증 정보 인터페이스
 */
export interface AuthToken {
  /** JWT 액세스 토큰 */
  accessToken: string;

  /** 리프레시 토큰 (선택적) */
  refreshToken?: string;

  /** 토큰 만료 시간 (Unix timestamp, 선택적) */
  expiresAt?: number;
}

/**
 * 로그인 요청 인터페이스
 */
export interface LoginRequest {
  /** 이메일 주소 */
  email: string;

  /** 비밀번호 */
  password: string;
}

/**
 * 회원가입 요청 인터페이스
 */
export interface SignupRequest {
  /** 이메일 주소 */
  email: string;

  /** 비밀번호 */
  password: string;

  /** 닉네임 */
  nickname: string;

  /** 성별 (선택적) */
  gender?: Gender;

  /** 연령대 (선택적) */
  ageGroup?: AgeGroup;
}
