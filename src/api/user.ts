/**
 * 사용자 관련 API
 *
 * @description
 * - 사용자 프로필 관리
 * - 독서 상태 관리 (찜, 읽는 중, 완독)
 * - 인증 관련 API
 */

import { api } from './index';
import {
  User,
  UserBookState,
  UserReadingStats,
  LoginRequest,
  SignupRequest,
  ReadingState,
} from '@/types/user';
import { API_PATHS } from '@/utils/constants';

// ==================== 인증 API ====================

/**
 * 로그인
 *
 * @param credentials - 이메일 및 비밀번호
 * @returns 인증 토큰 및 사용자 정보
 *
 * @example
 * const { accessToken, user } = await login({
 *   userEmail: 'user@example.com',
 *   userPw: 'password123'
 * });
 */
export const login = async (
  credentials: LoginRequest
): Promise<{ accessToken: string; refreshToken?: string; user: User }> => {
  const response = await api.post<{ accessToken: string; refreshToken?: string; userId: number; userNm: string; userEmail: string }>(
    '/api/users/login',
    credentials
  );

  // 백엔드 응답을 프론트엔드 User 타입으로 변환
  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: {
      id: String(response.data.userId),
      email: response.data.userEmail,
      nickname: response.data.userNm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

/**
 * 회원가입
 *
 * @param userData - 회원가입 정보
 * @returns 생성된 사용자 정보
 *
 * @example
 * const user = await signup({
 *   userEmail: 'newuser@example.com',
 *   userPw: 'securepass123',
 *   userNm: '책읽는사람'
 * });
 */
export const signup = async (userData: SignupRequest): Promise<User> => {
  const response = await api.post<{ userId: number; userNm: string; userEmail: string }>(
    '/api/users/register',
    userData
  );

  // 백엔드 응답을 프론트엔드 User 타입으로 변환
  return {
    id: String(response.data.userId),
    email: response.data.userEmail,
    nickname: response.data.userNm,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * 로그아웃
 *
 * @example
 * await logout();
 */
export const logout = async (): Promise<void> => {
  await api.post('/api/users/logout');
};

/**
 * 토큰 갱신
 *
 * @param refreshToken - 리프레시 토큰
 * @returns 새로운 액세스 토큰
 *
 * @example
 * const { accessToken } = await refreshToken(oldRefreshToken);
 */
export const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string }> => {
  const response = await api.post<{ accessToken: string; refreshToken: string }>(
    '/api/users/refresh',
    { refreshToken }
  );
  return response.data;
};

// ==================== 사용자 프로필 API ====================

/**
 * 사용자 프로필 조회
 *
 * @returns 현재 로그인한 사용자 정보
 *
 * @example
 * const user = await fetchUserProfile();
 * console.log(user.nickname, user.email);
 */
export const fetchUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('/api/me');
  return response.data;
};

/**
 * 사용자 프로필 수정
 *
 * @param updates - 수정할 정보 (닉네임, 프로필 이미지 등)
 * @returns 업데이트된 사용자 정보
 *
 * @example
 * const updated = await updateUserProfile({ nickname: '새닉네임' });
 */
export const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/api/me', updates);
  return response.data;
};

/**
 * 회원 탈퇴
 *
 * @example
 * await deleteAccount();
 */
export const deleteAccount = async (): Promise<void> => {
  await api.delete('/api/me');
};

// ==================== 독서 상태 API ====================

/**
 * 프론트엔드 ReadingState를 백엔드 ReadStatus로 변환
 */
const mapToBackendStatus = (state: ReadingState): string => {
  const mapping = {
    WISHLIST: 'Wish',
    READING: 'Reading',
    READ: 'Completed',
  };
  return mapping[state] || state;
};

/**
 * 백엔드 ReadStatus를 프론트엔드 ReadingState로 변환
 */
const mapToFrontendState = (status: string): ReadingState => {
  const mapping: Record<string, ReadingState> = {
    Wish: 'WISHLIST',
    Reading: 'READING',
    Completed: 'READ',
  };

  if (!status || !mapping[status]) {
    throw new Error(`Unknown reading status: ${status}`);
  }

  return mapping[status];
};

/**
 * 사용자의 모든 독서 상태 조회
 *
 * @param state - 필터링할 상태 (선택적)
 * @returns 독서 상태 목록
 *
 * @example
 * // 모든 독서 상태
 * const allStates = await fetchUserBookStates();
 *
 * @example
 * // 완독한 책만
 * const readBooks = await fetchUserBookStates('READ');
 */
export const fetchUserBookStates = async (
  state?: ReadingState
): Promise<UserBookState[]> => {
  const backendStatus = state ? mapToBackendStatus(state) : undefined;
  const response = await api.get<any[]>(API_PATHS.USER_BOOK_RECORDS, {
    params: backendStatus ? { status: backendStatus } : undefined,
  });

  // 백엔드 BookRecordResponseDto를 프론트엔드 UserBookState로 변환
  return response.data.map((item: any) => ({
    bookId: item.book?.isbn13 || item.book?.isbn || '',
    state: mapToFrontendState(item.readStatus),
    rating: item.rating,
    comment: item.review,
    startDate: item.startDate,
    endDate: item.endDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    recordId: item.id, // 리뷰 수정/삭제 시 필요
    // 추가 책 정보
    bookTitle: item.book?.title,
    bookAuthor: item.book?.author,
    bookCover: item.book?.bookImg, // 백엔드 필드명: bookImg
  }));
};

/**
 * 특정 도서의 독서 상태 조회
 *
 * @param isbn - 도서 ISBN-13
 * @returns 해당 도서의 독서 상태 (없으면 null)
 *
 * @example
 * const state = await fetchUserBookState('9788937460890');
 * if (state) {
 *   console.log(`상태: ${state.state}, 별점: ${state.rating}`);
 * }
 */
export const fetchUserBookState = async (isbn: string): Promise<UserBookState | null> => {
  try {
    const response = await api.get<any>(API_PATHS.USER_BOOK_STATE(isbn));

    // readStatus가 없으면 null 반환 (데이터 없음)
    if (!response.data || !response.data.readStatus) {
      return null;
    }

    // 백엔드 BookRecordResponseDto를 프론트엔드 UserBookState로 변환
    return {
      bookId: response.data.book?.isbn13 || response.data.book?.isbn || isbn,
      state: mapToFrontendState(response.data.readStatus),
      rating: response.data.rating,
      comment: response.data.review,
      startDate: response.data.startDate,
      endDate: response.data.endDate,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
      // 추가 정보
      recordId: response.data.id, // 수정/삭제 시 필요
      bookTitle: response.data.book?.title,
      bookAuthor: response.data.book?.author,
      bookCover: response.data.book?.cover,
    };
  } catch (error: any) {
    // 404는 상태가 없는 것으로 처리
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * 독서 상태 생성 (책을 서재에 추가)
 *
 * @param isbn - 도서 ISBN-13
 * @returns 생성된 독서 상태
 *
 * @example
 * const state = await createUserBookState('9788937460890');
 */
export const createUserBookState = async (isbn: string): Promise<UserBookState> => {
  const response = await api.post<any>(API_PATHS.CREATE_BOOK_RECORD, {
    isbn,
  });

  // 백엔드 BookRecordResponseDto를 프론트엔드 UserBookState로 변환
  return {
    bookId: response.data.book?.isbn13 || response.data.book?.isbn || isbn,
    state: mapToFrontendState(response.data.readStatus),
    rating: response.data.rating,
    comment: response.data.review,
    startDate: response.data.startDate,
    endDate: response.data.endDate,
    createdAt: response.data.createdAt,
    updatedAt: response.data.updatedAt,
    recordId: response.data.id,
    bookTitle: response.data.book?.title,
    bookAuthor: response.data.book?.author,
    bookCover: response.data.book?.cover,
  };
};

/**
 * 독서 상태 수정 (상태 및 날짜 변경)
 *
 * @param recordId - 기록 ID
 * @param state - 새로운 독서 상태
 * @param startDate - 시작 날짜 (선택적)
 * @param endDate - 종료 날짜 (선택적)
 * @returns 업데이트된 독서 상태
 *
 * @example
 * const state = await updateUserBookState(123, 'READ', '2024-01-01', '2024-01-15');
 */
export const updateUserBookState = async (
  recordId: number,
  state: ReadingState,
  startDate?: string,
  endDate?: string
): Promise<UserBookState> => {
  const response = await api.patch<any>(API_PATHS.UPDATE_BOOK_RECORD(recordId), {
    readStatus: mapToBackendStatus(state),
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // 백엔드 BookRecordResponseDto를 프론트엔드 UserBookState로 변환
  return {
    bookId: response.data.book?.isbn13 || response.data.book?.isbn || '',
    state: mapToFrontendState(response.data.readStatus),
    rating: response.data.rating,
    comment: response.data.review,
    startDate: response.data.startDate,
    endDate: response.data.endDate,
    createdAt: response.data.createdAt,
    updatedAt: response.data.updatedAt,
    recordId: response.data.id,
    bookTitle: response.data.book?.title,
    bookAuthor: response.data.book?.author,
    bookCover: response.data.book?.cover,
  };
};

/**
 * 독서 기록의 리뷰 및 평점 업데이트
 *
 * @param recordId - 기록 ID
 * @param review - 리뷰 내용
 * @param rating - 평점 (0-5)
 * @returns 업데이트된 독서 상태
 *
 * @example
 * const state = await updateBookReview(123, '정말 재미있게 읽었습니다!', 5);
 */
export const updateBookReview = async (
  recordId: number,
  review?: string,
  rating?: number
): Promise<UserBookState> => {
  const response = await api.put<any>(API_PATHS.UPDATE_BOOK_REVIEW(recordId), {
    review,
    rating,
  });

  // 백엔드 BookRecordResponseDto를 프론트엔드 UserBookState로 변환
  return {
    bookId: response.data.book?.isbn13 || response.data.book?.isbn || '',
    state: mapToFrontendState(response.data.readStatus),
    rating: response.data.rating,
    comment: response.data.review,
    startDate: response.data.startDate,
    endDate: response.data.endDate,
    createdAt: response.data.createdAt,
    updatedAt: response.data.updatedAt,
    recordId: response.data.id,
    bookTitle: response.data.book?.title,
    bookAuthor: response.data.book?.author,
    bookCover: response.data.book?.cover,
  };
};

/**
 * 독서 상태 삭제
 *
 * @param recordId - 기록 ID
 *
 * @example
 * await deleteUserBookState(123);
 */
export const deleteUserBookState = async (recordId: number): Promise<void> => {
  await api.delete(API_PATHS.DELETE_BOOK_RECORD(recordId));
};

// ==================== 독서 통계 API ====================

/**
 * 사용자 독서 통계 조회
 *
 * @returns 독서 통계 (완독 수, 평균 별점 등)
 *
 * @example
 * const stats = await fetchUserReadingStats();
 * console.log(`완독: ${stats.readCount}권`);
 * console.log(`평균 별점: ${stats.averageRating}점`);
 */
export const fetchUserReadingStats = async (): Promise<UserReadingStats> => {
  const response = await api.get<UserReadingStats>('/api/me/stats');
  return response.data;
};

/**
 * 월별 독서 기록 조회
 *
 * @param year - 연도
 * @param month - 월 (1-12)
 * @returns 해당 월의 독서 상태 목록
 *
 * @example
 * const marchBooks = await fetchMonthlyReadingRecords(2024, 3);
 */
export const fetchMonthlyReadingRecords = async (
  year: number,
  month: number
): Promise<UserBookState[]> => {
  const response = await api.get<UserBookState[]>('/api/me/books/monthly', {
    params: { year, month },
  });
  return response.data;
};
