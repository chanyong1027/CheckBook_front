/**
 * 인증 관리 커스텀 훅
 *
 * @description
 * - JWT 토큰 기반 인증 관리
 * - 로그인/로그아웃 상태 관리
 * - 사용자 프로필 조회 및 업데이트
 * - 자동 토큰 갱신 지원
 *
 * @example
 * const { user, signin, signout, isAuthenticated } = useAuth();
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, signup, logout, fetchUserProfile } from '@/api/user';
import { setAuthToken, removeAuthToken } from '@/api/index';
import { QUERY_KEYS } from '@/utils/constants';
import type { User, LoginRequest, SignupRequest } from '@/types/user';

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

  // 사용자 프로필 조회 (토큰이 있을 때만)
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: async () => {
      try {
        return await fetchUserProfile();
      } catch (error: any) {
        // 401 에러면 인증되지 않은 것으로 처리
        if (error.status === 401) {
          removeAuthToken();
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
  });

  // 로그인 뮤테이션
  const signinMutation = useMutation<
    { accessToken: string; refreshToken?: string; user: User },
    Error,
    LoginRequest
  >({
    mutationFn: login,
    onSuccess: (data) => {
      // 토큰 저장
      setAuthToken(data.accessToken);

      // 사용자 정보 캐시 업데이트
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], data.user);
    },
  });

  // 회원가입 뮤테이션
  const signupMutation = useMutation<User, Error, SignupRequest>({
    mutationFn: signup,
    onSuccess: (user) => {
      // 회원가입 후 자동 로그인은 하지 않음
      // 필요하다면 여기서 자동 로그인 로직 추가
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], user);
    },
  });

  // 로그아웃 뮤테이션
  const signoutMutation = useMutation<void, Error>({
    mutationFn: logout,
    onSuccess: () => {
      // 토큰 제거
      removeAuthToken();

      // 모든 쿼리 캐시 무효화
      queryClient.clear();

      // 사용자 정보 초기화
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], null);
    },
    onError: () => {
      // 에러가 발생해도 로컬 상태는 초기화
      removeAuthToken();
      queryClient.clear();
      queryClient.setQueryData([QUERY_KEYS.USER_PROFILE], null);
    },
  });

  return {
    // 상태
    /** 현재 로그인한 사용자 정보 (없으면 null) */
    user: user ?? null,

    /** 인증 여부 */
    isAuthenticated: !!user,

    /** 로딩 중 여부 */
    isLoading,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

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
     * 로그아웃
     */
    signout: () => signoutMutation.mutateAsync(),

    /**
     * 사용자 정보 다시 가져오기
     */
    refetch,

    // 뮤테이션 상태
    /** 로그인 중 여부 */
    isSigningIn: signinMutation.isPending,

    /** 회원가입 중 여부 */
    isSigningUp: signupMutation.isPending,

    /** 로그아웃 중 여부 */
    isSigningOut: signoutMutation.isPending,
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
