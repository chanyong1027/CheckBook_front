/**
 * 독서 상태 관리 Zustand Store
 *
 * @description
 * - 사용자의 도서별 독서 상태 관리 (찜, 읽는 중, 완독)
 * - 로컬 상태로 관리하며, 서버 동기화는 API를 통해 수행
 * - 동일 bookId는 자동으로 덮어쓰기 (업데이트)
 * - 불변성 기반 업데이트로 React 리렌더링 보장
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserBookState, ReadingState } from '@/types/user';

/**
 * BookStateStore 상태 인터페이스
 */
interface BookStateStore {
  /** 사용자의 도서별 독서 상태 목록 */
  userBookStates: UserBookState[];

  /**
   * 독서 상태 설정 (생성 또는 업데이트)
   * - 동일한 bookId가 있으면 덮어쓰기
   * - 없으면 새로 추가
   *
   * @param bookState - 설정할 독서 상태
   */
  setBookState: (bookState: UserBookState) => void;

  /**
   * 독서 상태 제거
   * @param bookId - 도서 ID
   */
  removeBookState: (bookId: string) => void;

  /**
   * 특정 도서의 독서 상태 조회
   * @param bookId - 도서 ID
   * @returns 독서 상태 (없으면 null)
   */
  getBookState: (bookId: string) => UserBookState | null;

  /**
   * 특정 상태의 도서 목록 조회
   * @param state - 독서 상태 (찜, 읽는 중, 완독)
   * @returns 해당 상태의 도서 목록
   */
  getBooksByState: (state: ReadingState) => UserBookState[];

  /**
   * 모든 독서 상태 제거 (초기화)
   */
  clearBookStates: () => void;

  /**
   * 서버에서 가져온 데이터로 덮어쓰기
   * @param bookStates - 서버에서 가져온 독서 상태 목록
   */
  setBookStates: (bookStates: UserBookState[]) => void;

  /**
   * 상태별 도서 수 조회
   */
  getStateCounts: () => {
    wishlist: number;
    reading: number;
    read: number;
  };
}

/**
 * 독서 상태 관리 Store
 *
 * @example
 * // 컴포넌트에서 사용
 * const { userBookStates, setBookState, removeBookState } = useBookStateStore();
 *
 * @example
 * // 독서 상태 설정
 * setBookState({
 *   bookId: 'book-123',
 *   state: 'READ',
 *   rating: 5,
 *   comment: '정말 재미있게 읽었습니다!',
 *   endDate: new Date().toISOString()
 * });
 */
export const useBookStateStore = create<BookStateStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        userBookStates: [],

        // 독서 상태 설정 (생성 또는 업데이트)
        setBookState: (bookState) => {
          set(
            (state) => {
              // 기존 상태에서 동일한 bookId 제거
              const filteredStates = state.userBookStates.filter(
                (item) => item.bookId !== bookState.bookId
              );

              // 새 상태 추가 (맨 앞에 추가 - 최신순 정렬)
              return {
                userBookStates: [bookState, ...filteredStates],
              };
            },
            false,
            'setBookState'
          );
        },

        // 독서 상태 제거
        removeBookState: (bookId) => {
          set(
            (state) => ({
              userBookStates: state.userBookStates.filter((item) => item.bookId !== bookId),
            }),
            false,
            'removeBookState'
          );
        },

        // 특정 도서의 독서 상태 조회
        getBookState: (bookId) => {
          return get().userBookStates.find((item) => item.bookId === bookId) || null;
        },

        // 특정 상태의 도서 목록 조회
        getBooksByState: (state) => {
          return get().userBookStates.filter((item) => item.state === state);
        },

        // 모든 독서 상태 제거
        clearBookStates: () => {
          set(
            {
              userBookStates: [],
            },
            false,
            'clearBookStates'
          );
        },

        // 서버 데이터로 덮어쓰기
        setBookStates: (bookStates) => {
          set(
            {
              userBookStates: bookStates,
            },
            false,
            'setBookStates'
          );
        },

        // 상태별 도서 수 조회
        getStateCounts: () => {
          const states = get().userBookStates;
          return {
            wishlist: states.filter((item) => item.state === 'WISHLIST').length,
            reading: states.filter((item) => item.state === 'READING').length,
            read: states.filter((item) => item.state === 'READ').length,
          };
        },
      }),
      {
        name: 'book-state-storage', // localStorage 키
        // 민감한 정보는 제외하고 저장
        partialize: (state) => ({
          userBookStates: state.userBookStates,
        }),
      }
    ),
    {
      name: 'BookStateStore', // DevTools에서 표시될 이름
    }
  )
);

/**
 * 선택자 (Selectors) - 성능 최적화
 */

/**
 * 특정 도서의 독서 상태 조회 (훅)
 */
export const useBookState = (bookId: string) =>
  useBookStateStore((state) => state.userBookStates.find((item) => item.bookId === bookId));

/**
 * 찜한 도서 목록
 */
export const useWishlistBooks = () =>
  useBookStateStore((state) => state.userBookStates.filter((item) => item.state === 'WISHLIST'));

/**
 * 읽는 중인 도서 목록
 */
export const useReadingBooks = () =>
  useBookStateStore((state) => state.userBookStates.filter((item) => item.state === 'READING'));

/**
 * 완독한 도서 목록
 */
export const useReadBooks = () =>
  useBookStateStore((state) => state.userBookStates.filter((item) => item.state === 'READ'));

/**
 * 상태별 도서 수
 */
export const useBookStateCounts = () =>
  useBookStateStore((state) => state.getStateCounts());

/**
 * 전체 독서 기록 수
 */
export const useTotalBookCount = () =>
  useBookStateStore((state) => state.userBookStates.length);

/**
 * 특정 도서의 독서 상태 존재 여부
 */
export const useHasBookState = (bookId: string) =>
  useBookStateStore((state) => state.userBookStates.some((item) => item.bookId === bookId));
