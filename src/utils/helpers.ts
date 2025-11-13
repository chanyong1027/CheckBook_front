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

/**
 * Gender enum 값을 한글로 변환
 *
 * @param gender - Gender enum 값 (MALE, FEMALE)
 * @returns 한글 성별 문자열
 *
 * @example
 * getGenderDisplayName('MALE') // '남자'
 * getGenderDisplayName('FEMALE') // '여자'
 */
export const getGenderDisplayName = (gender?: string): string => {
  switch (gender) {
    case 'MALE':
      return '남자';
    case 'FEMALE':
      return '여자';
    default:
      return '-';
  }
};

/**
 * AgeGroup enum 값을 한글로 변환
 *
 * @param ageGroup - AgeGroup enum 값 (TEENS, TWENTIES, etc.)
 * @returns 한글 연령대 문자열
 *
 * @example
 * getAgeGroupDisplayName('TWENTIES') // '20대'
 * getAgeGroupDisplayName('SIXTIES_PLUS') // '60대 이상'
 */
export const getAgeGroupDisplayName = (ageGroup?: string): string => {
  switch (ageGroup) {
    case 'TEENS':
      return '10대';
    case 'TWENTIES':
      return '20대';
    case 'THIRTIES':
      return '30대';
    case 'FORTIES':
      return '40대';
    case 'FIFTIES':
      return '50대';
    case 'SIXTIES_PLUS':
      return '60대 이상';
    default:
      return '-';
  }
};

/**
 * 두 지점 간의 거리 계산 (Haversine formula)
 *
 * @param lat1 - 지점 1 위도
 * @param lon1 - 지점 1 경도
 * @param lat2 - 지점 2 위도
 * @param lon2 - 지점 2 경도
 * @returns 거리 (km)
 *
 * @example
 * const distance = calculateDistance(37.5665, 126.9780, 37.5651, 126.9895);
 * console.log(`거리: ${distance.toFixed(2)}km`);
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * 각도를 라디안으로 변환
 */
const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};
