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
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 */
export const login = async (
  credentials: LoginRequest
): Promise<{ accessToken: string; refreshToken?: string; user: User }> => {
  const response = await api.post<{ accessToken: string; refreshToken?: string; user: User }>(
    '/api/auth/login',
    credentials
  );
  return response.data;
};

/**
 * 회원가입
 *
 * @param userData - 회원가입 정보
 * @returns 생성된 사용자 정보
 *
 * @example
 * const user = await signup({
 *   email: 'newuser@example.com',
 *   password: 'securepass123',
 *   nickname: '책읽는사람'
 * });
 */
export const signup = async (userData: SignupRequest): Promise<User> => {
  const response = await api.post<User>('/api/auth/signup', userData);
  return response.data;
};

/**
 * 로그아웃
 *
 * @example
 * await logout();
 */
export const logout = async (): Promise<void> => {
  await api.post('/api/auth/logout');
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
  const response = await api.post<{ accessToken: string }>('/api/auth/refresh', {
    refreshToken,
  });
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
  const response = await api.get<UserBookState[]>('/api/me/books', {
    params: state ? { state } : undefined,
  });
  return response.data;
};

/**
 * 특정 도서의 독서 상태 조회
 *
 * @param bookId - 도서 ID
 * @returns 해당 도서의 독서 상태 (없으면 null)
 *
 * @example
 * const state = await fetchUserBookState('book-123');
 * if (state) {
 *   console.log(`상태: ${state.state}, 별점: ${state.rating}`);
 * }
 */
export const fetchUserBookState = async (bookId: string): Promise<UserBookState | null> => {
  try {
    const response = await api.get<UserBookState>(API_PATHS.USER_BOOK_STATE(bookId));
    return response.data;
  } catch (error: any) {
    // 404는 상태가 없는 것으로 처리
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * 독서 상태 생성/수정
 *
 * @param bookId - 도서 ID
 * @param stateData - 독서 상태 정보
 * @returns 업데이트된 독서 상태
 *
 * @example
 * const state = await updateUserBookState('book-123', {
 *   state: 'READ',
 *   rating: 5,
 *   comment: '정말 재미있게 읽었습니다!',
 *   endDate: new Date().toISOString()
 * });
 */
export const updateUserBookState = async (
  bookId: string,
  stateData: Partial<Omit<UserBookState, 'bookId'>>
): Promise<UserBookState> => {
  const response = await api.put<UserBookState>(API_PATHS.USER_BOOK_STATE(bookId), stateData);
  return response.data;
};

/**
 * 독서 상태 삭제
 *
 * @param bookId - 도서 ID
 *
 * @example
 * await deleteUserBookState('book-123');
 */
export const deleteUserBookState = async (bookId: string): Promise<void> => {
  await api.delete(API_PATHS.USER_BOOK_STATE(bookId));
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
