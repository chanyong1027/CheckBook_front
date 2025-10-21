/**
 * SearchResultPage 컴포넌트
 *
 * @description
 * - 도서 검색 결과 페이지
 * - 무한 스크롤 (Intersection Observer)
 * - 로딩/에러/빈 상태 처리
 *
 * @example
 * <SearchResultPage query="리액트" />
 */

import * as React from 'react';
import { BookCard } from '@/components/BookCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptySearchResult } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { useBookSearch } from '@/hooks/useBookSearch';

/**
 * SearchResultPage Props
 */
interface SearchResultPageProps {
  /** 검색 쿼리 */
  query?: string;
  /** 도서 클릭 핸들러 */
  onBookClick?: (bookId: string) => void;
  /** 검색 초기화 */
  onResetSearch?: () => void;
}

/**
 * 검색 결과 페이지 컴포넌트
 */
export const SearchResultPage: React.FC<SearchResultPageProps> = ({
  query = '',
  onBookClick,
  onResetSearch,
}) => {
  const observerRef = React.useRef<HTMLDivElement>(null);

  // 도서 검색 (무한 스크롤)
  const {
    books,
    totalCount,
    loadedPages,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    fetchNextPage,
    refetch,
    isEmpty,
  } = useBookSearch({ query });

  // Intersection Observer로 무한 스크롤 구현
  React.useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex gap-4">
                <div className="w-24 h-36 bg-gray-200 rounded-md" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ErrorState
            error={error}
            title="검색 중 오류가 발생했습니다"
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  // 빈 상태
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <EmptySearchResult onReset={onResetSearch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 검색 결과 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            "{query}" 검색 결과
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 <span className="font-semibold text-blue-600">{totalCount.toLocaleString()}</span>개의 결과
              {loadedPages > 1 && (
                <span className="ml-2 text-gray-400">
                  ({loadedPages}페이지 로드됨)
                </span>
              )}
            </p>
            {onResetSearch && (
              <button
                onClick={onResetSearch}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← 돌아가기
              </button>
            )}
          </div>
        </div>

        {/* 검색 결과 리스트 */}
        <div className="space-y-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={onBookClick}
              showAvailability={true}
            />
          ))}
        </div>

        {/* 무한 스크롤 감지 영역 */}
        {hasNextPage && (
          <div ref={observerRef} className="py-8 flex justify-center">
            {isFetchingNextPage ? (
              <LoadingSpinner size="md" label="더 많은 결과를 불러오는 중..." />
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="
                  px-6 py-2 rounded-xl font-medium
                  bg-blue-500 text-white
                  hover:bg-blue-600 transition-colors
                "
              >
                더 보기
              </button>
            )}
          </div>
        )}

        {/* 모든 결과 로드 완료 */}
        {!hasNextPage && books.length > 0 && (
          <div className="py-8 text-center text-sm text-gray-500">
            모든 검색 결과를 확인했습니다.
          </div>
        )}
      </div>
    </div>
  );
};
