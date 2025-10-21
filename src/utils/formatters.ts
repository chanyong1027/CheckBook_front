/**
 * 날짜 및 거리 포맷팅 유틸리티 함수
 */

/**
 * ISO 8601 날짜 문자열을 한국어 형식으로 포맷팅
 *
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: "2024-03-15T10:30:00Z")
 * @param options - 포맷 옵션
 * @returns 포맷된 날짜 문자열
 *
 * @example
 * formatDate('2024-03-15T10:30:00Z') // '2024년 3월 15일'
 * formatDate('2024-03-15T10:30:00Z', { includeTime: true }) // '2024년 3월 15일 10:30'
 * formatDate('2024-03-15T10:30:00Z', { short: true }) // '2024.03.15'
 */
export const formatDate = (
  dateString: string,
  options?: {
    includeTime?: boolean;
    short?: boolean;
  }
): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 잘못된 날짜 처리
  if (isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 짧은 형식: 2024.03.15
  if (options?.short) {
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  }

  // 기본 형식: 2024년 3월 15일
  let formatted = `${year}년 ${month}월 ${day}일`;

  // 시간 포함: 2024년 3월 15일 10:30
  if (options?.includeTime) {
    formatted += ` ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  return formatted;
};

/**
 * 현재 시간으로부터의 상대적 시간을 한국어로 표현
 *
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 상대적 시간 표현 (예: "방금 전", "3분 전", "2일 전")
 *
 * @example
 * formatRelativeTime('2024-03-15T10:25:00Z') // 현재가 10:30이면 "5분 전"
 * formatRelativeTime('2024-03-14T10:30:00Z') // "1일 전"
 */
export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return '';
  }

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 30) return `${diffDays}일 전`;
  if (diffMonths < 12) return `${diffMonths}개월 전`;
  return `${diffYears}년 전`;
};

/**
 * 거리를 읽기 쉬운 형식으로 포맷팅
 *
 * @param distanceKm - 거리 (킬로미터)
 * @returns 포맷된 거리 문자열
 *
 * @example
 * formatDistance(0.5)   // '500m'
 * formatDistance(1.2)   // '1.2km'
 * formatDistance(15.7)  // '15.7km'
 * formatDistance(0.05)  // '50m'
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm === undefined || distanceKm === null) return '';

  // 1km 미만은 미터로 표시
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m`;
  }

  // 1km 이상은 소수점 1자리까지 표시
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * 숫자를 천 단위로 쉼표를 추가하여 포맷팅
 *
 * @param num - 포맷할 숫자
 * @returns 포맷된 숫자 문자열
 *
 * @example
 * formatNumber(1234567) // '1,234,567'
 * formatNumber(1000)    // '1,000'
 */
export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '';
  return num.toLocaleString('ko-KR');
};

/**
 * ISBN-13을 읽기 쉬운 형식으로 포맷팅
 *
 * @param isbn - ISBN-13 문자열 (13자리)
 * @returns 포맷된 ISBN 문자열
 *
 * @example
 * formatISBN('9788936434267') // '978-89-364-3426-7'
 */
export const formatISBN = (isbn: string): string => {
  if (!isbn || isbn.length !== 13) return isbn;

  // ISBN-13 형식: 978-89-364-3426-7
  return `${isbn.slice(0, 3)}-${isbn.slice(3, 5)}-${isbn.slice(5, 8)}-${isbn.slice(8, 12)}-${isbn.slice(12)}`;
};

/**
 * 별점을 이모지로 표현
 *
 * @param rating - 별점 (0-5)
 * @returns 별 이모지 문자열
 *
 * @example
 * formatRating(4.5) // '★★★★☆'
 * formatRating(3)   // '★★★☆☆'
 */
export const formatRating = (rating: number): string => {
  if (rating === undefined || rating === null || rating < 0 || rating > 5) {
    return '';
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};
