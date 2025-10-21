/**
 * 내 도서관 관리 Zustand Store
 *
 * @description
 * - 사용자가 선택한 도서관 목록 관리 (최대 3개)
 * - 로컬 상태로 관리하며, 서버 동기화는 API를 통해 수행
 * - 불변성 기반 업데이트로 React 리렌더링 보장
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Library } from '@/types/library';
import { MAX_MY_LIBRARIES } from '@/utils/constants';

/**
 * LibraryStore 상태 인터페이스
 */
interface LibraryStore {
  /** 내 도서관 목록 (최대 3개) */
  myLibraries: Library[];

  /**
   * 도서관 추가
   * @param library - 추가할 도서관
   * @throws {Error} 최대 3개 제한 초과 시
   */
  addLibrary: (library: Library) => void;

  /**
   * 도서관 제거
   * @param id - 제거할 도서관 ID
   */
  removeLibrary: (id: string) => void;

  /**
   * 도서관 순서 변경
   * @param libraries - 새로운 순서의 도서관 배열
   */
  reorderLibraries: (libraries: Library[]) => void;

  /**
   * 특정 도서관이 등록되어 있는지 확인
   * @param id - 도서관 ID
   * @returns 등록 여부
   */
  hasLibrary: (id: string) => boolean;

  /**
   * 모든 도서관 제거 (초기화)
   */
  clearLibraries: () => void;

  /**
   * 서버에서 가져온 데이터로 덮어쓰기
   * @param libraries - 서버에서 가져온 도서관 목록
   */
  setLibraries: (libraries: Library[]) => void;
}

/**
 * 내 도서관 관리 Store
 *
 * @example
 * // 컴포넌트에서 사용
 * const { myLibraries, addLibrary, removeLibrary } = useLibraryStore();
 *
 * @example
 * // 도서관 추가
 * try {
 *   addLibrary(newLibrary);
 *   toast.success('도서관이 추가되었습니다');
 * } catch (error) {
 *   toast.error(error.message);
 * }
 */
export const useLibraryStore = create<LibraryStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        myLibraries: [],

        // 도서관 추가
        addLibrary: (library) => {
          const currentLibraries = get().myLibraries;

          // 이미 등록된 도서관인지 확인
          if (currentLibraries.some((lib) => lib.id === library.id)) {
            throw new Error('이미 등록된 도서관입니다');
          }

          // 최대 3개 제한 확인
          if (currentLibraries.length >= MAX_MY_LIBRARIES) {
            throw new Error(`최대 ${MAX_MY_LIBRARIES}개까지만 등록할 수 있습니다`);
          }

          // 불변성 유지하며 추가
          set(
            (state) => ({
              myLibraries: [...state.myLibraries, library],
            }),
            false,
            'addLibrary'
          );
        },

        // 도서관 제거
        removeLibrary: (id) => {
          set(
            (state) => ({
              myLibraries: state.myLibraries.filter((lib) => lib.id !== id),
            }),
            false,
            'removeLibrary'
          );
        },

        // 도서관 순서 변경 (드래그 앤 드롭)
        reorderLibraries: (libraries) => {
          // 최대 개수 제한 확인
          if (libraries.length > MAX_MY_LIBRARIES) {
            throw new Error(`최대 ${MAX_MY_LIBRARIES}개까지만 등록할 수 있습니다`);
          }

          set(
            {
              myLibraries: libraries,
            },
            false,
            'reorderLibraries'
          );
        },

        // 도서관 등록 여부 확인
        hasLibrary: (id) => {
          return get().myLibraries.some((lib) => lib.id === id);
        },

        // 모든 도서관 제거
        clearLibraries: () => {
          set(
            {
              myLibraries: [],
            },
            false,
            'clearLibraries'
          );
        },

        // 서버 데이터로 덮어쓰기
        setLibraries: (libraries) => {
          // 최대 3개만 유지
          const limitedLibraries = libraries.slice(0, MAX_MY_LIBRARIES);

          set(
            {
              myLibraries: limitedLibraries,
            },
            false,
            'setLibraries'
          );
        },
      }),
      {
        name: 'library-storage', // localStorage 키
        // 민감한 정보는 제외하고 저장
        partialize: (state) => ({
          myLibraries: state.myLibraries,
        }),
      }
    ),
    {
      name: 'LibraryStore', // DevTools에서 표시될 이름
    }
  )
);

/**
 * 선택자 (Selectors) - 성능 최적화
 */

/**
 * 내 도서관 개수 조회
 */
export const useLibraryCount = () => useLibraryStore((state) => state.myLibraries.length);

/**
 * 도서관 등록 여부 확인
 */
export const useHasLibrary = (id: string) =>
  useLibraryStore((state) => state.myLibraries.some((lib) => lib.id === id));

/**
 * 도서관 추가 가능 여부
 */
export const useCanAddLibrary = () =>
  useLibraryStore((state) => state.myLibraries.length < MAX_MY_LIBRARIES);
