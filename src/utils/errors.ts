/**
 * 커스텀 에러 클래스 정의
 */

/**
 * 애플리케이션 에러 클래스
 *
 * @description
 * - HTTP 상태 코드를 포함할 수 있는 커스텀 에러 클래스
 * - API 에러 처리 시 사용
 * - Axios 인터셉터에서 자동으로 변환됨
 *
 * @example
 * throw new AppError('도서를 찾을 수 없습니다', 404);
 *
 * @example
 * try {
 *   const response = await api.get('/books/invalid-id');
 * } catch (error) {
 *   if (error instanceof AppError) {
 *     console.log(error.message); // '도서를 찾을 수 없습니다'
 *     console.log(error.status);  // 404
 *   }
 * }
 */
export class AppError extends Error {
  /** HTTP 상태 코드 (선택적) */
  status?: number;

  /**
   * AppError 생성자
   *
   * @param message - 에러 메시지
   * @param status - HTTP 상태 코드 (선택적)
   */
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'AppError';

    // TypeScript에서 Error를 상속할 때 필요한 처리
    // (prototype chain 복원)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 인증 에러 클래스
 *
 * @description
 * - 로그인 실패, 토큰 만료 등 인증 관련 에러
 * - 자동으로 로그인 페이지로 리다이렉트할 수 있음
 */
export class AuthError extends AppError {
  constructor(message: string = '인증이 필요합니다') {
    super(message, 401);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * 권한 에러 클래스
 *
 * @description
 * - 접근 권한이 없을 때 발생하는 에러
 */
export class PermissionError extends AppError {
  constructor(message: string = '접근 권한이 없습니다') {
    super(message, 403);
    this.name = 'PermissionError';
    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}

/**
 * 리소스를 찾을 수 없을 때 발생하는 에러
 */
export class NotFoundError extends AppError {
  constructor(message: string = '요청한 리소스를 찾을 수 없습니다') {
    super(message, 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 네트워크 에러 클래스
 *
 * @description
 * - 서버 연결 실패, 타임아웃 등 네트워크 관련 에러
 */
export class NetworkError extends AppError {
  constructor(message: string = '네트워크 연결에 실패했습니다') {
    super(message, 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * 유효성 검증 에러 클래스
 *
 * @description
 * - 폼 입력값 검증 실패 시 발생
 * - Zod 스키마 검증 에러를 래핑할 수 있음
 */
export class ValidationError extends AppError {
  /** 필드별 에러 메시지 */
  fields?: Record<string, string>;

  constructor(message: string = '입력값이 올바르지 않습니다', fields?: Record<string, string>) {
    super(message, 400);
    this.name = 'ValidationError';
    this.fields = fields;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 에러를 AppError로 변환하는 유틸리티 함수
 *
 * @param error - 변환할 에러 객체
 * @returns AppError 인스턴스
 *
 * @example
 * try {
 *   // some code
 * } catch (err) {
 *   const appError = toAppError(err);
 *   toast.error(appError.message);
 * }
 */
export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  if (typeof error === 'string') {
    return new AppError(error);
  }

  return new AppError('알 수 없는 오류가 발생했습니다');
};

/**
 * HTTP 상태 코드에 따른 기본 에러 메시지를 반환
 *
 * @param status - HTTP 상태 코드
 * @returns 기본 에러 메시지
 */
export const getDefaultErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return '잘못된 요청입니다';
    case 401:
      return '로그인이 필요합니다';
    case 403:
      return '접근 권한이 없습니다';
    case 404:
      return '요청한 리소스를 찾을 수 없습니다';
    case 500:
      return '서버 오류가 발생했습니다';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다';
    default:
      return '오류가 발생했습니다';
  }
};
