/**
 * 사용자 도서관 관리 커스텀 훅
 *
 * @description
 * - Zustand 스토어와 React Query를 결합한 통합 훅
 * - 로컬 상태와 서버 동기화 자동 처리
 * - 낙관적 업데이트(Optimistic Update) 지원
 * - 에러 발생 시 자동 롤백
 *
 * @example
 * const { myLibraries, addLibrary, isAdding } = useUserLibrary();
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLibraryStore } from '@/store/useLibraryStore';
import {
  fetchUserLibraries,
  addUserLibrary,
  removeUserLibrary,
  reorderUserLibraries,
} from '@/api/libraries';
import { QUERY_KEYS } from '@/utils/constants';
import type { Library } from '@/types/library';

/**
 * 사용자 도서관 관리 훅
 *
 * @returns 도서관 관리 기능 및 상태
 *
 * @example
 * // 기본 사용
 * const { myLibraries, addLibrary, removeLibrary } = useUserLibrary();
 *
 * @example
 * // 도서관 추가
 * try {
 *   await addLibrary(newLibrary);
 *   toast.success('도서관이 추가되었습니다');
 * } catch (error) {
 *   toast.error(error.message);
 * }
 *
 * @example
 * // 순서 변경 (드래그 앤 드롭)
 * const handleReorder = async (reorderedLibraries) => {
 *   await reorderLibraries(reorderedLibraries);
 * };
 */
export const useUserLibrary = () => {
  const queryClient = useQueryClient();

  // Zustand 스토어에서 상태 가져오기
  const {
    myLibraries,
    addLibrary: addLibraryToStore,
    removeLibrary: removeLibraryFromStore,
    reorderLibraries: reorderLibrariesInStore,
    setLibraries: setLibrariesInStore,
    hasLibrary,
  } = useLibraryStore();

  // 서버에서 도서관 목록 조회
  const {
    data: serverLibraries,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Library[], Error>({
    queryKey: [QUERY_KEYS.USER_LIBRARIES],
    queryFn: fetchUserLibraries,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분

    // 초기 로드 시에만 자동 실행
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 서버 데이터를 받아오면 Zustand 스토어에 동기화
  React.useEffect(() => {
    if (serverLibraries) {
      setLibrariesInStore(serverLibraries);
    }
  }, [serverLibraries, setLibrariesInStore]);

  // 도서관 추가 뮤테이션
  const addMutation = useMutation<Library[], Error, Library, { previousLibraries?: Library[] }>({
    mutationFn: (library: Library) => addUserLibrary(library.id),

    // 낙관적 업데이트
    onMutate: async (library) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER_LIBRARIES] });

      // 이전 상태 스냅샷
      const previousLibraries = queryClient.getQueryData<Library[]>([QUERY_KEYS.USER_LIBRARIES]);

      // 낙관적으로 Zustand 스토어 업데이트
      try {
        addLibraryToStore(library);
      } catch (error) {
        throw error; // 최대 개수 초과 등의 에러
      }

      // 낙관적으로 쿼리 캐시 업데이트
      queryClient.setQueryData<Library[]>([QUERY_KEYS.USER_LIBRARIES], (old = []) => [
        ...old,
        library,
      ]);

      // 롤백을 위해 이전 상태 반환
      return { previousLibraries };
    },

    // 에러 발생 시 롤백
    onError: (_error, _library, context) => {
      if (context?.previousLibraries) {
        queryClient.setQueryData([QUERY_KEYS.USER_LIBRARIES], context.previousLibraries);
        setLibrariesInStore(context.previousLibraries);
      }
    },

    // 성공 또는 실패 후 서버 데이터 다시 가져오기
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LIBRARIES] });
    },
  });

  // 도서관 제거 뮤테이션
  const removeMutation = useMutation<Library[], Error, string, { previousLibraries?: Library[] }>({
    mutationFn: (libraryId: string) => removeUserLibrary(libraryId),

    // 낙관적 업데이트
    onMutate: async (libraryId) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER_LIBRARIES] });

      const previousLibraries = queryClient.getQueryData<Library[]>([QUERY_KEYS.USER_LIBRARIES]);

      // Zustand 스토어에서 제거
      removeLibraryFromStore(libraryId);

      // 쿼리 캐시에서 제거
      queryClient.setQueryData<Library[]>([QUERY_KEYS.USER_LIBRARIES], (old = []) =>
        old.filter((lib) => lib.id !== libraryId)
      );

      return { previousLibraries };
    },

    onError: (_error, _libraryId, context) => {
      if (context?.previousLibraries) {
        queryClient.setQueryData([QUERY_KEYS.USER_LIBRARIES], context.previousLibraries);
        setLibrariesInStore(context.previousLibraries);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LIBRARIES] });
    },
  });

  // 도서관 순서 변경 뮤테이션
  const reorderMutation = useMutation<Library[], Error, Library[], { previousLibraries?: Library[] }>({
    mutationFn: (libraries: Library[]) => {
      const libraryIds = libraries.map((lib) => lib.id);
      return reorderUserLibraries(libraryIds);
    },

    // 낙관적 업데이트
    onMutate: async (libraries) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER_LIBRARIES] });

      const previousLibraries = queryClient.getQueryData<Library[]>([QUERY_KEYS.USER_LIBRARIES]);

      // Zustand 스토어 업데이트
      reorderLibrariesInStore(libraries);

      // 쿼리 캐시 업데이트
      queryClient.setQueryData([QUERY_KEYS.USER_LIBRARIES], libraries);

      return { previousLibraries };
    },

    onError: (_error, _libraries, context) => {
      if (context?.previousLibraries) {
        queryClient.setQueryData([QUERY_KEYS.USER_LIBRARIES], context.previousLibraries);
        setLibrariesInStore(context.previousLibraries);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LIBRARIES] });
    },
  });

  return {
    // 상태
    /** 내 도서관 목록 (Zustand 스토어) */
    myLibraries,

    /** 서버 도서관 목록 */
    serverLibraries,

    /** 로딩 중 여부 */
    isLoading,

    /** 에러 발생 여부 */
    isError,

    /** 에러 객체 */
    error,

    // 조회 함수
    /** 도서관 등록 여부 확인 */
    hasLibrary,

    /** 서버에서 다시 가져오기 */
    refetch,

    // 변경 함수
    /**
     * 도서관 추가
     * @throws {Error} 최대 개수 초과 또는 이미 등록된 도서관
     */
    addLibrary: (library: Library) => addMutation.mutateAsync(library),

    /** 도서관 제거 */
    removeLibrary: (libraryId: string) => removeMutation.mutateAsync(libraryId),

    /** 도서관 순서 변경 */
    reorderLibraries: (libraries: Library[]) => reorderMutation.mutateAsync(libraries),

    // 뮤테이션 상태
    /** 추가 중 여부 */
    isAdding: addMutation.isPending,

    /** 제거 중 여부 */
    isRemoving: removeMutation.isPending,

    /** 순서 변경 중 여부 */
    isReordering: reorderMutation.isPending,

    /** 변경 작업 진행 중 여부 */
    isMutating: addMutation.isPending || removeMutation.isPending || reorderMutation.isPending,
  };
};

/**
 * 특정 도서관의 등록 여부 확인 훅
 *
 * @param libraryId - 도서관 ID
 * @returns 등록 여부
 *
 * @example
 * const isRegistered = useIsLibraryRegistered('library-123');
 *
 * return (
 *   <Button disabled={isRegistered}>
 *     {isRegistered ? '등록됨' : '등록하기'}
 *   </Button>
 * );
 */
export const useIsLibraryRegistered = (libraryId: string): boolean => {
  return useLibraryStore((state) => state.hasLibrary(libraryId));
};

/**
 * 도서관 추가 가능 여부 확인 훅
 *
 * @returns 추가 가능 여부
 *
 * @example
 * const canAdd = useCanAddLibrary();
 *
 * if (!canAdd) {
 *   toast.error('최대 3개까지만 등록할 수 있습니다');
 * }
 */
export const useCanAddLibrary = (): boolean => {
  const myLibraries = useLibraryStore((state) => state.myLibraries);
  return myLibraries.length < 3;
};
