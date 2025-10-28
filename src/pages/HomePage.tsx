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

/**
 * HomePage Props
 */
interface HomePageProps {
  /** 검색 핸들러 */
  onSearch?: (query: string) => void;
}

// 베스트셀러 목 데이터
const BESTSELLER_BOOKS = [
  { id: '1', title: '문과 남자의 과학 공부 -...', author: '유지원 (지은이)', coverUrl: '/placeholder-book1.jpg', publisher: '어크로스', pubYear: 2024, isbn13: '' },
  { id: '2', title: '세이노의 가르침', author: '세이노 (SayNo) (지은이)', coverUrl: '/placeholder-book2.jpg', publisher: '데이원', pubYear: 2023, isbn13: '' },
  { id: '3', title: '최수완의 한국사 - 5천 년...', author: '최태성 (지은이)', coverUrl: '/placeholder-book3.jpg', publisher: 'EBS', pubYear: 2024, isbn13: '' },
  { id: '4', title: '물별의 연어 1', author: '배리스톤 베르늘스 (지은이), ...', coverUrl: '/placeholder-book4.jpg', publisher: '문학수첩', pubYear: 2023, isbn13: '' },
  { id: '5', title: '나만나 많은 여름이', author: '김우주 (지은이)', coverUrl: '/placeholder-book5.jpg', publisher: '알에이치코리아', pubYear: 2024, isbn13: '' },
  { id: '6', title: '도둑맞은 집중력 - 집중력...', author: '요한 하리 (지은이), 김보라 (옮...', coverUrl: '/placeholder-book6.jpg', publisher: '어크로스', pubYear: 2024, isbn13: '' },
];

/**
 * 홈페이지 컴포넌트
 */
export const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 책 일러스트 + 그라데이션 배경 */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between min-h-[320px] py-12">
            {/* 왼쪽: 책 일러스트 */}
            <div className="w-1/2 flex justify-center items-center">
              <div className="relative w-64 h-64">
                {/* 책 스택 일러스트 (SVG or Image) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                  {/* 책 1 - 보라색 */}
                  <div className="w-48 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg shadow-lg transform -rotate-6 opacity-90" />
                  {/* 책 2 - 분홍색 */}
                  <div className="w-48 h-12 bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg shadow-lg transform rotate-3 opacity-90" />
                  {/* 책 3 - 노란색 */}
                  <div className="w-48 h-12 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg shadow-lg transform -rotate-2 opacity-90" />
                  {/* 책 4 - 파란색 */}
                  <div className="w-48 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-lg transform rotate-1" />
                </div>
              </div>
            </div>

            {/* 오른쪽: 그라데이션 배경 + 텍스트 */}
            <div className="w-1/2 relative">
              {/* 그라데이션 배경 */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-pink-100 to-pink-200 rounded-3xl -z-10" />

              {/* 텍스트 콘텐츠 */}
              <div className="p-12 text-right">
                {/* 배경 배지 */}
                <span className="inline-block px-3 py-1 bg-accent text-white text-sm rounded-full mb-4">
                  배경
                </span>

                {/* 메인 타이틀 */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                  오늘의 독서를 기록해보세요!
                </h1>

                {/* 설명 텍스트 */}
                <p className="text-gray-600 leading-relaxed mb-2">
                  책을 읽다가 감동 깊었던 내용이나 기억나지 않는 점들이 있으신가요?
                </p>
                <p className="text-gray-600 leading-relaxed">
                  마이페에서 등으로 루분을 기록하고 공유해 보세요!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 베스트셀러 섹션 */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🏆 베스트셀러
          </h2>
          <p className="text-gray-600 text-sm">
            실시간 베스트셀러를 알려드려요
          </p>
        </div>

        {/* 도서 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {BESTSELLER_BOOKS.map((book) => (
            <div
              key={book.id}
              className="cursor-pointer group"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              {/* 도서 커버 */}
              <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-4 text-center">
                  {book.title}
                </div>
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
        <div className="flex justify-center gap-2">
          <button
            className={`w-2 h-2 rounded-full transition-all ${
              currentPage === 0 ? 'bg-primary w-6' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentPage(0)}
            aria-label="페이지 1"
          />
          <button
            className={`w-2 h-2 rounded-full transition-all ${
              currentPage === 1 ? 'bg-primary w-6' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentPage(1)}
            aria-label="페이지 2"
          />
        </div>
      </section>
    </div>
  );
};
