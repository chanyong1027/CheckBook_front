/**
 * 인증 관리 커스텀 훅
 *
 * @description
 * - JWT 토큰 기반 인증 관리
 * - localStorage 기반 사용자 정보 저장
 * - 로그아웃은 클라이언트에서만 토큰 삭제 (서버 API 호출 없음)
 *
 * @example
 * const { user, signin, signout, isAuthenticated } = useAuth();
 */

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, signup } from '@/api/user';
import { setAuthToken, removeAuthToken, getAuthToken } from '@/api/index';
import { QUERY_KEYS } from '@/utils/constants';
import { useBookStateStore } from '@/store/useBookStateStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import type { User, LoginRequest, SignupRequest } from '@/types/user';

/**
 * localStorage 키 상수
 */
const STORAGE_KEYS = {
  USER: 'checkbook_user',
} as const;

/**
 * localStorage에서 사용자 정보 읽기
 */
const getUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!storedUser) return null;

    const user = JSON.parse(storedUser) as User;
    return user;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

/**
 * localStorage에 사용자 정보 저장
 */
const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
};

/**
 * localStorage에서 사용자 정보 삭제
 */
const removeUserFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error);
  }
};

/**
 * 인증 상태 관리 훅
 *
 * @returns 인증 관련 상태 및 함수
 *
 * @example
 * // 기본 사용
 * const { user, isAuthenticated, signin, signout } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <LoginPage />;
 * }
 *
 * @example
 * // 로그인
 * try {
 *   await signin({ email: 'user@example.com', password: 'pass123' });
 *   toast.success('로그인 성공!');
 * } catch (error) {
 *   toast.error(error.message);
 * }
 */
export const useAuth = () => {
  const queryClient = useQueryClient();

  // localStorage에서 초기 사용자 정보 읽기
  const [user, setUser] = React.useState<User | null>(() => {
    const token = getAuthToken();
    if (!token) {
      // 토큰이 없으면 사용자 데이터 초기화
      useBookStateStore.getState().clearBookStates();
      useLibraryStore.getState().clearLibraries();
      return null;
    }

    return getUserFromStorage();
  });

  // 로그인 뮤테이션
  const signinMutation = useMutation<
    { accessToken: string; refreshToken?: string; user: User },
    Error,
    LoginRequest
  >({
    mutationFn: login,
    onSuccess: (data) => {
      // 토큰 저장 (localStorage: 'checkbook_token')
      setAuthToken(data.accessToken);

      // 사용자 정보 저장 (localStorage: 'checkbook_user')
      saveUserToStorage(data.user);

      // 상태 업데이트
      setUser(data.user);

      // React Query 캐시 업데이트
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], data.user);
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      // 에러 발생 시 상태 초기화
      removeAuthToken();
      removeUserFromStorage();
      setUser(null);
    },
  });

  // 회원가입 뮤테이션
  const signupMutation = useMutation<User, Error, SignupRequest>({
    mutationFn: signup,
    onSuccess: (newUser) => {
      // 회원가입 후 자동 로그인은 하지 않음
      // 사용자가 직접 로그인 페이지에서 로그인하도록 유도
      console.log('회원가입 성공:', newUser);
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
    },
  });

  /**
   * 로그아웃 (클라이언트 전용 - 서버 API 호출 없음)
   *
   * @description
   * - localStorage에서 토큰 삭제
   * - localStorage에서 사용자 정보 삭제
   * - React Query 캐시 초기화
   * - 로컬 상태 초기화
   * - Zustand 스토어 초기화 (찜하기, 도서관 등)
   */
  const signout = React.useCallback(() => {
    try {
      // 1. 토큰 제거
      removeAuthToken();

      // 2. 사용자 정보 제거
      removeUserFromStorage();

      // 3. 로컬 상태 초기화
      setUser(null);

      // 4. React Query 캐시 무효화
      queryClient.clear();
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], null);

      // 5. Zustand 스토어 초기화
      useBookStateStore.getState().clearBookStates();
      useLibraryStore.getState().clearLibraries();

      console.log('로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  }, [queryClient]);

  return {
    // 상태
    /** 현재 로그인한 사용자 정보 (없으면 null) */
    user,

    /** 인증 여부 */
    isAuthenticated: !!user && !!getAuthToken(),

    /** 로딩 중 여부 */
    isLoading: false, // localStorage 기반이므로 즉시 로드

    /** 에러 발생 여부 */
    isError: false,

    /** 에러 객체 */
    error: null,

    // 함수
    /**
     * 로그인
     * @param credentials - 이메일 및 비밀번호
     */
    signin: (credentials: LoginRequest) => signinMutation.mutateAsync(credentials),

    /**
     * 회원가입
     * @param userData - 회원가입 정보
     */
    signup: (userData: SignupRequest) => signupMutation.mutateAsync(userData),

    /**
     * 로그아웃 (클라이언트 전용)
     */
    signout,

    /**
     * 사용자 정보 다시 가져오기
     * (localStorage 기반이므로 즉시 반영)
     */
    refetch: () => {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        return;
      }

      const storedUser = getUserFromStorage();
      setUser(storedUser);
    },

    // 뮤테이션 상태
    /** 로그인 중 여부 */
    isSigningIn: signinMutation.isPending,

    /** 회원가입 중 여부 */
    isSigningUp: signupMutation.isPending,

    /** 로그아웃 중 여부 */
    isSigningOut: false, // 클라이언트 전용이므로 즉시 완료
  };
};

/**
 * 인증 필수 체크 훅
 *
 * @description
 * - 인증되지 않은 경우 로그인 페이지로 리다이렉트
 * - 보호된 페이지에서 사용
 *
 * @param redirectTo - 로그인 후 돌아올 URL (선택적)
 * @returns 사용자 정보 (인증된 경우에만)
 *
 * @example
 * function ProtectedPage() {
 *   const user = useRequireAuth('/protected-page');
 *
 *   if (!user) {
 *     return <div>로그인이 필요합니다...</div>;
 *   }
 *
 *   return <div>안녕하세요, {user.nickname}님!</div>;
 * }
 */
export const useRequireAuth = (redirectTo?: string): User | null => {
  const { user, isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 실제로는 React Router의 navigate를 사용해야 함
      const loginUrl = redirectTo
        ? `/signin?redirect=${encodeURIComponent(redirectTo)}`
        : '/signin';

      // 여기서는 경고만 출력 (실제 구현 시 navigate 사용)
      console.warn(`Not authenticated. Should redirect to: ${loginUrl}`);
    }
  }, [isLoading, isAuthenticated, redirectTo]);

  return user;
};

/**
 * 로그인 여부 체크 훅 (간단한 버전)
 *
 * @returns 로그인 여부
 *
 * @example
 * const isLoggedIn = useIsAuthenticated();
 *
 * return (
 *   <Header>
 *     {isLoggedIn ? <UserMenu /> : <LoginButton />}
 *   </Header>
 * );
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};
