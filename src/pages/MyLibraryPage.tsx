/**
 * MyLibraryPage 컴포넌트
 *
 * @description
 * - 내 도서관 관리 페이지
 * - 최대 3개 등록 가능
 * - 도서관 검색 및 추가/삭제
 *
 * @example
 * <MyLibraryPage />
 */

import * as React from 'react';
import { LibraryCard } from '@/components/LibraryCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyLibraryList } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { useUserLibrary } from '@/hooks/useUserLibrary';
import type { Library } from '@/types/library';

/**
 * MyLibraryPage Props
 */
interface MyLibraryPageProps {
  /** 뒤로가기 핸들러 */
  onGoBack?: () => void;
}

/**
 * 내 도서관 관리 페이지 컴포넌트
 */
export const MyLibraryPage: React.FC<MyLibraryPageProps> = ({ onGoBack }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Library[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // 내 도서관 관리
  const {
    myLibraries,
    isLoading,
    isError,
    error,
    addLibrary,
    removeLibrary,
    isAdding,
    isRemoving,
  } = useUserLibrary();

  // 도서관 검색 (실제로는 API 호출)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // TODO: 실제 API 호출로 대체
    setTimeout(() => {
      // Mock data
      setSearchResults([
        {
          id: 'lib-' + Date.now(),
          name: searchQuery + ' 도서관',
          address: '서울시 강남구',
          distanceKm: 2.5,
        } as Library,
      ]);
      setIsSearching(false);
    }, 500);
  };

  // 도서관 추가
  const handleAddLibrary = async (library: Library) => {
    try {
      await addLibrary(library);
      setSearchResults(prev => prev.filter(l => l.id !== library.id));
    } catch (error: any) {
      alert(error.message || '도서관 추가에 실패했습니다');
    }
  };

  // 도서관 삭제
  const handleRemoveLibrary = async (libraryId: string) => {
    try {
      await removeLibrary(libraryId);
    } catch (error: any) {
      alert(error.message || '도서관 삭제에 실패했습니다');
    }
  };

  // 에러 상태
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ErrorState error={error} title="도서관 정보를 불러올 수 없습니다" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">내 도서관 관리</h1>
            <p className="text-sm text-gray-600">
              자주 이용하는 도서관을 최대 3곳까지 등록할 수 있습니다
            </p>
          </div>
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← 뒤로가기
            </button>
          )}
        </div>

        {/* 내 도서관 목록 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              내 도서관 ({myLibraries.length}/3)
            </h2>
          </div>

          {isLoading ? (
            <LoadingSpinner size="md" label="도서관 정보를 불러오는 중..." />
          ) : myLibraries.length === 0 ? (
            <EmptyLibraryList />
          ) : (
            <div className="space-y-3">
              {myLibraries.map((library) => (
                <LibraryCard
                  key={library.id}
                  library={library}
                  showRemoveButton
                  onRemove={handleRemoveLibrary}
                  isLoading={isRemoving}
                />
              ))}
            </div>
          )}
        </section>

        {/* 도서관 검색 섹션 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">도서관 검색</h2>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도서관 이름으로 검색"
                className="
                  flex-1 px-4 py-2 border border-gray-300 rounded-xl
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                "
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="
                  px-6 py-2 bg-blue-500 text-white rounded-xl
                  hover:bg-blue-600 transition-colors
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                "
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>
            </div>
          </form>

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                검색 결과 ({searchResults.length}개)
              </h3>
              <div className="space-y-3">
                {searchResults.map((library) => (
                  <LibraryCard
                    key={library.id}
                    library={library}
                    showAddButton={myLibraries.length < 3}
                    onAdd={handleAddLibrary}
                    isLoading={isAdding}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
