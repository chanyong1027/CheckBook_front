/**
 * Header 컴포넌트
 *
 * @description
 * - 애플리케이션 헤더
 * - 로고, 검색바, 네비게이션, 사용자 메뉴
 * - 반응형 디자인 (모바일 메뉴)
 *
 * @example
 * <Header onSearch={(query) => navigate(`/search?q=${query}`)} />
 */

import * as React from "react";
import { useLocation } from "react-router-dom";

/**
 * Header Props
 */
interface HeaderProps {
  /** 검색 핸들러 */
  onSearch?: (query: string) => void;
  /** 로고 클릭 핸들러 */
  onLogoClick?: () => void;
  /** 로그인 여부 */
  isAuthenticated?: boolean;
  /** 사용자 닉네임 */
  userNickname?: string;
  /** 로그인 버튼 클릭 */
  onLogin?: () => void;
  /** 회원가입 버튼 클릭 */
  onSignup?: () => void;
  /** 로그아웃 버튼 클릭 */
  onLogout?: () => void;
  /** 마이페이지 버튼 클릭 */
  onMyPage?: () => void;
  /** 내 도서관 버튼 클릭 */
  onMyLibrary?: () => void;
  /** 내 리뷰 버튼 클릭 */
  onMyReview?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 헤더 컴포넌트
 */
export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onLogoClick,
  isAuthenticated = false,
  userNickname,
  onLogin,
  onSignup,
  onLogout,
  onMyPage,
  onMyLibrary,
  onMyReview,
  className = "",
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // 홈페이지로 돌아올 때 검색어 초기화
  React.useEffect(() => {
    if (location.pathname === '/') {
      setSearchQuery("");
    }
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <button
              onClick={onLogoClick}
              className="text-2xl font-bold text-primary hover:opacity-80 transition-colors"
              aria-label="홈으로 이동"
            >
              CheckBook📚
            </button>
          </div>

          {/* 검색바 (데스크톱) */}
          <div className="hidden md:block flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="책 제목이나 저자를 입력하세요"
                  className="
                    w-full px-4 py-2 pr-10
                    border border-gray-300 rounded-xl
                    focus:ring-2 focus:ring-blue-400 focus:border-transparent
                    transition-all text-sm
                  "
                  aria-label="도서 검색"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="검색"
                >
                  🔍
                </button>
              </div>
            </form>
          </div>

          {/* 네비게이션 & 사용자 메뉴 (데스크톱) */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={onMyLibrary}
                  className="
                    px-3 py-2 rounded-xl text-sm font-medium
                    bg-gray-50 text-gray-700
                    hover:bg-gray-100 transition-colors
                  "
                >
                  내 도서관
                </button>
                <button
                  onClick={onMyReview}
                  className="
                    px-3 py-2 rounded-xl text-sm font-medium
                    bg-gray-50 text-gray-700
                    hover:bg-gray-100 transition-colors
                  "
                >
                  내 리뷰
                </button>
              </>
            )}

            {isAuthenticated ? (
              <>
                <button
                  onClick={onMyPage}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium px-2"
                >
                  안녕하세요, {userNickname || "사용자"}님
                </button>
                <button
                  onClick={onLogout}
                  className="
                    px-3 py-2 rounded-xl text-sm font-medium
                    bg-gray-100 text-gray-700
                    hover:bg-gray-200 transition-colors
                  "
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="
                    px-4 py-2 rounded-xl text-sm font-medium
                    bg-primary text-white
                    hover:opacity-90 transition-all
                  "
                >
                  로그인
                </button>
                <button
                  onClick={onSignup}
                  className="
                    px-4 py-2 rounded-xl text-sm font-medium
                    bg-white text-primary border-2 border-primary
                    hover:bg-primary hover:text-white transition-all
                  "
                >
                  회원가입
                </button>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="메뉴 열기/닫기"
          >
            <span className="text-2xl">{isMobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* 검색바 (모바일) */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="책 제목이나 저자를 입력하세요"
                className="
                  w-full px-4 py-2 pr-10
                  border border-gray-300 rounded-xl
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                "
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                🔍
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-700 font-medium">
                  안녕하세요, {userNickname || "사용자"}님
                </div>
                <button
                  onClick={onMyLibrary}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  내 도서관
                </button>
                <button
                  onClick={onMyReview}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  내 리뷰
                </button>
                <button
                  onClick={onMyPage}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  마이페이지
                </button>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="block w-full px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90"
                >
                  로그인
                </button>
                <button
                  onClick={onSignup}
                  className="block w-full px-4 py-2 text-sm font-medium bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
