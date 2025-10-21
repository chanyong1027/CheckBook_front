import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useWishlistBooks,
  useReadingBooks,
  useReadBooks,
  useBookStateCounts,
} from '@/store/useBookStateStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/utils/helpers';
import type { ReadingState, UserBookState } from '@/types/user';

/**
 * MyPage - 독서 기록 페이지
 *
 * 기능:
 * - 독서 상태별 탭 (찜 / 읽는 중 / 완독)
 * - 각 탭별 도서 리스트 표시
 * - 독서 통계 요약 (완독 수, 평균 별점)
 * - 도서 클릭 시 상세 페이지 이동
 */
function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReadingState>('WISHLIST');

  // Zustand Store에서 독서 상태 가져오기
  const wishlistBooks = useWishlistBooks();
  const readingBooks = useReadingBooks();
  const readBooks = useReadBooks();
  const counts = useBookStateCounts();

  // 로딩/에러 상태 (현재는 로컬 스토어만 사용하므로 항상 false)
  const isLoading = false;
  const isError = false;
  const refetch = () => {};

  // 현재 탭에 따른 도서 목록
  const getCurrentBooks = () => {
    switch (activeTab) {
      case 'WISHLIST':
        return wishlistBooks;
      case 'READING':
        return readingBooks;
      case 'READ':
        return readBooks;
      default:
        return [];
    }
  };

  const currentBooks = getCurrentBooks();

  // 독서 통계 계산
  const totalBooks = counts.wishlist + counts.reading + counts.read;
  const averageRating =
    readBooks.length > 0
      ? (
          readBooks.reduce((sum: number, book: UserBookState) => sum + (book.rating || 0), 0) /
          readBooks.length
        ).toFixed(1)
      : '0.0';

  // 탭 정의
  const tabs: Array<{
    key: ReadingState;
    label: string;
    count: number;
    color: string;
  }> = [
    { key: 'WISHLIST', label: '찜', count: counts.wishlist, color: 'text-wishlist' },
    { key: 'READING', label: '읽는 중', count: counts.reading, color: 'text-reading' },
    { key: 'READ', label: '완독', count: counts.read, color: 'text-completed' },
  ];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner label="독서 기록을 불러오는 중..." />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            error="독서 기록을 불러오는 중 오류가 발생했습니다."
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-neutral-800 mb-2">나의 독서 기록</h1>
          <p className="text-body text-neutral-500">
            읽고 싶은 책부터 완독한 책까지 모두 관리해보세요
          </p>
        </div>

        {/* 독서 통계 요약 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-h2 font-semibold text-neutral-800 mb-4">독서 통계</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <div className="text-2xl font-bold text-primary mb-1">{totalBooks}</div>
              <div className="text-caption text-neutral-500">전체 도서</div>
            </div>
            <div className="text-center p-4 bg-wishlist/10 rounded-xl">
              <div className="text-2xl font-bold text-wishlist mb-1">{counts.wishlist}</div>
              <div className="text-caption text-neutral-500">찜</div>
            </div>
            <div className="text-center p-4 bg-reading/10 rounded-xl">
              <div className="text-2xl font-bold text-reading mb-1">{counts.reading}</div>
              <div className="text-caption text-neutral-500">읽는 중</div>
            </div>
            <div className="text-center p-4 bg-completed/10 rounded-xl">
              <div className="text-2xl font-bold text-completed mb-1">{counts.read}</div>
              <div className="text-caption text-neutral-500">완독</div>
            </div>
          </div>

          {/* 평균 별점 (완독한 책이 있을 때만) */}
          {readBooks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-center gap-2">
                <span className="text-body text-neutral-600">평균 별점</span>
                <span className="text-xl font-bold text-accent">{averageRating}</span>
                <span className="text-body text-neutral-400">/ 5.0</span>
              </div>
            </div>
          )}
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-neutral-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 px-4 py-4 text-body font-medium transition-all',
                  'border-b-2 hover:bg-neutral-50',
                  activeTab === tab.key
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-neutral-500'
                )}
              >
                <span className={activeTab === tab.key ? tab.color : ''}>
                  {tab.label}
                </span>
                <span className="ml-2 text-caption bg-neutral-100 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="p-6">
            {currentBooks.length === 0 ? (
              <EmptyState
                title={`아직 ${tabs.find((t) => t.key === activeTab)?.label} 상태의 책이 없습니다.`}
                description="도서를 검색하고 독서 상태를 기록해보세요."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentBooks.map((bookState: UserBookState) => (
                  <div key={bookState.bookId} className="relative">
                    {/* 도서 카드 (실제로는 bookState에서 book 정보를 가져와야 함) */}
                    <div
                      onClick={() => navigate(`/book/${bookState.bookId}`)}
                      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer border border-neutral-100"
                    >
                      {/* 상태 배지 */}
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={cn(
                            'text-xs font-medium px-2 py-1 rounded-full',
                            bookState.state === 'WISHLIST' && 'bg-wishlist/20 text-wishlist',
                            bookState.state === 'READING' && 'bg-reading/20 text-reading',
                            bookState.state === 'READ' && 'bg-completed/20 text-completed'
                          )}
                        >
                          {tabs.find((t) => t.key === bookState.state)?.label}
                        </span>
                        {bookState.rating && (
                          <span className="text-xs text-neutral-500">
                            ⭐ {bookState.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* 도서 정보 플레이스홀더 */}
                      <div className="text-sm font-semibold text-neutral-800 mb-1 line-clamp-2">
                        도서 ID: {bookState.bookId}
                      </div>

                      {/* 코멘트 */}
                      {bookState.comment && (
                        <p className="text-caption text-neutral-600 line-clamp-2 mb-2">
                          "{bookState.comment}"
                        </p>
                      )}

                      {/* 날짜 정보 */}
                      <div className="text-xs text-neutral-400 mt-2">
                        {bookState.startDate && (
                          <div>시작: {formatDate(bookState.startDate)}</div>
                        )}
                        {bookState.endDate && (
                          <div>완료: {formatDate(bookState.endDate)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
