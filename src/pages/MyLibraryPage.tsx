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

import * as React from "react";
import { LibraryCard } from "@/components/LibraryCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyLibraryList } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { useUserLibrary } from "@/hooks/useUserLibrary";
import { searchLibrariesByRegion } from "@/api/libraries";
import { REGIONS, DISTRICTS } from "@/utils/constants";
import type { Library } from "@/types/library";

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
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [libraryName, setLibraryName] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Library[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string>("");

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

  // 선택된 지역의 시/군/구 목록
  const availableDistricts = React.useMemo(() => {
    if (!selectedRegion || !(selectedRegion in DISTRICTS)) {
      return [];
    }
    return DISTRICTS[selectedRegion as keyof typeof DISTRICTS];
  }, [selectedRegion]);

  // 지역이 변경되면 시/군/구 초기화
  React.useEffect(() => {
    setSelectedDistrict("");
    setSearchResults([]);
    setSearchError("");
  }, [selectedRegion]);

  /**
   * 도서관 검색 핸들러
   * @description 시/도와 시/군/구를 선택하고 도서관 이름으로 검색
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // 시/도와 시/군/구 필수
    if (!selectedRegion || !selectedDistrict) {
      setSearchError("시/도와 시/군/구를 선택해주세요.");
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      // 백엔드 API 호출
      const libraries = await searchLibrariesByRegion(
        selectedRegion,
        selectedDistrict,
        libraryName
      );

      // 이미 등록된 도서관 제외
      const currentLibraries = myLibraries || [];
      const availableLibraries = libraries.filter(
        (library) => !currentLibraries.some((myLib) => myLib.id === library.id)
      );

      setSearchResults(availableLibraries);

      if (availableLibraries.length === 0 && libraries.length > 0) {
        setSearchError("검색된 도서관이 이미 모두 등록되어 있습니다.");
      } else if (availableLibraries.length === 0) {
        setSearchError("검색 결과가 없습니다. 다른 조건으로 검색해주세요.");
      }
    } catch (error: any) {
      console.error("도서관 검색 중 오류 발생:", error);
      setSearchError(error?.message || "도서관 검색 중 오류가 발생했습니다.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 도서관 추가
  const handleAddLibrary = async (library: Library) => {
    // 이미 추가된 도서관인지 확인
    const currentLibraries = myLibraries || [];
    if (currentLibraries.some((lib) => lib.id === library.id)) {
      alert("이미 추가된 도서관입니다.");
      return;
    }

    try {
      await addLibrary(library);
      // 성공 시 검색 결과는 유지 (필터링하지 않음)
      alert(`${library.name}이(가) 추가되었습니다!`);
    } catch (error: any) {
      alert(error.message || "도서관 추가에 실패했습니다");
    }
  };

  // 도서관 삭제
  const handleRemoveLibrary = async (libraryId: string) => {
    try {
      await removeLibrary(libraryId);
    } catch (error: any) {
      alert(error.message || "도서관 삭제에 실패했습니다");
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              내 도서관 관리
            </h1>
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
              내 도서관 ({(myLibraries || []).length}/3)
            </h2>
          </div>

          {isLoading ? (
            <LoadingSpinner size="md" label="도서관 정보를 불러오는 중..." />
          ) : (myLibraries || []).length === 0 ? (
            <EmptyLibraryList />
          ) : (
            <div className="space-y-3">
              {(myLibraries || []).map((library) => (
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            도서관 검색
          </h2>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="space-y-4 mb-6">
            {/* 시/도 선택 */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                시/도 선택 <span className="text-red-500">*</span>
              </label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="
                  w-full px-4 py-2 border border-gray-300 rounded-xl
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                  bg-white
                "
              >
                <option value="">시/도를 선택하세요</option>
                {REGIONS.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 시/군/구 선택 */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                시/군/구 선택 <span className="text-red-500">*</span>
              </label>
              <select
                id="district"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedRegion || availableDistricts.length === 0}
                className="
                  w-full px-4 py-2 border border-gray-300 rounded-xl
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                  bg-white disabled:bg-gray-100 disabled:cursor-not-allowed
                "
              >
                <option value="">
                  {selectedRegion
                    ? availableDistricts.length > 0
                      ? "시/군/구를 선택하세요"
                      : "해당 지역의 시/군/구 정보가 없습니다"
                    : "먼저 시/도를 선택하세요"}
                </option>
                {availableDistricts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 도서관 이름 검색 (선택) */}
            <div>
              <label htmlFor="libraryName" className="block text-sm font-medium text-gray-700 mb-2">
                도서관 이름 <span className="text-gray-400 text-xs">(선택사항)</span>
              </label>
              <input
                id="libraryName"
                type="text"
                value={libraryName}
                onChange={(e) => setLibraryName(e.target.value)}
                placeholder="도서관 이름을 입력하세요 (예: 시립도서관)"
                className="
                  w-full px-4 py-2 border border-gray-300 rounded-xl
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                "
              />
            </div>

            {/* 검색 버튼 */}
            <button
              type="submit"
              disabled={isSearching || !selectedRegion || !selectedDistrict}
              className="
                w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-medium
                hover:bg-blue-600 transition-colors
                disabled:bg-gray-300 disabled:cursor-not-allowed
              "
            >
              {isSearching ? "검색 중..." : "도서관 검색"}
            </button>
          </form>

          {/* 에러 메시지 */}
          {searchError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{searchError}</p>
            </div>
          )}

          {/* 검색 결과 */}
          {!isSearching && searchResults.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                검색 결과 ({searchResults.length}개)
              </h3>
              <div className="space-y-3">
                {searchResults.map((library) => {
                  const currentLibraries = myLibraries || [];
                  const isAlreadyAdded = currentLibraries.some(
                    (lib) => lib.id === library.id
                  );

                  return (
                    <LibraryCard
                      key={library.id}
                      library={library}
                      showAddButton={currentLibraries.length < 3 || isAlreadyAdded}
                      isAdded={isAlreadyAdded}
                      onAdd={handleAddLibrary}
                      isLoading={isAdding}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
