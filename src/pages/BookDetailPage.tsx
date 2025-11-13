/**
 * BookDetailPage 컴포넌트
 *
 * @description
 * - 도서 상세 페이지
 * - 상단: 도서 정보
 * - 중단: 도서관 가용성
 * - 하단: 독서 상태 & 리뷰
 *
 * @example
 * <BookDetailPage bookId="book-123" />
 */

import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState, NotFoundState } from "@/components/ErrorState";
import { BookShelfPanel } from "@/components/BookShelfPanel";
import { useBookDetail } from "@/hooks/useBookDetail";
import { useBookAvailability } from "@/hooks/useBookAvailability";
import { useUserBookState } from "@/hooks/useUserBookState";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useBookStateStore } from "@/store/useBookStateStore";
import { formatRating } from "@/utils/formatters";
import { calculateDistance } from "@/utils/helpers";
import { findBookById } from "@/utils/mockData";
import type { ReadingState, UserBookState } from "@/types/user";

/**
 * BookDetailPage Props
 */
interface BookDetailPageProps {
  /** 뒤로가기 핸들러 */
  onGoBack?: () => void;
}

/**
 * 도서 상세 페이지 컴포넌트
 */
export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  onGoBack,
}) => {
  // URL 파라미터에서 bookId 가져오기
  const { id: bookId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 편집 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  // 실제 API 연동
  const { book, isLoading, isError, error, isNotFound } = useBookDetail(bookId);

  // Mock 데이터 fallback (개발 중)
  const mockBook = bookId ? findBookById(bookId) : undefined;
  const displayBook = book || mockBook;

  // 도서관 가용성 (서울 지역, 내 도서관 우선 정렬)
  // TODO: 사용자 설정 지역 코드를 사용하도록 변경 필요
  const isbn = displayBook?.isbn13 || bookId;
  const {
    availability,
    isLoading: isLoadingAvailability,
  } = useBookAvailability(isbn, '11');

  // 사용자 위치 정보 가져오기
  const { latitude, longitude, isLoading: isLoadingLocation, error: locationError } = useGeolocation();

  // 도서관 필터링 및 정렬 (5km 이내 + 즐겨찾기 우선)
  const filteredAndSortedLibraries = React.useMemo(() => {
    if (!availability.length) return [];

    // 각 도서관에 거리 정보 추가
    const librariesWithDistance = availability.map(lib => ({
      ...lib,
      distance: (latitude && longitude && lib.latitude && lib.longitude)
        ? calculateDistance(latitude, longitude, lib.latitude, lib.longitude)
        : null,
    }));

    // 필터링: 즐겨찾기 도서관 + 10km 이내 도서관
    const filtered = librariesWithDistance.filter(lib =>
      lib.isFavorite || (lib.distance !== null && lib.distance <= 10)
    );

    // 정렬: 즐겨찾기 우선, 그 다음 거리순
    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
  }, [availability, latitude, longitude]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedLibraries.length / ITEMS_PER_PAGE);
  const paginatedLibraries = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedLibraries.slice(startIndex, endIndex);
  }, [filteredAndSortedLibraries, currentPage]);

  // 페이지 변경 시 스크롤 최상단으로 이동
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // 독서 상태 (ISBN 사용)
  const { bookState, currentState, updateState } =
    useUserBookState(isbn);

  // Zustand store
  const { setBookState: saveBookState } = useBookStateStore();

  // 독서 상태 변경
  const handleStateChange = async (state: ReadingState) => {
    try {
      await updateState({ state });
    } catch (error) {
      console.error("Failed to update state:", error);
    }
  };

  // 독서 상태 상세 정보 저장
  const handleSaveBookState = (state: UserBookState) => {
    try {
      saveBookState(state);
      toast.success("독서 상태가 저장되었습니다!");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("독서 상태 저장 실패:", error);
      toast.error("독서 상태 저장에 실패했습니다.");
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner size="lg" label="도서 정보를 불러오는 중..." />
        </div>
      </div>
    );
  }

  // 404 상태 (API와 Mock 모두 없을 때)
  if (isNotFound && !displayBook) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <NotFoundState
            message="요청하신 도서를 찾을 수 없습니다"
            onGoBack={onGoBack || (() => navigate(-1))}
          />
        </div>
      </div>
    );
  }

  // 에러 상태 (API 에러가 있고 Mock도 없을 때)
  if (isError && !displayBook) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ErrorState error={error} title="도서 정보를 불러올 수 없습니다" />
        </div>
      </div>
    );
  }

  // 표시할 도서가 없을 때
  if (!displayBook) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <NotFoundState
            message="도서 정보를 불러올 수 없습니다"
            onGoBack={onGoBack || (() => navigate(-1))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* 뒤로가기 */}
        <button
          onClick={onGoBack || (() => navigate(-1))}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← 뒤로가기
        </button>

        {/* 도서 정보 섹션 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 도서 표지 */}
            <div className="flex-shrink-0">
              <img
                src={displayBook.cover ?? displayBook.coverUrl ?? "/placeholder-book.png"}
                alt={`${displayBook.title} 표지`}
                className="w-48 h-72 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-book.png";
                }}
              />
            </div>

            {/* 도서 메타 정보 */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {displayBook.title}
              </h1>

              <div className="space-y-1 mb-3">
                <p className="text-sm text-gray-600">
                  {displayBook.author} · {displayBook.publisher} · {displayBook.publishedAt ?? displayBook.pubYear}
                </p>
                <p className="text-xs text-gray-400">ISBN: {displayBook.isbn13}</p>
                {/* 별점 표시 */}
                {displayBook.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">
                      {formatRating(displayBook.rating)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {displayBook.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* 도서 설명 */}
              {displayBook.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {displayBook.description}
                  </p>
                </div>
              )}

              {/* 찜하기 + 내 서재에 추가 버튼 */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    const isWishlisted = currentState === "WISHLIST";
                    if (isWishlisted) {
                      // 찜 해제
                      // TODO: 실제로는 removeBookState 사용
                      toast.info("찜하기가 해제되었습니다.");
                    } else {
                      handleStateChange("WISHLIST");
                      toast.success("찜 목록에 추가되었습니다!");
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    currentState === "WISHLIST"
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{currentState === "WISHLIST" ? "♥" : "♡"}</span>
                  <span className="text-sm font-medium">찜하기</span>
                </button>

                <button
                  onClick={() => setIsEditModalOpen(!isEditModalOpen)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors font-medium text-sm"
                >
                  내 서재에 추가
                </button>
              </div>
            </div>
          </div>

          {/* 내 서재에 추가 확장 패널 */}
          {isEditModalOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <BookShelfPanel
                bookId={isbn || ""}
                currentState={bookState ?? undefined}
                onSave={handleSaveBookState}
                onClose={() => setIsEditModalOpen(false)}
              />
            </div>
          )}
        </section>

        {/* 도서관 가용성 섹션 */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              근처 도서관 ({filteredAndSortedLibraries.length}개)
            </h2>
            <button
              onClick={() => navigate('/my-library')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              내 도서관 관리 →
            </button>
          </div>

          {/* 위치 정보 로딩 중 */}
          {isLoadingLocation && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">위치 정보를 가져오는 중...</p>
            </div>
          )}

          {/* 위치 정보 에러 */}
          {locationError && (
            <div className="text-center py-4 mb-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">{locationError}</p>
              <p className="text-xs text-gray-500 mt-1">모든 도서관을 표시합니다.</p>
            </div>
          )}

          {/* 도서관 목록 로딩 중 */}
          {isLoadingAvailability ? (
            <LoadingSpinner size="md" label="도서관 정보를 불러오는 중..." />
          ) : filteredAndSortedLibraries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-2">근처 5km 이내에 이 책을 소장한 도서관이 없습니다.</p>
              <p className="text-sm text-gray-400">내 도서관을 등록하거나 다른 지역을 검색해보세요.</p>
            </div>
          ) : (
            <>
              {/* 도서관 리스트 (페이지네이션) */}
              <div className="space-y-3 mb-6">
                {paginatedLibraries.map((item) => {
                  const isAvailable = item.available;
                  const bgColor = isAvailable ? 'bg-green-50' : 'bg-red-50';
                  const borderColor = isAvailable ? 'border-green-200' : 'border-red-200';
                  const statusColor = isAvailable ? 'text-green-700' : 'text-red-700';
                  const statusBg = isAvailable ? 'bg-green-100' : 'bg-red-100';
                  const statusText = isAvailable ? '대출 가능' : '대출 중';

                  return (
                    <div
                      key={item.libraryId}
                      className={`${bgColor} border ${borderColor} rounded-lg p-4 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-semibold text-gray-900">
                              {item.libraryName}
                            </h4>
                            {item.isFavorite && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                ⭐ 내 도서관
                              </span>
                            )}
                            <span className={`px-2 py-0.5 ${statusBg} ${statusColor} text-xs rounded-full font-semibold`}>
                              {statusText}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            📍 {item.libraryAddress}
                            {item.distance && !item.isFavorite && (
                              <span className="ml-2 text-blue-600 font-medium">
                                ({item.distance.toFixed(1)}km)
                              </span>
                            )}
                          </p>
                          {!item.hasBook && (
                            <p className="text-xs text-orange-600 font-medium">
                              ⚠️ 소장 정보 없음
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        {item.libraryPhone && (
                          <button
                            onClick={() => window.open(`tel:${item.libraryPhone}`)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            📞 전화
                          </button>
                        )}
                        {item.libraryHomepage && (
                          <button
                            onClick={() => window.open(item.libraryHomepage, '_blank')}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            🏠 홈페이지
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 페이지네이션 컨트롤 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          currentPage === page
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};
