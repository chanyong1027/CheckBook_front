/**
 * BookCard 컴포넌트
 *
 * @description
 * - 도서 정보를 카드 형태로 표시
 * - 썸네일, 제목, 저자, 출판사, 대출 가능 여부 표시
 * - 클릭 시 상세 페이지로 이동
 * - 반응형 디자인 지원
 *
 * @example
 * <BookCard
 *   book={book}
 *   onClick={(id) => navigate(`/book/${id}`)}
 * />
 */

import * as React from 'react';
import type { Book } from '@/types/book';
import { formatRating } from '@/utils/formatters';

/**
 * BookCard Props
 */
interface BookCardProps {
  /** 도서 정보 */
  book: Book;
  /** 클릭 이벤트 핸들러 */
  onClick?: (bookId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 대출 가능 여부 표시 (선택적) */
  showAvailability?: boolean;
}

/**
 * 도서 카드 컴포넌트
 */
export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  className = '',
  showAvailability = true,
}) => {
  // id 또는 isbn13 사용 (백엔드 연동 시 isbn13 사용)
  const bookId = book.id ?? book.isbn13;

  const handleClick = () => {
    onClick?.(bookId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(bookId);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-2xl p-4 shadow-sm hover:shadow-md
        transition-all duration-200 cursor-pointer
        flex gap-4
        ${onClick ? 'hover:scale-[1.01]' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${book.title} 상세 정보 보기`}
    >
      {/* 도서 썸네일 */}
      <div className="flex-shrink-0">
        <img
          src={book.cover ?? book.coverUrl ?? '/placeholder-book.png'}
          alt={`${book.title} 표지`}
          className="w-24 h-36 object-cover rounded-md shadow-sm"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-book.png';
          }}
        />
      </div>

      {/* 도서 정보 */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        {/* 상단: 제목, 저자, 출판사 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{book.author}</p>
          <p className="text-xs text-gray-400">
            {book.publisher} · {book.pubYear}
          </p>

          {/* 별점 */}
          {book.rating !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-400 text-sm" aria-label={`별점 ${book.rating}점`}>
                {formatRating(book.rating)}
              </span>
              <span className="text-xs text-gray-500">({book.rating.toFixed(1)})</span>
            </div>
          )}
        </div>

        {/* 하단: 대출 가능 여부 */}
        {showAvailability && book.availability && (
          <div className="flex items-center gap-2 mt-2">
            {book.availability === 'AVAILABLE' ? (
              <>
                <span className="text-green-500 font-medium text-sm" aria-label="대출 가능">
                  ● 대출 가능
                </span>
              </>
            ) : book.availability === 'UNAVAILABLE' ? (
              <>
                <span className="text-gray-400 text-sm" aria-label="대출 중">
                  ● 대출 중
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-300 text-sm" aria-label="확인 중">
                  ● 확인 중
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 스켈레톤 카드 (로딩 상태)
 */
export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 animate-pulse">
      {/* 썸네일 스켈레톤 */}
      <div className="w-24 h-36 bg-gray-200 rounded-md" />

      {/* 정보 스켈레톤 */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
};

/**
 * 도서 리스트 컴포넌트
 */
interface BookListProps {
  /** 도서 목록 */
  books: Book[];
  /** 클릭 이벤트 핸들러 */
  onBookClick?: (bookId: string) => void;
  /** 로딩 중 여부 */
  isLoading?: boolean;
  /** 로딩 스켈레톤 개수 */
  skeletonCount?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onBookClick,
  isLoading = false,
  skeletonCount = 5,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} onClick={onBookClick} />
      ))}
    </div>
  );
};
