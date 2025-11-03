/**
 * HomePage 컴포넌트 (v2 - 디자인 리뉴얼)
 *
 * @description
 * - 메인 랜딩 페이지
 * - Hero 배너: 책 일러스트 + 그라데이션 배경
 * - 검색창 (상단 Header로 이동)
 * - 베스트셀러 캐러셀
 *
 * @version 2.0
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { getBestsellers, getNewBooks } from '@/utils/mockData';

/**
 * HomePage Props
 */
interface HomePageProps {
  /** 검색 핸들러 */
  onSearch?: (query: string) => void;
}

/**
 * 홈페이지 컴포넌트
 */
export const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(0);

  // 🚧 임시: Mock 데이터 (API 연동 전)
  const bestsellers = getBestsellers();
  const newBooks = getNewBooks();

  // 베스트셀러: 페이지당 6개씩 표시
  const booksPerPage = 6;
  const totalPages = Math.ceil(bestsellers.length / booksPerPage);
  const displayedBooks = bestsellers.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - 책 일러스트 + 그라데이션 배경 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 그라데이션 카드 */}
        <div className="bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between min-h-[280px] p-8 md:p-12">
            {/* 왼쪽: 책 일러스트 */}
            <div className="w-1/2 flex justify-center items-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* 책 스택 일러스트 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                  {/* 책 1 - 보라색 */}
                  <div className="w-40 h-10 md:w-48 md:h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg shadow-lg transform -rotate-6 opacity-90" />
                  {/* 책 2 - 분홍색 */}
                  <div className="w-40 h-10 md:w-48 md:h-12 bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg shadow-lg transform rotate-3 opacity-90" />
                  {/* 책 3 - 노란색 */}
                  <div className="w-40 h-10 md:w-48 md:h-12 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg shadow-lg transform -rotate-2 opacity-90" />
                  {/* 책 4 - 파란색 */}
                  <div className="w-40 h-10 md:w-48 md:h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-lg transform rotate-1" />
                </div>
              </div>
            </div>

            {/* 오른쪽: 텍스트 콘텐츠 */}
            <div className="w-1/2">
              <div className="text-right">
                {/* 배지 */}
                <span className="inline-block px-3 py-1 bg-accent text-white text-xs md:text-sm rounded-full mb-3">
                  배경
                </span>

                {/* 메인 타이틀 */}
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">
                  오늘의 독서를 기록해보세요!
                </h1>

                {/* 설명 텍스트 */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2">
                  책을 읽다가 감동 깊었던 내용이나 기억나지 않는 점들이 있으신가요?
                </p>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  마이페이지에서 등으로 루분을 기록하고 공유해 보세요!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 베스트셀러 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 카드 래퍼 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* 섹션 헤더 */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              🏆 베스트셀러
            </h2>
            <p className="text-gray-600 text-sm">
              실시간 베스트셀러를 알려드려요
            </p>
          </div>

          {/* 도서 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-6">
            {displayedBooks.map((book) => (
              <div
                key={book.id}
                className="cursor-pointer group"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {/* 도서 커버 */}
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                  <img
                    src={book.coverUrl ?? '/placeholder-book.png'}
                    alt={`${book.title} 표지`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-book.png';
                    }}
                  />
                </div>

                {/* 도서 정보 */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 점 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentPage === index ? 'bg-primary w-6' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentPage(index)}
                  aria-label={`페이지 ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 신간 도서 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 카드 래퍼 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* 섹션 헤더 */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              📘 신간 도서
            </h2>
            <p className="text-gray-600 text-sm">
              2024년 따끈따끈한 신간을 소개합니다
            </p>
          </div>

          {/* 도서 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {newBooks.map((book) => (
              <div
                key={book.id}
                className="cursor-pointer group"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {/* 도서 커버 */}
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                  <img
                    src={book.coverUrl ?? '/placeholder-book.png'}
                    alt={`${book.title} 표지`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-book.png';
                    }}
                  />
                </div>

                {/* 도서 정보 */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
