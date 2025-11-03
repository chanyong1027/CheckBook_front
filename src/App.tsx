/**
 * CheckBook 메인 App 컴포넌트
 *
 * @description
 * - React Router를 사용한 라우팅 설정
 * - React Query 클라이언트 설정
 * - 전역 Toast 알림 설정
 * - Layout 컴포넌트 통합
 */

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import { HomePage } from '@/pages/HomePage';
import { SearchResultPage } from '@/pages/SearchResultPage';
import { BookDetailPage } from '@/pages/BookDetailPage';
import { MyLibraryPage } from '@/pages/MyLibraryPage';
import MyPage from '@/pages/MyPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';

// Layout
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

// Hooks
import { useAuth } from '@/hooks/useAuth';

/**
 * React Query 클라이언트 설정
 *
 * @config
 * - retry: 1 (실패 시 1번만 재시도)
 * - staleTime: 5분 (5분간 캐시 유지)
 * - refetchOnWindowFocus: false (윈도우 포커스 시 자동 refetch 비활성화)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Layout 컴포넌트 - 헤더/푸터 네비게이션 로직 포함
 */
function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, signout } = useAuth();

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = () => {
    signout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* 전역 헤더 */}
      <Header
        onLogoClick={() => navigate('/')}
        onLogin={() => navigate('/login')}
        onSignup={() => navigate('/signup')}
        onMyPage={() => navigate('/mypage')}
        onMyLibrary={() => navigate('/mylibrary')}
        onMyReview={() => navigate('/review')}
        onLogout={handleLogout}
        onSearch={(query) => navigate(`/search?q=${query}`)}
        isAuthenticated={isAuthenticated}
        userNickname={user?.nickname}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1">{children}</main>

      {/* 전역 푸터 */}
      <Footer />
    </div>
  );
}

/**
 * 메인 App 컴포넌트
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 로그인/회원가입 페이지 (Layout 없음) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Layout이 포함된 페이지들 */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  {/* 홈 페이지 */}
                  <Route path="/" element={<HomePage />} />

                  {/* 검색 결과 페이지 */}
                  <Route path="/search" element={<SearchResultPage />} />

                  {/* 도서 상세 페이지 */}
                  <Route path="/book/:id" element={<BookDetailPage />} />

                  {/* 내 도서관 관리 페이지 */}
                  <Route path="/mylibrary" element={<MyLibraryPage />} />

                  {/* 나의 독서 기록 페이지 */}
                  <Route path="/mypage" element={<MyPage />} />

                  {/* 내 리뷰 페이지 */}
                  <Route path="/review" element={<ReviewPage />} />

                  {/* 404 페이지 */}
                  <Route
                    path="*"
                    element={
                      <div className="container mx-auto px-4 py-16 text-center">
                        <h1 className="text-h1 font-bold text-neutral-800 mb-4">404 Not Found</h1>
                        <p className="text-body text-neutral-500 mb-6">
                          요청하신 페이지를 찾을 수 없습니다.
                        </p>
                        <a
                          href="/"
                          className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition"
                        >
                          홈으로 돌아가기
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>

        {/* React Query DevTools (개발 환경에서만) */}
        <ReactQueryDevtools initialIsOpen={false} />

        {/* Toast 알림 컨테이너 */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
