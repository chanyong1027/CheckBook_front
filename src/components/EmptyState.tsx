/**
 * EmptyState 컴포넌트
 *
 * @description
 * - 데이터가 없을 때 표시하는 빈 상태 컴포넌트
 * - 아이콘, 제목, 설명, 액션 버튼 지원
 * - 다양한 상황에 맞는 메시지 제공
 *
 * @example
 * <EmptyState
 *   icon="📚"
 *   title="검색 결과가 없습니다"
 *   description="다른 검색어로 시도해보세요"
 * />
 */

import * as React from 'react';

/**
 * EmptyState Props
 */
interface EmptyStateProps {
  /** 아이콘 (이모지 또는 React 노드) */
  icon?: React.ReactNode;
  /** 제목 */
  title: string;
  /** 설명 (선택적) */
  description?: string;
  /** 액션 버튼 텍스트 */
  actionLabel?: string;
  /** 액션 버튼 클릭 핸들러 */
  onAction?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 빈 상태 컴포넌트
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-12 px-4 text-center
        ${className}
      `}
      role="status"
      aria-label={title}
    >
      {/* 아이콘 */}
      <div className="text-6xl mb-4">{icon}</div>

      {/* 제목 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* 설명 */}
      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      )}

      {/* 액션 버튼 */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="
            px-6 py-2 rounded-xl font-medium
            bg-blue-500 text-white
            hover:bg-blue-600 transition-colors
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/**
 * 미리 정의된 빈 상태 컴포넌트들
 */

export const EmptySearchResult: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
  <EmptyState
    icon="🔍"
    title="검색 결과가 없습니다"
    description="다른 검색어로 시도해보세요"
    actionLabel={onReset ? "검색 초기화" : undefined}
    onAction={onReset}
  />
);

export const EmptyLibraryList: React.FC<{ onAdd?: () => void }> = ({ onAdd }) => (
  <EmptyState
    icon="🏛️"
    title="등록된 도서관이 없습니다"
    description="자주 이용하는 도서관을 최대 3곳까지 등록할 수 있습니다"
    actionLabel={onAdd ? "도서관 추가하기" : undefined}
    onAction={onAdd}
  />
);

export const EmptyBookList: React.FC<{ state?: string }> = ({ state }) => {
  const messages = {
    WISHLIST: { icon: '⭐', title: '찜한 책이 없습니다', desc: '마음에 드는 책을 찜해보세요' },
    READING: { icon: '📖', title: '읽는 중인 책이 없습니다', desc: '새로운 책을 시작해보세요' },
    READ: { icon: '✓', title: '완독한 책이 없습니다', desc: '책을 완독하고 기록해보세요' },
  };

  const message = state && state in messages
    ? messages[state as keyof typeof messages]
    : { icon: '📚', title: '등록된 책이 없습니다', desc: '책을 검색하고 상태를 기록해보세요' };

  return (
    <EmptyState
      icon={message.icon}
      title={message.title}
      description={message.desc}
    />
  );
};
