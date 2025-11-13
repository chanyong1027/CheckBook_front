/**
 * 사용자 위치 정보 조회 커스텀 훅
 *
 * @description
 * - 브라우저 Geolocation API 사용
 * - 위치 권한 요청
 * - 위도/경도 반환
 *
 * @example
 * const { latitude, longitude, isLoading, error } = useGeolocation();
 */

import * as React from 'react';

interface GeolocationState {
  /** 위도 */
  latitude: number | null;
  /** 경도 */
  longitude: number | null;
  /** 로딩 중 여부 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * 사용자 위치 정보 조회 훅
 *
 * @returns 위치 정보 및 상태
 *
 * @example
 * const { latitude, longitude, isLoading, error } = useGeolocation();
 *
 * if (isLoading) return <div>위치 정보를 가져오는 중...</div>;
 * if (error) return <div>위치 정보를 가져올 수 없습니다: {error}</div>;
 * if (latitude && longitude) {
 *   console.log(`현재 위치: ${latitude}, ${longitude}`);
 * }
 */
export const useGeolocation = () => {
  const [state, setState] = React.useState<GeolocationState>({
    latitude: null,
    longitude: null,
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    // Geolocation API 지원 여부 확인
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        isLoading: false,
        error: '브라우저가 위치 정보를 지원하지 않습니다.',
      });
      return;
    }

    // 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근 권한이 거부되었습니다.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
        }

        setState({
          latitude: null,
          longitude: null,
          isLoading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true, // 고정밀도 위치 사용
        timeout: 10000, // 10초 타임아웃
        maximumAge: 5 * 60 * 1000, // 5분 동안 캐시된 위치 사용
      }
    );
  }, []);

  return state;
};
