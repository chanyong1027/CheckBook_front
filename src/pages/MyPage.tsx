/**
 * MyPage v2 - 디자인 리뉴얼
 *
 * 변경사항:
 * - 원형 차트 (장르 통계)
 * - 막대 그래프 (월별 기록)
 * - 우측 사이드바 (키워드 + 메모)
 * - 탭 스타일 변경 (노란색 강조)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  useWishlistBooks,
  useReadingBooks,
  useReadBooks,
  useBookStateCounts,
} from '@/store/useBookStateStore';
import { cn } from '@/utils/helpers';
import type { ReadingState, UserBookState } from '@/types/user';

// 장르 통계 목 데이터
const GENRE_DATA = [
  { name: '소설/시/희곡', value: 35, color: '#F7B731' },
  { name: '새로운장르 > 사랑으로쓴', value: 25, color: '#D1D5DB' },
  { name: '역사와 > 사회과도 역사', value: 20, color: '#FF8C42' },
  { name: '수필/에세이는 > 우리나동화송집', value: 15, color: '#E5E7EB' },
  { name: '소설/시/희곡 > 조선 문학문고', value: 5, color: '#9CA3AF' },
];

// 월별 기록 목 데이터
const MONTHLY_DATA = [
  { month: '5월', count: 0 },
  { month: '6월', count: 0 },
  { month: '7월', count: 2 },
];

function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReadingState>('READ');

  const wishlistBooks = useWishlistBooks();
  const readingBooks = useReadingBooks();
  const readBooks = useReadBooks();
  const counts = useBookStateCounts();

  const getCurrentBooks = () => {
    switch (activeTab) {
      case 'WISHLIST': return wishlistBooks;
      case 'READING': return readingBooks;
      case 'READ': return readBooks;
      default: return [];
    }
  };

  const currentBooks = getCurrentBooks();

  const tabs = [
    { key: 'READ' as ReadingState, label: '다 읽은 책', count: counts.read },
    { key: 'READING' as ReadingState, label: '읽고 있는 책', count: counts.reading },
    { key: 'WISHLIST' as ReadingState, label: '찜한 책', count: counts.wishlist },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 타이틀 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">나의 서재</h1>

        {/* 메인 레이아웃: 왼쪽 콘텐츠 + 우측 사이드바 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 통계 섹션: 2열 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 많이 읽은 장르 - 원형 차트 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">많이 읽은 장르</h2>
                <div className="flex items-center gap-6">
                  {/* 파이 차트 */}
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={GENRE_DATA}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                        >
                          {GENRE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 범례 */}
                  <div className="flex-1 space-y-1">
                    {GENRE_DATA.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600 line-clamp-1">
                          {idx + 1}위 {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 이달의 기록현황 - 막대 그래프 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">이달의 기록현황</h2>
                <p className="text-xs text-gray-500 mb-4">작년대비가 기록중에서 1위 증가하였어요!</p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 2]} tick={{ fontSize: 12 }} />
                      <Bar dataKey="count" fill="#F7B731" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 독서 기록 섹션 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  지금까지 저장한 책이에요
                </h2>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>읽게 된 일기</option>
                </select>
              </div>

              {/* 탭 */}
              <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition',
                      activeTab === tab.key
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 도서 그리드 (4열) */}
              {currentBooks.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  저장된 책이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {currentBooks.map((book: UserBookState) => (
                    <div
                      key={book.bookId}
                      className="cursor-pointer group"
                      onClick={() => navigate(`/book/${book.bookId}`)}
                    >
                      <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-2 group-hover:shadow-lg transition" />
                      <h3 className="text-sm font-medium line-clamp-2">도서 #{book.bookId}</h3>
                      <p className="text-xs text-gray-500">저자명</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 우측: 사이드바 */}
          <div className="space-y-6">
            {/* 내가 저장한 키워드 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">내가 저장한 키워드</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">소설</span>
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">인문·사회</span>
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">집밥·요리</span>
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">동시</span>
              </div>
            </div>

            {/* 최근 기록된 메모 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 기록된 메모</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <p className="text-sm text-gray-700 mb-1">메모 제목 {i}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      메모 내용 미리보기...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">관련 도서명</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
