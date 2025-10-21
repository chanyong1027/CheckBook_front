/**
 * ErrorState 컴포넌트
 *
 * @description
 * - 에러 발생 시 표시하는 컴포넌트
 * - 에러 메시지 및 재시도 버튼 제공
 * - 다양한 에러 타입 지원
 *
 * @example
 * <ErrorState
 *   error={error}
 *   onRetry={() => refetch()}
 * />
 */

import * as React from 'react';

/**
 * ErrorState Props
 */
interface ErrorStateProps {
  /** 에러 객체 또는 메시지 */
  error?: Error | string | null;
  /** 제목 (기본값: "문제가 발생했습니다") */
  title?: string;
  /** 재시도 버튼 클릭 핸들러 */
  onRetry?: () => void;
  /** 재시도 버튼 텍스트 */
  retryLabel?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 에러 상태 컴포넌트
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = '문제가 발생했습니다',
  onRetry,
  retryLabel = '다시 시도',
  className = '',
}) => {
  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message
    : '알 수 없는 오류가 발생했습니다';

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-12 px-4 text-center
        ${className}
      `}
      role="alert"
      aria-live="assertive"
    >
      {/* 에러 아이콘 */}
      <div className="text-6xl mb-4">⚠️</div>

      {/* 제목 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* 에러 메시지 */}
      <p className="text-sm text-gray-600 max-w-md mb-6">{errorMessage}</p>

      {/* 재시도 버튼 */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            px-6 py-2 rounded-xl font-medium
            bg-blue-500 text-white
            hover:bg-blue-600 transition-colors
          "
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

/**
 * 네트워크 에러 상태
 */
export const NetworkErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="네트워크 연결 오류"
    error="인터넷 연결을 확인하고 다시 시도해주세요"
    onRetry={onRetry}
  />
);

/**
 * 404 Not Found 상태
 */
export const NotFoundState: React.FC<{ message?: string; onGoBack?: () => void }> = ({
  message = '요청하신 페이지를 찾을 수 없습니다',
  onGoBack,
}) => (
  <ErrorState
    title="404 Not Found"
    error={message}
    onRetry={onGoBack}
    retryLabel="돌아가기"
  />
);

/**
 * 권한 없음 상태
 */
export const UnauthorizedState: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => (
  <ErrorState
    title="로그인이 필요합니다"
    error="이 기능을 사용하려면 로그인이 필요합니다"
    onRetry={onLogin}
    retryLabel="로그인하기"
  />
);
