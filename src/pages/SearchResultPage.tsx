/**
 * SearchResultPage 컴포넌트
 *
 * @description
 * - 도서 검색 결과 페이지
 * - Mock 데이터 기반 검색
 * - 로딩/에러/빈 상태 처리
 *
 * @example
 * <SearchResultPage />
 */

import * as React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookCard } from '@/components/BookCard';
import { EmptySearchResult } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { useBookSearch } from '@/hooks/useBookSearch';
import { searchBooks } from '@/utils/mockData';

/**
 * 검색 결과 페이지 컴포넌트
 */
export const SearchResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL에서 검색어 가져오기
  const query = searchParams.get('q') || '';

  // 실제 API 연동
  const {
    books: apiBooks,
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
  } = useBookSearch({ query, pageSize: 12 });

  // Mock 데이터 fallback (개발 중)
  const mockBooks = React.useMemo(() => searchBooks(query), [query]);
  const books = apiBooks.length > 0 ? apiBooks : mockBooks;

  // 도서 클릭 핸들러
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  // 검색 초기화
  const handleResetSearch = () => {
    navigate('/');
  };

  // 로딩 상태
  if (isLoading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner size="lg" label="검색 중..." />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError && books.length === 0) {
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

  // 빈 상태 (검색 결과 없음)
  if (books.length === 0 && query) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <EmptySearchResult onReset={handleResetSearch} />
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
            {query ? `"${query}" 검색 결과` : '모든 도서'}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 <span className="font-semibold text-blue-600">{totalCount > 0 ? totalCount.toLocaleString() : books.length.toLocaleString()}</span>개의 결과
            </p>
            <button
              onClick={handleResetSearch}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← 홈으로 돌아가기
            </button>
          </div>
        </div>

        {/* 검색 결과 리스트 */}
        <div className="space-y-4">
          {books.map((book) => (
            <BookCard
              key={book.id ?? book.isbn13}
              book={book}
              onClick={handleBookClick}
              showAvailability={true}
            />
          ))}
        </div>

        {/* 더 보기 버튼 (무한 스크롤) */}
        {hasNextPage && (
          <div className="py-8 text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingNextPage ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}

        {/* 검색 결과 종료 메시지 */}
        {books.length > 0 && !hasNextPage && (
          <div className="py-8 text-center text-sm text-gray-500">
            모든 검색 결과를 확인했습니다.
          </div>
        )}
      </div>
    </div>
  );
};
