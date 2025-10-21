/**
 * StatusToggle 컴포넌트
 *
 * @description
 * - 독서 상태 토글 버튼 (찜/읽는 중/완독)
 * - 3가지 상태를 시각적으로 구분
 * - 상태 변경 시 애니메이션 효과
 * - 접근성 지원
 *
 * @example
 * <StatusToggle
 *   currentState="READING"
 *   onChange={(state) => updateBookState({ state })}
 * />
 */

import * as React from 'react';
import type { ReadingState } from '@/types/user';
import { READING_STATE_LABELS } from '@/utils/constants';

/**
 * StatusToggle Props
 */
interface StatusToggleProps {
  /** 현재 독서 상태 */
  currentState: ReadingState | null;
  /** 상태 변경 핸들러 */
  onChange: (state: ReadingState) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 독서 상태별 스타일 정의
 */
const STATE_STYLES: Record<ReadingState, { bg: string; text: string; activeBg: string; activeText: string; icon: string }> = {
  WISHLIST: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    activeBg: 'bg-yellow-500',
    activeText: 'text-white',
    icon: '⭐',
  },
  READING: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    activeBg: 'bg-blue-500',
    activeText: 'text-white',
    icon: '📖',
  },
  READ: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    activeBg: 'bg-green-500',
    activeText: 'text-white',
    icon: '✓',
  },
};

/**
 * 독서 상태 토글 컴포넌트
 */
export const StatusToggle: React.FC<StatusToggleProps> = ({
  currentState,
  onChange,
  disabled = false,
  className = '',
}) => {
  const states: ReadingState[] = ['WISHLIST', 'READING', 'READ'];

  const handleClick = (state: ReadingState) => {
    if (disabled) return;
    onChange(state);
  };

  return (
    <div
      className={`flex gap-2 ${className}`}
      role="group"
      aria-label="독서 상태 선택"
    >
      {states.map((state) => {
        const isActive = currentState === state;
        const style = STATE_STYLES[state];

        return (
          <button
            key={state}
            onClick={() => handleClick(state)}
            disabled={disabled}
            className={`
              flex-1 px-4 py-2 rounded-xl font-medium
              transition-all duration-200
              ${isActive
                ? `${style.activeBg} ${style.activeText} shadow-md scale-105`
                : `${style.bg} ${style.text} hover:scale-102`
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-pressed={isActive}
            aria-label={`${READING_STATE_LABELS[state]}${isActive ? ' (선택됨)' : ''}`}
          >
            <span className="mr-1">{style.icon}</span>
            {READING_STATE_LABELS[state]}
          </button>
        );
      })}
    </div>
  );
};

/**
 * 독서 상태 뱃지 (읽기 전용)
 */
interface StatusBadgeProps {
  /** 독서 상태 */
  state: ReadingState;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ state, className = '' }) => {
  const style = STATE_STYLES[state];

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-3 py-1 rounded-full text-sm font-medium
        ${style.activeBg} ${style.activeText}
        ${className}
      `}
      aria-label={READING_STATE_LABELS[state]}
    >
      <span>{style.icon}</span>
      {READING_STATE_LABELS[state]}
    </span>
  );
};

/**
 * 독서 상태 카드 (상세 정보 포함)
 */
interface StatusCardProps {
  /** 현재 독서 상태 */
  currentState: ReadingState | null;
  /** 별점 (선택적) */
  rating?: number;
  /** 코멘트 (선택적) */
  comment?: string;
  /** 시작일 (선택적) */
  startDate?: string;
  /** 완료일 (선택적) */
  endDate?: string;
  /** 상태 변경 핸들러 */
  onChange: (state: ReadingState) => void;
  /** 편집 버튼 클릭 핸들러 */
  onEdit?: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  currentState,
  rating,
  comment,
  startDate,
  endDate,
  onChange,
  onEdit,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      {/* 제목 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">내 독서 상태</h3>

      {/* 상태 토글 */}
      <StatusToggle
        currentState={currentState}
        onChange={onChange}
        disabled={disabled}
      />

      {/* 추가 정보 */}
      {currentState && (
        <div className="mt-4 space-y-2">
          {/* 별점 */}
          {rating !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">별점:</span>
              <span className="text-yellow-400">
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </span>
              <span className="text-sm text-gray-500">({rating}/5)</span>
            </div>
          )}

          {/* 날짜 */}
          {(startDate || endDate) && (
            <div className="text-sm text-gray-600">
              {startDate && <div>시작: {new Date(startDate).toLocaleDateString('ko-KR')}</div>}
              {endDate && <div>완료: {new Date(endDate).toLocaleDateString('ko-KR')}</div>}
            </div>
          )}

          {/* 코멘트 */}
          {comment && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{comment}</p>
            </div>
          )}

          {/* 편집 버튼 */}
          {onEdit && (
            <button
              onClick={onEdit}
              disabled={disabled}
              className="
                mt-3 w-full px-4 py-2 text-sm font-medium
                bg-gray-100 text-gray-700 rounded-lg
                hover:bg-gray-200 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              상세 정보 수정
            </button>
          )}
        </div>
      )}
    </div>
  );
};
