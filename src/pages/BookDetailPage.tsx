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
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState, NotFoundState } from '@/components/ErrorState';
import { BookShelfPanel } from '@/components/BookShelfPanel';
import { EmptyLibraryList } from '@/components/EmptyState';
import { useBookDetail } from '@/hooks/useBookDetail';
import { useBookAvailability } from '@/hooks/useBookAvailability';
import { useUserBookState } from '@/hooks/useUserBookState';
import { useBookStateStore } from '@/store/useBookStateStore';
import { formatRating } from '@/utils/formatters';
import { findBookById } from '@/utils/mockData';
import type { ReadingState, UserBookState } from '@/types/user';

/**
 * BookDetailPage Props
 */
interface BookDetailPageProps {
  /** 뒤로가기 핸들러 */
  onGoBack?: () => void;
  /** 도서관 관리 페이지 이동 */
  onGoToLibrary?: () => void;
}

/**
 * 도서 상세 페이지 컴포넌트
 */
export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  onGoBack,
  onGoToLibrary,
}) => {
  // URL 파라미터에서 bookId 가져오기
  const { id: bookId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 편집 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // 🚧 임시: Mock 데이터에서 도서 찾기 (API 연동 전)
  const mockBook = bookId ? findBookById(bookId) : undefined;
  const [isLoading] = React.useState(false);

  // TODO: API 연동 시 아래 주석 해제하고 Mock 코드 제거
  // const { book, isLoading, isError, error, isNotFound } = useBookDetail(bookId);
  const book = mockBook;
  const isNotFound = !mockBook;
  const isError = false;
  const error = null;

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

  // Zustand store
  const { setBookState: saveBookState } = useBookStateStore();

  // 독서 상태 변경
  const handleStateChange = async (state: ReadingState) => {
    try {
      await updateState({ state });
    } catch (error) {
      console.error('Failed to update state:', error);
    }
  };

  // 독서 상태 상세 정보 저장
  const handleSaveBookState = (state: UserBookState) => {
    try {
      saveBookState(state);
      toast.success('독서 상태가 저장되었습니다!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('독서 상태 저장 실패:', error);
      toast.error('독서 상태 저장에 실패했습니다.');
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
            onGoBack={onGoBack || (() => navigate(-1))}
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
        <button
          onClick={onGoBack || (() => navigate(-1))}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← 뒤로가기
        </button>

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
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {book.title}
              </h1>

              <div className="space-y-1 mb-3">
                <p className="text-sm text-gray-600">
                  {book.author} · {book.publisher} · {book.pubYear}
                </p>
                <p className="text-xs text-gray-400">
                  ISBN: {book.isbn13}
                </p>
                {/* 별점 표시 */}
                {book.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">
                      {formatRating(book.rating)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {book.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* 도서 설명 */}
              {book.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                </div>
              )}

              {/* 찜하기 + 내 서재에 추가 버튼 */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    const isWishlisted = currentState === 'WISHLIST';
                    if (isWishlisted) {
                      // 찜 해제
                      // TODO: 실제로는 removeBookState 사용
                      toast.info('찜하기가 해제되었습니다.');
                    } else {
                      handleStateChange('WISHLIST');
                      toast.success('찜 목록에 추가되었습니다!');
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    currentState === 'WISHLIST'
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{currentState === 'WISHLIST' ? '♥' : '♡'}</span>
                  <span className="text-sm font-medium">찜하기</span>
                </button>

                <button
                  onClick={() => setIsEditModalOpen(!isEditModalOpen)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors font-medium text-sm"
                >
                  내 서재에 추가
                </button>
              </div>
            </div>
          </div>

          {/* 내 서재에 추가 확장 패널 */}
          {isEditModalOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <BookShelfPanel
                bookId={bookId || ''}
                currentState={bookState ?? undefined}
                onSave={handleSaveBookState}
                onClose={() => setIsEditModalOpen(false)}
              />
            </div>
          )}
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

      </div>
    </div>
  );
};
