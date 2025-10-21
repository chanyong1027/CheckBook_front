/**
 * BookDetailPage 컴포넌트
 *
 * @description
 * - 도서 상세 페이지
 * - 상단: 도서 정보
 * - 중단: 도서관 가용성
 * - 하단: 독서 상태 & 리뷰
 *
 * @example
 * <BookDetailPage bookId="book-123" />
 */

import * as React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState, NotFoundState } from '@/components/ErrorState';
import { StatusCard } from '@/components/StatusToggle';
import { EmptyLibraryList } from '@/components/EmptyState';
import { useBookDetail } from '@/hooks/useBookDetail';
import { useBookAvailability } from '@/hooks/useBookAvailability';
import { useUserBookState } from '@/hooks/useUserBookState';
import { formatRating } from '@/utils/formatters';
import type { ReadingState } from '@/types/user';

/**
 * BookDetailPage Props
 */
interface BookDetailPageProps {
  /** 도서 ID */
  bookId?: string;
  /** 뒤로가기 핸들러 */
  onGoBack?: () => void;
  /** 도서관 관리 페이지 이동 */
  onGoToLibrary?: () => void;
}

/**
 * 도서 상세 페이지 컴포넌트
 */
export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  bookId,
  onGoBack,
  onGoToLibrary,
}) => {
  // @ts-ignore - 향후 편집 UI를 위해 예약됨
  const [_isEditingState, setIsEditingState] = React.useState(false);

  // 도서 상세 정보
  const { book, isLoading, isError, error, isNotFound } = useBookDetail(bookId);

  // 도서관 가용성 (내 도서관 기준)
  const {
    availability,
    availableLibraries,
    unavailableLibraries,
    isLoading: isLoadingAvailability,
    libraryCount,
  } = useBookAvailability(bookId);

  // 독서 상태
  const {
    bookState,
    currentState,
    updateState,
    isUpdating,
  } = useUserBookState(bookId);

  // 독서 상태 변경
  const handleStateChange = async (state: ReadingState) => {
    try {
      await updateState({ state });
    } catch (error) {
      console.error('Failed to update state:', error);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner size="lg" label="도서 정보를 불러오는 중..." />
        </div>
      </div>
    );
  }

  // 404 상태
  if (isNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <NotFoundState
            message="요청하신 도서를 찾을 수 없습니다"
            onGoBack={onGoBack}
          />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ErrorState error={error} title="도서 정보를 불러올 수 없습니다" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* 뒤로가기 */}
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← 뒤로가기
          </button>
        )}

        {/* 도서 정보 섹션 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 도서 표지 */}
            <div className="flex-shrink-0">
              <img
                src={book.coverUrl ?? '/placeholder-book.png'}
                alt={`${book.title} 표지`}
                className="w-48 h-72 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-book.png';
                }}
              />
            </div>

            {/* 도서 메타 정보 */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {book.title}
              </h1>

              <div className="space-y-2 mb-4">
                <p className="text-lg text-gray-700">
                  <span className="font-medium">저자:</span> {book.author}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-medium">출판사:</span> {book.publisher} ({book.pubYear})
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">ISBN:</span> {book.isbn13}
                </p>
              </div>

              {/* 별점 */}
              {book.rating !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-400 text-xl">
                    {formatRating(book.rating)}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({book.rating.toFixed(1)}/5.0)
                  </span>
                </div>
              )}

              {/* 도서 설명 */}
              {book.description && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">책 소개</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 도서관 가용성 섹션 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">도서관 가용성</h2>
            {libraryCount === 0 && (
              <button
                onClick={onGoToLibrary}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                도서관 추가하기 →
              </button>
            )}
          </div>

          {isLoadingAvailability ? (
            <LoadingSpinner size="md" label="가용성 확인 중..." />
          ) : libraryCount === 0 ? (
            <EmptyLibraryList onAdd={onGoToLibrary} />
          ) : (
            <>
              {/* 대출 가능한 도서관 */}
              {availableLibraries.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-green-600 mb-3">
                    ✓ 대출 가능 ({availableLibraries.length}곳)
                  </h3>
                  <div className="space-y-3">
                    {availableLibraries.map((item) => {
                      const library = availability.find(a => a.libraryId === item.libraryId);
                      if (!library) return null;
                      return (
                        <div key={item.libraryId} className="text-sm text-gray-600">
                          {/* 실제로는 library 정보를 가져와서 LibraryCard 사용 */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="font-medium text-gray-900">도서관 ID: {item.libraryId}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.availableCount && `대출 가능: ${item.availableCount}권`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 대출 불가능한 도서관 */}
              {unavailableLibraries.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">
                    ✗ 대출 중 ({unavailableLibraries.length}곳)
                  </h3>
                  <div className="space-y-3">
                    {unavailableLibraries.map((item) => (
                      <div key={item.libraryId} className="text-sm text-gray-600">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="font-medium text-gray-700">도서관 ID: {item.libraryId}</p>
                          {item.reservationCount && item.reservationCount > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              예약 대기: {item.reservationCount}명
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* 독서 상태 섹션 */}
        <section>
          <StatusCard
            currentState={currentState}
            rating={bookState?.rating}
            comment={bookState?.comment}
            startDate={bookState?.startDate}
            endDate={bookState?.endDate}
            onChange={handleStateChange}
            onEdit={() => setIsEditingState(true)}
            disabled={isUpdating}
          />
        </section>
      </div>
    </div>
  );
};
