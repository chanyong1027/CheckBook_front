/**
 * 도서관 관련 타입 정의
 */

/**
 * 도서관 정보 인터페이스
 * @description 지역 도서관 정보 및 사용자 위치 기반 거리 정보
 */
export interface Library {
  /** 도서관 고유 ID */
  id: string;

  /** 도서관 명칭 */
  name: string;

  /** 도서관 주소 */
  address: string;

  /** 도서관 전화번호 (선택적) */
  phone?: string;

  /** 도서관 홈페이지 URL (선택적) */
  homepage?: string;

  /** 사용자 위치로부터의 거리 (km, 선택적) */
  distanceKm?: number;

  /** 특정 도서의 대출 가능 여부 (선택적) */
  available?: boolean;

  /** 위도 (선택적) */
  latitude?: number;

  /** 경도 (선택적) */
  longitude?: number;

  /** 운영 시간 (선택적) */
  openingHours?: string;

  /** 휴관일 정보 (선택적) */
  closedDays?: string;

  /** 도서관 유형 (선택적, 예: 공공, 대학, 전문 등) */
  type?: string;
}

/**
 * 도서관 검색 필터 인터페이스
 */
export interface LibrarySearchFilter {
  /** 검색 키워드 (도서관명) */
  keyword?: string;

  /** 시/도 코드 */
  regionCode?: string;

  /** 시/군/구 코드 */
  districtCode?: string;

  /** 사용자 위치 (위도) */
  userLatitude?: number;

  /** 사용자 위치 (경도) */
  userLongitude?: number;

  /** 검색 반경 (km) */
  radiusKm?: number;
}

/**
 * 지역 정보 인터페이스
 */
export interface Region {
  /** 지역 코드 */
  code: string;

  /** 지역명 */
  name: string;

  /** 상위 지역 코드 (선택적, 시/군/구의 경우 시/도 코드) */
  parentCode?: string;
}
