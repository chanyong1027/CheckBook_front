/**
 * 사용자 독서 상태 관리 커스텀 훅
 *
 * @description
 * - Zustand 스토어와 React Query를 결합한 통합 훅
 * - 독서 상태 조회, 생성, 수정, 삭제
 * - 낙관적 업데이트 및 자동 동기화
 * - 찜/읽는 중/완독 상태별 필터링
 *
 * @example
 * const { bookState, updateState, removeState } = useUserBookState('book-123');
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBookStateStore } from '@/store/useBookStateStore';
import {
  fetchUserBookStates,
  fetchUserBookState,
  createUserBookState,
  updateUserBookState,
  deleteUserBookState,
} from '@/api/user';
import { QUERY_KEYS } from '@/utils/constants';
import type { UserBookState, ReadingState } from '@/types/user';

/**
 * 모든 독서 상태 조회 훅
 *
 * @param state - 필터링할 상태 (선택적)
 * @returns 독서 상태 목록 및 관리 함수
 *
 * @example
 * // 모든 독서 상태
 * const { bookStates, isLoading } = useUserBookStates();
 *
 * @example
 * // 완독한 책만
 * const { bookStates } = useUserBookStates('READ');
 */
export const useUserBookStates = (state?: ReadingState) => {
  const { setBookStates } = useBookStateStore();

  // 인증 토큰 확인
  const hasToken = !!localStorage.getItem('accessToken');

  const {
    data: bookStates,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserBookState[], Error>({
    queryKey: state ? [QUERY_KEYS.USER_BOOK_STATE, state] : [QUERY_KEYS.USER_BOOK_STATE],
    queryFn: () => fetchUserBookStates(state),
    enabled: hasToken, // 토큰이 있을 때만 활성화
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 서버 데이터를 받아오면 Zustand 스토어에 동기화
  React.useEffect(() => {
    if (bookStates) {
      setBookStates(bookStates);
    }
  }, [bookStates, setBookStates]);

  return {
    /** 독서 상태 목록 */
    bookStates: bookStates ?? [],

    /** 로딩 중 여부 */
    isLoading,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

    /** 서버에서 다시 가져오기 */
    refetch,

    /** 독서 상태가 비어있는지 여부 */
    isEmpty: !isLoading && (bookStates?.length ?? 0) === 0,
  };
};

/**
 * 특정 도서의 독서 상태 조회 및 관리 훅
 *
 * @param bookId - 도서 ID
 * @returns 독서 상태 및 관리 함수
 *
 * @example
 * const { bookState, updateState, removeState, isUpdating } = useUserBookState('book-123');
 *
 * // 찜하기
 * await updateState({ state: 'WISHLIST' });
 *
 * // 읽는 중으로 변경
 * await updateState({
 *   state: 'READING',
 *   startDate: new Date().toISOString()
 * });
 *
 * // 완독 + 별점/리뷰
 * await updateState({
 *   state: 'READ',
 *   rating: 5,
 *   comment: '정말 재미있게 읽었습니다!',
 *   endDate: new Date().toISOString()
 * });
 *
 * // 상태 제거
 * await removeState();
 */
export const useUserBookState = (bookId: string | undefined) => {
  const queryClient = useQueryClient();
  const {
    setBookState: setBookStateInStore,
    removeBookState: removeBookStateFromStore,
    getBookState,
  } = useBookStateStore();

  // 인증 토큰 확인
  const hasToken = !!localStorage.getItem('accessToken');

  // 서버에서 상태 조회
  const {
    data: bookState,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserBookState | null, Error>({
    queryKey: [QUERY_KEYS.USER_BOOK_STATE, bookId],
    queryFn: () => {
      if (!bookId) {
        throw new Error('Book ID is required');
      }
      return fetchUserBookState(bookId);
    },
    enabled: !!bookId && hasToken, // 토큰이 있을 때만 활성화
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 서버 데이터를 받아오면 Zustand 스토어에 동기화
  React.useEffect(() => {
    if (bookState && bookId) {
      setBookStateInStore(bookState);
    }
  }, [bookState, bookId, setBookStateInStore]);

  // 상태 업데이트 뮤테이션 (생성 또는 수정)
  const updateMutation = useMutation<
    UserBookState,
    Error,
    Partial<Omit<UserBookState, 'bookId'>>,
    { previousState?: UserBookState | null }
  >({
    mutationFn: async (stateData) => {
      if (!bookId) {
        throw new Error('Book ID is required');
      }

      // 기존 상태가 있으면 수정, 없으면 생성
      const existing = bookState || localState;

      if (existing && existing.recordId) {
        // 수정: recordId가 있으면 PATCH 요청
        if (stateData.state) {
          return updateUserBookState(existing.recordId, stateData.state);
        }
        throw new Error('State is required for update');
      } else {
        // 생성: POST 요청 (기본 상태는 Wish)
        return createUserBookState(bookId);
      }
    },

    // 낙관적 업데이트
    onMutate: async (stateData) => {
      if (!bookId) return {};

      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER_BOOK_STATE, bookId] });

      const previousState = queryClient.getQueryData<UserBookState | null>([
        QUERY_KEYS.USER_BOOK_STATE,
        bookId,
      ]);

      // 낙관적으로 업데이트
      const optimisticState: UserBookState = {
        bookId,
        state: stateData.state ?? previousState?.state ?? 'WISHLIST',
        rating: stateData.rating ?? previousState?.rating,
        comment: stateData.comment ?? previousState?.comment,
        startDate: stateData.startDate ?? previousState?.startDate,
        endDate: stateData.endDate ?? previousState?.endDate,
      };

      queryClient.setQueryData([QUERY_KEYS.USER_BOOK_STATE, bookId], optimisticState);
      setBookStateInStore(optimisticState);

      return { previousState };
    },

    // 에러 발생 시 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousState && bookId) {
        queryClient.setQueryData([QUERY_KEYS.USER_BOOK_STATE, bookId], context.previousState);
        if (context.previousState) {
          setBookStateInStore(context.previousState);
        } else {
          removeBookStateFromStore(bookId);
        }
      }
    },

    // 성공 또는 실패 후 서버 데이터 다시 가져오기
    onSettled: () => {
      if (bookId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BOOK_STATE, bookId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BOOK_STATE] });
      }
    },
  });

  // 상태 삭제 뮤테이션
  const removeMutation = useMutation<void, Error, void, { previousState?: UserBookState | null }>({
    mutationFn: () => {
      const existing = bookState || localState;
      if (!existing || !existing.recordId) {
        throw new Error('Record ID is required for deletion');
      }
      return deleteUserBookState(existing.recordId);
    },

    // 낙관적 업데이트
    onMutate: async () => {
      if (!bookId) return {};

      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER_BOOK_STATE, bookId] });

      const previousState = queryClient.getQueryData<UserBookState | null>([
        QUERY_KEYS.USER_BOOK_STATE,
        bookId,
      ]);

      // 낙관적으로 제거
      queryClient.setQueryData([QUERY_KEYS.USER_BOOK_STATE, bookId], null);
      removeBookStateFromStore(bookId);

      return { previousState };
    },

    // 에러 발생 시 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousState && bookId) {
        queryClient.setQueryData([QUERY_KEYS.USER_BOOK_STATE, bookId], context.previousState);
        setBookStateInStore(context.previousState);
      }
    },

    // 성공 또는 실패 후 서버 데이터 다시 가져오기
    onSettled: () => {
      if (bookId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BOOK_STATE, bookId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BOOK_STATE] });
      }
    },
  });

  // Zustand 스토어에서 현재 상태 가져오기 (실시간)
  const localState = bookId ? getBookState(bookId) : null;

  return {
    /** 독서 상태 (서버 데이터) */
    bookState: bookState ?? null,

    /** 독서 상태 (로컬 스토어, 실시간) */
    localState,

    /** 현재 독서 상태 (READ/READING/WISHLIST 또는 null) */
    currentState: bookState?.state ?? localState?.state ?? null,

    /** 독서 상태가 있는지 여부 */
    hasState: !!bookState || !!localState,

    /** 로딩 중 여부 */
    isLoading,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

    /** 서버에서 다시 가져오기 */
    refetch,

    /**
     * 독서 상태 업데이트
     * @param stateData - 업데이트할 상태 정보
     */
    updateState: (stateData: Partial<Omit<UserBookState, 'bookId'>>) =>
      updateMutation.mutateAsync(stateData),

    /**
     * 독서 상태 제거
     */
    removeState: () => removeMutation.mutateAsync(),

    /** 업데이트 중 여부 */
    isUpdating: updateMutation.isPending,

    /** 삭제 중 여부 */
    isRemoving: removeMutation.isPending,

    /** 변경 작업 진행 중 여부 */
    isMutating: updateMutation.isPending || removeMutation.isPending,
  };
};

/**
 * 상태별 독서 목록 조회 헬퍼 훅들
 */

/**
 * 찜한 책 목록 조회
 */
export const useWishlistBooks = () => {
  return useUserBookStates('WISHLIST');
};

/**
 * 읽는 중인 책 목록 조회
 */
export const useReadingBooks = () => {
  return useUserBookStates('READING');
};

/**
 * 완독한 책 목록 조회
 */
export const useReadBooks = () => {
  return useUserBookStates('READ');
};
