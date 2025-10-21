/**
 * HomePage 컴포넌트
 *
 * @description
 * - 메인 랜딩 페이지
 * - 중앙 검색창 (도서 검색)
 * - 내 도서관 요약 (최대 3개)
 * - 최근 검색어 표시
 *
 * @example
 * <HomePage />
 */

import * as React from 'react';
import { LibraryCard } from '@/components/LibraryCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyLibraryList } from '@/components/EmptyState';
import { useUserLibrary } from '@/hooks/useUserLibrary';

/**
 * HomePage Props
 */
interface HomePageProps {
  /** 검색 핸들러 */
  onSearch?: (query: string) => void;
  /** 도서관 페이지 이동 */
  onGoToLibrary?: () => void;
}

/**
 * 홈페이지 컴포넌트
 */
export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onGoToLibrary,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // 내 도서관 조회
  const { myLibraries, isLoading: isLoadingLibraries } = useUserLibrary();

  // 최근 검색어 불러오기 (localStorage)
  React.useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // 검색 제출
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // 최근 검색어에 추가
    const updated = [trimmed, ...recentSearches.filter(q => q !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // 검색 실행
    onSearch?.(trimmed);
    setSearchQuery('');
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (query: string) => {
    onSearch?.(query);
  };

  // 최근 검색어 삭제
  const handleRemoveRecentSearch = (query: string) => {
    const updated = recentSearches.filter(q => q !== query);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - 검색 영역 */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* 로고 & 소개 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              📚 CheckBook
            </h1>
            <p className="text-lg text-gray-600">
              도서 검색부터 도서관 대출 확인까지, 한 번에
            </p>
          </div>

          {/* 검색창 */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="책 제목이나 저자를 입력하세요"
                className="
                  w-full px-6 py-4 pr-14 text-lg
                  border-2 border-gray-300 rounded-2xl
                  focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                  transition-all shadow-sm
                "
                aria-label="도서 검색"
              />
              <button
                type="submit"
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  px-4 py-2 bg-blue-500 text-white rounded-xl
                  hover:bg-blue-600 transition-colors
                "
                aria-label="검색"
              >
                🔍 검색
              </button>
            </div>
          </form>

          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">최근 검색어:</span>
              {recentSearches.map((query, index) => (
                <div
                  key={index}
                  className="
                    flex items-center gap-1
                    px-3 py-1 bg-white rounded-full
                    border border-gray-200
                    hover:border-blue-400 transition-colors
                  "
                >
                  <button
                    onClick={() => handleRecentSearchClick(query)}
                    className="text-sm text-gray-700 hover:text-blue-600"
                  >
                    {query}
                  </button>
                  <button
                    onClick={() => handleRemoveRecentSearch(query)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label={`${query} 삭제`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 내 도서관 섹션 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">내 도서관</h2>
          {myLibraries.length > 0 && (
            <button
              onClick={onGoToLibrary}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              관리하기 →
            </button>
          )}
        </div>

        {isLoadingLibraries ? (
          <div className="py-12">
            <LoadingSpinner size="lg" label="도서관 정보를 불러오는 중..." />
          </div>
        ) : myLibraries.length === 0 ? (
          <EmptyLibraryList onAdd={onGoToLibrary} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myLibraries.map((library) => (
              <LibraryCard key={library.id} library={library} />
            ))}
          </div>
        )}
      </section>

      {/* 서비스 소개 섹션 */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            CheckBook과 함께하는 독서 생활
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                간편한 도서 검색
              </h3>
              <p className="text-sm text-gray-600">
                제목이나 저자로 빠르게 원하는 책을 찾을 수 있습니다
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                도서관 대출 확인
              </h3>
              <p className="text-sm text-gray-600">
                내 도서관에서 대출 가능 여부를 실시간으로 확인하세요
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                독서 기록 관리
              </h3>
              <p className="text-sm text-gray-600">
                찜, 읽는 중, 완독 상태를 기록하고 리뷰를 남겨보세요
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
