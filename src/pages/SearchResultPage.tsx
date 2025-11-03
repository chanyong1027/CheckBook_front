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
import { searchBooks } from '@/utils/mockData';

/**
 * 검색 결과 페이지 컴포넌트
 */
export const SearchResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL에서 검색어 가져오기
  const query = searchParams.get('q') || '';

  // 🚧 임시: Mock 데이터에서 검색 (API 연동 전)
  const books = React.useMemo(() => searchBooks(query), [query]);

  // TODO: API 연동 시 아래 주석 해제하고 Mock 코드 제거
  /*
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
  */

  // 도서 클릭 핸들러
  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  // 검색 초기화
  const handleResetSearch = () => {
    navigate('/');
  };

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
              총 <span className="font-semibold text-blue-600">{books.length.toLocaleString()}</span>개의 결과
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
              key={book.id}
              book={book}
              onClick={handleBookClick}
              showAvailability={true}
            />
          ))}
        </div>

        {/* 검색 결과 종료 메시지 */}
        {books.length > 0 && (
          <div className="py-8 text-center text-sm text-gray-500">
            모든 검색 결과를 확인했습니다.
          </div>
        )}
      </div>
    </div>
  );
};
