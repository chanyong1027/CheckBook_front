/**
 * 범용 헬퍼 함수 모음
 */

/**
 * 함수 실행을 지연시키는 디바운스 유틸리티
 *
 * @template T - 디바운스할 함수의 타입
 * @param func - 디바운스할 함수
 * @param wait - 대기 시간 (밀리초)
 * @returns 디바운스된 함수
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * debouncedSearch('React'); // 300ms 후 실행
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 지정된 시간만큼 대기하는 Promise 기반 sleep 함수
 *
 * @param ms - 대기할 시간 (밀리초)
 * @returns Promise
 *
 * @example
 * await sleep(1000); // 1초 대기
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Tailwind CSS 클래스명을 조건부로 결합하는 유틸리티 함수
 *
 * @param classes - 결합할 클래스명들 (falsy 값은 무시됨)
 * @returns 결합된 클래스명 문자열
 *
 * @example
 * cn('btn', isActive && 'active', error && 'error')
 * // 결과: 'btn active' (isActive가 true이고 error가 falsy일 때)
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 배열을 섞는 함수 (Fisher-Yates shuffle)
 *
 * @template T - 배열 요소의 타입
 * @param array - 섞을 배열
 * @returns 섞인 새 배열
 *
 * @example
 * const shuffled = shuffle([1, 2, 3, 4, 5]);
 */
export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * 값이 정의되어 있는지 확인 (null, undefined가 아닌지)
 *
 * @template T - 값의 타입
 * @param value - 확인할 값
 * @returns 값이 정의되어 있으면 true
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * 숫자를 특정 범위로 제한하는 함수
 *
 * @param value - 제한할 값
 * @param min - 최소값
 * @param max - 최대값
 * @returns 범위 내로 제한된 값
 *
 * @example
 * clamp(15, 0, 10) // 10
 * clamp(-5, 0, 10) // 0
 * clamp(5, 0, 10)  // 5
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
