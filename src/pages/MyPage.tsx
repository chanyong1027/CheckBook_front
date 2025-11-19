/**
 * MyPage v2 - 디자인 리뉴얼
 *
 * 변경사항:
 * - 원형 차트 (장르 통계) - 실제 데이터 연동
 * - 막대 그래프 (월별 기록) - 실제 데이터 연동
 * - 우측 사이드바 (키워드 + 메모)
 * - 탭 스타일 변경 (노란색 강조)
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useUserBookStates } from '@/hooks/useUserBookState';
import { cn } from '@/utils/helpers';
import type { ReadingState, UserBookState } from '@/types/user';

// 차트 색상
const COLORS = ['#F7B731', '#FF8C42', '#D1D5DB', '#E5E7EB', '#9CA3AF', '#6B7280'];

function MyPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ReadingState>('READ');

  // 인증 체크
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 백엔드에서 모든 독서 기록 가져오기
  const { bookStates: allBookStates, isLoading: isLoadingBooks } = useUserBookStates();

  // 상태별로 필터링 (useMemo로 메모이제이션)
  const wishlistBooks = useMemo(
    () => allBookStates.filter((item) => item.state === 'WISHLIST'),
    [allBookStates]
  );
  const readingBooks = useMemo(
    () => allBookStates.filter((item) => item.state === 'READING'),
    [allBookStates]
  );
  const readBooks = useMemo(
    () => allBookStates.filter((item) => item.state === 'READ'),
    [allBookStates]
  );

  // 상태별 카운트
  const counts = useMemo(
    () => ({
      wishlist: wishlistBooks.length,
      reading: readingBooks.length,
      read: readBooks.length,
    }),
    [wishlistBooks.length, readingBooks.length, readBooks.length]
  );

  // 장르별 통계 계산 (완독한 책 기준)
  // TODO: 백엔드에서 카테고리 정보 제공 시 업데이트 필요
  const genreData = useMemo(() => {
    const genreCounts: Record<string, number> = {};

    readBooks.forEach((bookState) => {
      // 백엔드에서 카테고리 정보를 제공하지 않으므로 기타로 분류
      const category = '기타';
      genreCounts[category] = (genreCounts[category] || 0) + 1;
    });

    // 상위 5개 장르만 표시
    const sorted = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return sorted.map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length],
    }));
  }, [readBooks]);

  // 월별 완독 수 계산 (최근 6개월)
  const monthlyData = useMemo(() => {
    const monthRanges: { month: string; start: Date; end: Date; count: number }[] = [];
    const now = new Date();

    // 최근 6개월 초기화
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const monthKey = `${date.getMonth() + 1}월`;
      monthRanges.push({
        month: monthKey,
        start: date,
        end: nextMonth,
        count: 0,
      });
    }

    // 완독한 책들의 완료일 기준으로 카운트
    readBooks.forEach((bookState) => {
      if (bookState.endDate) {
        const endDate = new Date(bookState.endDate);

        // 해당 날짜가 어느 범위에 속하는지 확인
        for (const range of monthRanges) {
          if (endDate >= range.start && endDate <= range.end) {
            range.count += 1;
            break;
          }
        }
      }
    });

    return monthRanges.map((range) => ({
      month: range.month,
      count: range.count,
    }));
  }, [readBooks]);

  // 최대 완독 수 계산 (Y축 범위 설정용)
  const maxMonthlyCount = useMemo(() => {
    const max = Math.max(...monthlyData.map((d) => d.count), 0);
    return Math.max(max + 1, 5); // 최소 5로 설정
  }, [monthlyData]);

  // 최근 메모 (comment가 있는 책들)
  const recentMemos = useMemo(() => {
    return [...readBooks, ...readingBooks]
      .filter((bookState) => bookState.comment)
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [readBooks, readingBooks]);

  // 평균 별점 계산
  const averageRating = useMemo(() => {
    const ratedBooks = readBooks.filter((b) => b.rating);
    if (ratedBooks.length === 0) return 0;
    const sum = ratedBooks.reduce((acc, b) => acc + (b.rating || 0), 0);
    return (sum / ratedBooks.length).toFixed(1);
  }, [readBooks]);

  const currentBooks = useMemo(() => {
    switch (activeTab) {
      case 'WISHLIST': return wishlistBooks;
      case 'READING': return readingBooks;
      case 'READ': return readBooks;
      default: return [];
    }
  }, [activeTab, wishlistBooks, readingBooks, readBooks]);

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
                {genreData.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-sm text-gray-500">
                    완독한 책이 없습니다.
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    {/* 파이 차트 */}
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genreData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                          >
                            {genreData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* 범례 */}
                    <div className="flex-1 space-y-1">
                      {genreData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600 line-clamp-1">
                            {idx + 1}위 {item.name} ({item.value}권)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 최근 6개월 기록현황 - 막대 그래프 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 6개월 기록현황</h2>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-500">
                    총 {counts.read}권 완독 | 평균 별점 ★{averageRating}
                  </p>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, maxMonthlyCount]} tick={{ fontSize: 12 }} />
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
                  {currentBooks.map((bookState: UserBookState) => {
                    return (
                      <div
                        key={bookState.bookId}
                        className="cursor-pointer group"
                        onClick={() => navigate(`/book/${bookState.bookId}`)}
                      >
                        {/* 표지 이미지 */}
                        <div className="aspect-[2/3] bg-gray-100 rounded-lg mb-2 group-hover:shadow-lg transition overflow-hidden">
                          {bookState.bookCover ? (
                            <img
                              src={bookState.bookCover}
                              alt={bookState.bookTitle || '책 표지'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // 무한 루프 방지
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        {/* 도서 정보 */}
                        <h3 className="text-sm font-medium line-clamp-2">
                          {bookState.bookTitle || `도서 #${bookState.bookId}`}
                        </h3>
                        <p className="text-xs text-gray-500">{bookState.bookAuthor || '저자 미상'}</p>
                        {/* 별점 표시 */}
                        {bookState.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-xs">
                              {'★'.repeat(bookState.rating)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {bookState.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
              {recentMemos.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  기록된 메모가 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMemos.map((bookState) => (
                    <div
                      key={bookState.bookId}
                      className="border-b border-gray-100 last:border-0 pb-4 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                      onClick={() => navigate(`/book/${bookState.bookId}`)}
                    >
                      {/* 별점 표시 */}
                      {bookState.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-yellow-400 text-xs">
                            {'★'.repeat(bookState.rating)}
                          </span>
                        </div>
                      )}
                      {/* 메모 내용 */}
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {bookState.comment}
                      </p>
                      {/* 도서명 */}
                      <p className="text-xs text-gray-400">
                        {bookState.bookTitle || `도서 #${bookState.bookId}`}
                      </p>
                      {/* 날짜 */}
                      {bookState.updatedAt && (
                        <p className="text-xs text-gray-300 mt-1">
                          {new Date(bookState.updatedAt).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
