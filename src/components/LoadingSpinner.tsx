/**
 * LoadingSpinner 컴포넌트
 *
 * @description
 * - 로딩 상태를 표시하는 스피너
 * - 다양한 크기 지원
 * - 오버레이 모드 지원
 *
 * @example
 * <LoadingSpinner size="md" />
 */

import * as React from 'react';

/**
 * LoadingSpinner Props
 */
interface LoadingSpinnerProps {
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 CSS 클래스 */
  className?: string;
  /** 라벨 텍스트 */
  label?: string;
}

/**
 * 로딩 스피너 컴포넌트
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-blue-500 border-t-transparent
          rounded-full animate-spin
        `}
        role="status"
        aria-label={label || '로딩 중'}
      />
      {label && (
        <p className="mt-2 text-sm text-gray-600">{label}</p>
      )}
    </div>
  );
};

/**
 * 전체 화면 오버레이 로딩
 */
interface LoadingOverlayProps {
  /** 표시 여부 */
  show: boolean;
  /** 라벨 텍스트 */
  label?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, label }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label="로딩 중"
    >
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <LoadingSpinner size="lg" label={label} />
      </div>
    </div>
  );
};
