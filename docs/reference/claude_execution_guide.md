# 🤖 CheckBook Claude Execution Guide

> **목적:** Claude Code/Chat에서 CheckBook 프로젝트를 단계별로 생성하기 위한 실행 가이드  
> **사용법:** 각 세션마다 해당 단계의 프롬프트를 복사해서 Claude에게 전달

---

## 📋 사전 준비

### 1. 참고 문서 준비
다음 문서들을 Claude가 접근 가능한 위치에 업로드:
- `CheckBook_Project_Plan.md` - 프로젝트 기획
- `CheckBook_UIUX_Plan.md` - UI/UX 설계  
- `CheckBook_CodeSpec_v5.md` - 코드 스펙

### 2. 환경 체크
```bash
node --version  # ≥ 20
pnpm --version  # ≥ 8
```

---

## 🎬 세션 1: 환경 설정 (0단계)

### 프롬프트

```
CheckBook 프로젝트의 기본 환경을 설정해줘.

**참고 문서:**
- CheckBook_CodeSpec_v5.md의 "2️⃣ 환경 변수 및 설정 관리" 섹션
- "9️⃣ 빌드 환경 및 명령어" 섹션

**생성할 파일:**
1. vite.config.ts
   - @/* 경로 alias 설정
   - src/ 를 루트로 사용

2. tsconfig.json
   - strict mode 활성화
   - path alias "@/*": ["./src/*"]

3. .env.local
   VITE_API_BASE_URL=http://localhost:8080

4. .env.production
   VITE_API_BASE_URL=https://api.checkbook.app

5. package.json
   필요한 의존성:
   - react@18, react-dom@18
   - typescript, vite
   - axios, zustand, @tanstack/react-query
   - tailwindcss, postcss, autoprefixer
   - react-router-dom@6
   - react-hook-form, zod
   - framer-motion, react-toastify

6. tailwind.config.js
   - Pretendard 폰트 설정
   - CheckBook_UIUX_Plan.md의 색상 팔레트 적용

**검증:**
- pnpm install 실행 후 에러 없음
- pnpm dev 실행 시 Vite 서버 정상 구동
```

### ✅ 체크포인트
- [ ] `pnpm install` 성공
- [ ] `pnpm dev` 실행 시 localhost:5173 접속 가능
- [ ] TypeScript 에러 없음

---

## 🎬 세션 2: 타입 & 상수 정의 (1단계)

### 프롬프트

```
CheckBook의 핵심 타입과 상수를 정의해줘.

**참고 문서:**
- CheckBook_CodeSpec_v5.md의 "4️⃣ constants.ts", "5️⃣ TypeScript 타입 정의"
- CheckBook_Project_Plan.md의 "9) 데이터 모델"

**생성할 파일:**

1. src/utils/constants.ts
```typescript
export const QUERY_KEYS = {
  BOOKS_SEARCH: 'booksSearch',
  BOOK_DETAIL: 'bookDetail',
  USER_LIBRARIES: 'userLibraries',
  USER_BOOK_STATE: 'userBookState',
} as const;

export const API_PATHS = {
  SEARCH_BOOKS: '/api/books/search',
  BOOK_DETAIL: (id: string) => `/api/books/${id}`,
  BOOK_AVAILABILITY: (id: string) => `/api/books/${id}/availability`,
  USER_LIBRARIES: '/api/me/libraries',
  USER_BOOK_STATE: (bookId: string) => `/api/me/books/${bookId}/state`,
} as const;

export const UI = {
  SPACING: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
  RADIUS: { sm: '6px', md: '12px', lg: '16px' },
  Z_INDEX: { modal: 50, dropdown: 40, header: 30 },
} as const;

export const DEFAULT_SEARCH_RADIUS_KM = 5;
export const MAX_MY_LIBRARIES = 3;
```

2. src/types/book.ts
   Book, BookAvailability 인터페이스

3. src/types/library.ts
   Library 인터페이스

4. src/types/user.ts
   User, UserBookState 인터페이스

**검증:**
- tsc --noEmit 실행 시 타입 에러 없음
- constants 값들이 모두 as const로 정의됨
```

### ✅ 체크포인트
- [ ] 모든 타입 파일 생성 완료
- [ ] `pnpm tsc --noEmit` 통과
- [ ] constants.ts의 모든 값이 자동완성됨

---

## 🎬 세션 3: 유틸리티 함수 (1.5단계)

### 프롬프트

```
CheckBook에서 사용할 유틸리티 함수들을 작성해줘.

**생성할 파일:**

1. src/utils/helpers.ts
```typescript
// debounce, sleep, cn(classnames) 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

2. src/utils/formatters.ts
   - formatDate, formatDistance 함수

3. src/utils/errors.ts
```typescript
export class AppError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}
```

**검증:**
- 각 함수에 JSDoc 주석 포함
- TypeScript 타입 안정성 보장
```

### ✅ 체크포인트
- [ ] 유틸 함수 3개 파일 생성
- [ ] AppError 클래스 정의 완료

---

## 🎬 세션 4: API 모듈 (2단계)

### 프롬프트

```
CheckBook의 API 통신 레이어를 구현해줘.

**참고 문서:**
- CheckBook_CodeSpec_v5.md의 "2️⃣ 환경 변수", "6️⃣ 커스텀 훅 명세"
- CheckBook_Project_Plan.md의 "10) API"

**중요 규칙:**
- 모든 API 호출은 axios 인스턴스 사용
- 에러 발생 시 AppError throw
- 함수명은 fetch/create/update/delete 패턴

**생성할 파일:**

1. src/api/index.ts
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// 인터셉터: 에러 변환
api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw new AppError(
      error.response?.data?.message || '요청 실패',
      error.response?.status
    );
  }
);
```

2. src/api/books.ts
```typescript
import { api } from './index';
import { Book } from '@/types/book';
import { API_PATHS } from '@/utils/constants';

export const fetchBooks = async (q: string, page = 1): Promise<Book[]> => {
  const res = await api.get(API_PATHS.SEARCH_BOOKS, { params: { q, page } });
  return res.data;
};

export const fetchBookDetail = async (id: string): Promise<Book> => {
  const res = await api.get(API_PATHS.BOOK_DETAIL(id));
  return res.data;
};
```

3. src/api/libraries.ts
   - fetchLibraries, fetchLibraryAvailability 함수

4. src/api/user.ts
   - fetchUserProfile, updateUserProfile 함수

**검증:**
- Thunder Client/Postman으로 API 호출 테스트
- 에러 시 AppError 정상 throw 확인
```

### ✅ 체크포인트
- [ ] API 모듈 3개 파일 생성
- [ ] axios 인터셉터 동작 확인
- [ ] 환경변수 baseURL 정상 로드

---

## 🎬 세션 5: Zustand Store (3단계)

### 프롬프트

```
위에서 정의한 타입을 사용해서 Zustand 스토어를 만들어줘.

**참고:** CheckBook_CodeSpec_v5.md의 "7️⃣ 상태 관리"

**생성할 파일:**

1. src/store/useLibraryStore.ts
   - myLibraries: Library[]
   - addLibrary, removeLibrary 메서드
   - 최대 3개 제한 로직 포함

2. src/store/useBookStateStore.ts
   - userBookStates: UserBookState[]
   - setBookState 메서드
   - 동일 bookId는 덮어쓰기

**원칙:**
- 불변성 기반 업데이트만 사용
- 단일 책임 원칙 준수
- zustand의 create 함수 사용

**검증:**
- React DevTools에서 store 상태 확인
- 상태 변경 시 리렌더링 정상 작동
```

### ✅ 체크포인트
- [ ] Store 2개 파일 생성
- [ ] 브라우저에서 Zustand DevTools로 확인

---

## 🎬 세션 6: Custom Hooks (4단계)

### 프롬프트

```
React Query 기반 커스텀 훅을 구현해줘.

**참고:** CheckBook_CodeSpec_v5.md의 "6️⃣ 커스텀 훅 명세"

**생성할 파일:**

1. src/hooks/useBookSearch.ts
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants';
import { fetchBooks } from '@/api/books';

export function useBookSearch(keyword: string) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.BOOKS_SEARCH, keyword],
    queryFn: ({ pageParam = 1 }) => fetchBooks(keyword, pageParam),
    getNextPageParam: (lastPage, pages) => pages.length + 1,
    enabled: keyword.length > 0,
  });
}
```

2. src/hooks/useUserLibrary.ts
   - useLibraryStore와 연동
   - addLibrary, removeLibrary 래핑

3. src/hooks/useAuth.ts
   - user, signin, signout 반환
   - JWT 토큰 관리

**검증:**
- 각 훅을 테스트 페이지에서 호출
- 로딩/에러 상태 정상 처리 확인
```

### ✅ 체크포인트
- [ ] 훅 3개 파일 생성
- [ ] React Query DevTools로 캐시 확인

---

## 🎬 세션 7: Components (5단계)

### 프롬프트

```
UI 컴포넌트를 구현해줘. Tailwind + Design System 규칙을 엄격히 따를 것.

**참고:**
- CheckBook_CodeSpec_v5.md의 "11️⃣ 컴포넌트 명세"
- CheckBook_UIUX_Plan.md의 "3) 시각 디자인 시스템"

**생성할 파일:**

1. src/components/BookCard.tsx
   - Props: book, onClick
   - 커버, 제목, 저자, 대출 가능 여부 표시
   - Tailwind 클래스: rounded-2xl, shadow-sm, hover:shadow-md

2. src/components/LibraryCard.tsx
   - Props: library
   - 이름, 주소, 거리, 대출 가능 여부

3. src/components/StatusToggle.tsx
   - Props: currentState, onChange
   - 찜/읽는 중/완독 3개 버튼

4. src/components/Layout/Header.tsx
   - 로고, 검색창, 로그인 버튼

**원칙:**
- 모든 컴포넌트는 TypeScript Props 인터페이스 정의
- UI.SPACING, UI.RADIUS 상수 사용
- 접근성: aria-label, alt 속성 포함

**검증:**
- Storybook 또는 테스트 페이지에서 시각 확인
```

### ✅ 체크포인트
- [ ] 컴포넌트 4개 이상 생성
- [ ] Tailwind 클래스 일관성 확인
- [ ] 반응형 동작 확인 (모바일/데스크톱)

---

## 🎬 세션 8: Pages (6단계)

### 프롬프트

```
최종 페이지를 구현해줘. 위에서 만든 hooks + components만 사용할 것.

**참고:**
- CheckBook_Project_Plan.md의 "4) 정보 구조 & 핵심 화면"
- CheckBook_UIUX_Plan.md의 "2) 주요 사용자 플로우별 UX 전략"

**생성할 파일:**

1. src/pages/HomePage.tsx
   - 검색창 + 최근 검색어
   - 내 도서관 요약

2. src/pages/SearchResultPage.tsx
   - useBookSearch 훅 사용
   - BookCard 컴포넌트로 리스트 렌더링
   - 무한 스크롤 구현

3. src/pages/BookDetailPage.tsx
   - 상단: 책 정보
   - 중단: 도서관 가용성 (LibraryCard)
   - 하단: StatusToggle + 리뷰

4. src/pages/MyLibraryPage.tsx
   - 내 도서관 관리 (최대 3개)
   - 드래그 앤 드롭 정렬

5. src/pages/MyPage.tsx
   - 독서 상태별 탭 (찜/읽는 중/완독)

**필수 패턴:**
- 모든 페이지는 isLoading, isError, EmptyState 처리
- React Router의 useParams, useNavigate 사용
- 직접 API 호출 금지 (hooks만 사용)

**검증:**
- 모든 페이지 라우팅 정상 작동
- 상태 변경 시 UI 즉시 반영
```

### ✅ 체크포인트
- [ ] 페이지 5개 생성
- [ ] 검색 → 상세 → 상태 변경 플로우 E2E 테스트
- [ ] 에러 시나리오 확인 (네트워크 오류 등)

---

## 🎬 세션 9: 라우팅 & 최종 통합

### 프롬프트

```
React Router 설정을 완성하고 전체 앱을 통합해줘.

**생성/수정할 파일:**

1. src/App.tsx
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/mylibrary" element={<MyLibraryPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

2. src/main.tsx
   - App 컴포넌트 마운트
   - Tailwind CSS import

**검증:**
- 전체 앱 실행 후 모든 페이지 이동 테스트
- React Query DevTools 정상 작동
```

### ✅ 최종 체크포인트
- [ ] 모든 라우트 정상 작동
- [ ] 검색 → 상세 → 상태 변경 전체 플로우 완료
- [ ] 개발자 도구에서 에러 없음
- [ ] Lighthouse 접근성 점수 ≥ 90

---

## 📊 세션 흐름 요약

```
세션 1 (환경)     → pnpm install, dev 서버 확인
세션 2 (타입)     → tsc --noEmit 통과
세션 3 (유틸)     → 함수 단위 테스트
세션 4 (API)      → Thunder Client로 호출 확인
세션 5 (Store)    → DevTools로 상태 확인
세션 6 (Hooks)    → React Query DevTools 확인
세션 7 (UI)       → 시각적 컴포넌트 확인
세션 8 (Pages)    → E2E 플로우 테스트
세션 9 (통합)     → 최종 배포 준비
```

---

## 🚨 각 세션 시작 전 체크리스트

- [ ] 이전 세션의 코드가 **실제로 동작**하는지 확인
- [ ] Git commit (롤백 가능하게)
- [ ] Claude에게 "위에서 정의한 [파일명]을 기억하고 있어?" 확인
- [ ] 타입 에러 없는지 `pnpm tsc --noEmit` 실행

---

## 💡 Claude 사용 팁

### 컨텍스트 유지 전략
```
매 3단계마다:
"지금까지 작성한 주요 파일을 요약해줘:
- constants.ts의 주요 상수
- 정의된 타입 목록  
- API 함수 시그니처
- 생성된 컴포넌트 목록"
```

### 오류 발생 시
```
"[에러 메시지]가 발생했어. 
위에서 정의한 [타입/인터페이스]와 일치하도록 수정해줘.
특히 [구체적인 부분]을 확인해줘."
```

### 코드 품질 체크
```
"위에서 생성한 [파일명]이 CheckBook_CodeSpec_v5.md의 
원칙을 따르는지 검토해줘:
- 네이밍 규칙
- 타입 안정성
- 에러 처리 패턴"
```

---

## 📝 참고 문서 인덱스

| 단계 | 주요 참고 문서 |
|------|---------------|
| 0–1 | CodeSpec: 환경 설정, 폴더 구조 |
| 2–3 | CodeSpec: API 규칙, 상태 관리 |
| 4–5 | CodeSpec: 훅 인터페이스, 컴포넌트 명세 |
| 6–7 | UIUX Plan: 사용자 플로우, 디자인 시스템 |
| 전체 | Project Plan: 비즈니스 로직, 데이터 모델 |

---

**작성:** 시니어 프론트엔드 개발자  
**버전:** 1.0  
**최종 수정:** 2025-10-21
