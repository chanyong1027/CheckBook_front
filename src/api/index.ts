/**
 * Axios 인스턴스 및 HTTP 클라이언트 설정
 *
 * @description
 * - 모든 API 요청은 이 인스턴스를 통해 수행
 * - 환경 변수에서 baseURL 자동 로드
 * - 에러를 AppError로 자동 변환하는 인터셉터 포함
 * - 인증 토큰 자동 첨부 (withCredentials)
 */

import axios, { AxiosError } from 'axios';
import { AppError, NetworkError } from '@/utils/errors';

/**
 * Axios 인스턴스
 *
 * @example
 * // GET 요청
 * const response = await api.get('/books/search', { params: { q: 'React' } });
 *
 * @example
 * // POST 요청
 * const response = await api.post('/auth/login', { email, password });
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 쿠키 및 인증 정보 자동 포함
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15초 타임아웃
});

/**
 * 요청 인터셉터
 * - 요청 전 로깅 (개발 환경)
 * - Authorization 헤더 자동 추가 (필요시)
 */
api.interceptors.request.use(
  (config) => {
    // 개발 환경에서 요청 로깅
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
    }

    // 로컬 스토리지에서 토큰 가져오기 (필요시)
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 성공 응답은 그대로 반환
 * - 에러 발생 시 AppError로 변환하여 throw
 */
api.interceptors.response.use(
  (response) => {
    // 개발 환경에서 응답 로깅
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    // 개발 환경에서 에러 로깅
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.data || error.message);
    }

    // 네트워크 에러 (서버 연결 실패, 타임아웃 등)
    if (!error.response) {
      throw new NetworkError(error.message || '서버에 연결할 수 없습니다');
    }

    // HTTP 에러를 AppError로 변환
    const status = error.response.status;
    const message = error.response.data?.message || getDefaultMessage(status);

    throw new AppError(message, status);
  }
);

/**
 * HTTP 상태 코드에 따른 기본 에러 메시지
 */
const getDefaultMessage = (status: number): string => {
  switch (status) {
    case 400:
      return '잘못된 요청입니다';
    case 401:
      return '로그인이 필요합니다';
    case 403:
      return '접근 권한이 없습니다';
    case 404:
      return '요청한 리소스를 찾을 수 없습니다';
    case 409:
      return '이미 존재하는 데이터입니다';
    case 500:
      return '서버 오류가 발생했습니다';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다';
    default:
      return '요청 처리 중 오류가 발생했습니다';
  }
};

/**
 * API 헬퍼: 토큰 설정
 * @param token - JWT 액세스 토큰
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * API 헬퍼: 토큰 제거
 */
export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
  delete api.defaults.headers.common['Authorization'];
};

/**
 * API 헬퍼: 현재 토큰 가져오기
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};
