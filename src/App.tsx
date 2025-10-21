import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-h1 text-primary font-bold">CheckBook</h1>
            <p className="text-caption text-neutral-400 mt-1">
              도서 검색과 도서관 대출 확인 서비스
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <h2 className="text-h2 font-semibold text-neutral-600 mb-4">
              환경 설정 완료!
            </h2>
            <p className="text-body text-neutral-500 mb-6">
              CheckBook 프로젝트의 기본 환경이 성공적으로 설정되었습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-secondary rounded-lg p-4">
                <div className="text-primary font-bold mb-2">✓ React 18</div>
                <div className="text-caption text-neutral-500">TypeScript</div>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <div className="text-accent font-bold mb-2">✓ Tailwind CSS</div>
                <div className="text-caption text-neutral-500">Design System</div>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <div className="text-reading font-bold mb-2">✓ React Query</div>
                <div className="text-caption text-neutral-500">State Management</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* React Query DevTools */}
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
      />
    </QueryClientProvider>
  );
}

export default App;
