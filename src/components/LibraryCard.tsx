/**
 * LibraryCard 컴포넌트
 *
 * @description
 * - 도서관 정보를 카드 형태로 표시
 * - 이름, 주소, 거리, 대출 가능 여부 표시
 * - 전화, 홈페이지 링크 제공
 * - 추가/삭제 액션 버튼 지원
 *
 * @example
 * <LibraryCard
 *   library={library}
 *   available={true}
 *   onAdd={() => addLibrary(library)}
 * />
 */

import * as React from 'react';
import type { Library } from '@/types/library';
import { formatDistance } from '@/utils/formatters';

/**
 * LibraryCard Props
 */
interface LibraryCardProps {
  /** 도서관 정보 */
  library: Library;
  /** 대출 가능 여부 (선택적) */
  available?: boolean;
  /** 추가 버튼 표시 여부 */
  showAddButton?: boolean;
  /** 삭제 버튼 표시 여부 */
  showRemoveButton?: boolean;
  /** 추가 버튼 클릭 핸들러 */
  onAdd?: (library: Library) => void;
  /** 삭제 버튼 클릭 핸들러 */
  onRemove?: (libraryId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 로딩 중 여부 */
  isLoading?: boolean;
}

/**
 * 도서관 카드 컴포넌트
 */
export const LibraryCard: React.FC<LibraryCardProps> = ({
  library,
  available,
  showAddButton = false,
  showRemoveButton = false,
  onAdd,
  onRemove,
  className = '',
  isLoading = false,
}) => {
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd?.(library);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(library.id);
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (library.phone) {
      window.location.href = `tel:${library.phone}`;
    }
  };

  const handleHomepageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (library.homepage) {
      window.open(library.homepage, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm p-4
        hover:shadow-md transition-all duration-200
        ${className}
      `}
    >
      <div className="flex justify-between items-start gap-3">
        {/* 좌측: 도서관 정보 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 mb-1">{library.name}</h4>
          <p className="text-sm text-gray-500 mb-1 truncate">{library.address}</p>

          {/* 거리 표시 */}
          {library.distanceKm !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-gray-400" aria-label={`거리 ${library.distanceKm}km`}>
                📍 {formatDistance(library.distanceKm)}
              </span>
            </div>
          )}

          {/* 연락처 버튼 */}
          <div className="flex gap-2 mt-3">
            {library.phone && (
              <button
                onClick={handlePhoneClick}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                aria-label={`${library.name} 전화걸기`}
              >
                📞 전화
              </button>
            )}
            {library.homepage && (
              <button
                onClick={handleHomepageClick}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                aria-label={`${library.name} 홈페이지 방문`}
              >
                🌐 홈페이지
              </button>
            )}
          </div>
        </div>

        {/* 우측: 상태 및 액션 */}
        <div className="flex flex-col items-end gap-2">
          {/* 대출 가능 여부 */}
          {available !== undefined && (
            <div className="text-sm font-medium whitespace-nowrap">
              {available ? (
                <span className="text-green-500" aria-label="대출 가능">
                  ✓ 대출 가능
                </span>
              ) : (
                <span className="text-gray-400" aria-label="대출 중">
                  ✗ 대출 중
                </span>
              )}
            </div>
          )}

          {/* 추가 버튼 */}
          {showAddButton && onAdd && (
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="
                px-3 py-1 text-sm font-medium
                bg-blue-500 text-white rounded-lg
                hover:bg-blue-600 transition-colors
                disabled:bg-gray-300 disabled:cursor-not-allowed
              "
              aria-label={`${library.name} 추가하기`}
            >
              {isLoading ? '추가 중...' : '+ 추가'}
            </button>
          )}

          {/* 삭제 버튼 */}
          {showRemoveButton && onRemove && (
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="
                px-3 py-1 text-sm font-medium
                bg-red-50 text-red-600 rounded-lg
                hover:bg-red-100 transition-colors
                disabled:bg-gray-100 disabled:cursor-not-allowed
              "
              aria-label={`${library.name} 삭제하기`}
            >
              {isLoading ? '삭제 중...' : '삭제'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 스켈레톤 카드 (로딩 상태)
 */
export const LibraryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/4 mt-3" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
};

/**
 * 도서관 리스트 컴포넌트
 */
interface LibraryListProps {
  /** 도서관 목록 */
  libraries: Library[];
  /** 대출 가능 여부 맵 (libraryId -> available) */
  availabilityMap?: Map<string, boolean>;
  /** 추가 버튼 표시 여부 */
  showAddButton?: boolean;
  /** 삭제 버튼 표시 여부 */
  showRemoveButton?: boolean;
  /** 추가 버튼 클릭 핸들러 */
  onAdd?: (library: Library) => void;
  /** 삭제 버튼 클릭 핸들러 */
  onRemove?: (libraryId: string) => void;
  /** 로딩 중 여부 */
  isLoading?: boolean;
  /** 로딩 스켈레톤 개수 */
  skeletonCount?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const LibraryList: React.FC<LibraryListProps> = ({
  libraries,
  availabilityMap,
  showAddButton = false,
  showRemoveButton = false,
  onAdd,
  onRemove,
  isLoading = false,
  skeletonCount = 3,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <LibraryCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {libraries.map((library) => (
        <LibraryCard
          key={library.id}
          library={library}
          available={availabilityMap?.get(library.id)}
          showAddButton={showAddButton}
          showRemoveButton={showRemoveButton}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
