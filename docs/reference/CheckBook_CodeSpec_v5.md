# 📘 CheckBook Frontend CodeSpec v3 (Stable & Maintainable Edition)

> **작성자:** 시니어 프론트엔드 개발자 관점  
> **목표:** CheckBook 프로젝트의 코드 일관성, 환경 독립성, 유지보수성을 강화한 AI-Friendly & 팀 협업 최적 버전.  
> **주요 개선점:** 환경 변수 분리(.env), constants.ts 구체화, 커스텀 훅 인터페이스 정의 추가.

---

## 1️⃣ 프로젝트 개요

**프로젝트명:** CheckBook  
**설명:**  
도서 검색 → 근처 도서관의 소장/대출 가능 여부 확인 → 독서 상태(찜/읽는 중/완독) 기록 및 리뷰 관리까지 가능한 웹 애플리케이션.

**핵심 기술 스택**

- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (로컬 상태)
- React Query (서버 상태)
- Axios (API 연동)
- React Router v6
- React Hook Form + Zod (검증)
- Toastify (피드백)
- Framer Motion (애니메이션)

---

## 2️⃣ 환경 변수 및 설정 관리 (.env)

실제 개발 및 배포 환경에서 **API 주소를 하드코딩하지 않도록 환경 변수로 분리**합니다.

### 🔐 환경 변수 구성

**루트 디렉터리에 `.env.local`, `.env.production` 생성:**

```env
# 개발 환경
VITE_API_BASE_URL=http://localhost:8080

# 배포 환경
VITE_API_BASE_URL=https://api.checkbook.app
```

**Axios 인스턴스 설정 (`src/api/index.ts`):**

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

> **원칙:** baseURL은 환경 변수로만 관리하고, 절대 하드코딩하지 않는다.

---

## 3️⃣ 폴더 구조

```bash
src/
 ┣ api/
 ┃ ┣ books.ts
 ┃ ┣ libraries.ts
 ┃ ┣ user.ts
 ┃ ┗ index.ts
 ┣ components/
 ┃ ┣ BookCard.tsx
 ┃ ┣ LibraryCard.tsx
 ┃ ┣ ReviewModal.tsx
 ┃ ┣ LibrarySelector.tsx
 ┃ ┣ StatusToggle.tsx
 ┃ ┗ Layout/
 ┃    ┣ Header.tsx
 ┃    ┗ Footer.tsx
 ┣ hooks/
 ┃ ┣ useBookSearch.ts
 ┃ ┣ useUserLibrary.ts
 ┃ ┗ useAuth.ts
 ┣ pages/
 ┃ ┣ HomePage.tsx
 ┃ ┣ SearchResultPage.tsx
 ┃ ┣ BookDetailPage.tsx
 ┃ ┣ MyLibraryPage.tsx
 ┃ ┗ MyPage.tsx
 ┣ store/
 ┃ ┣ useLibraryStore.ts
 ┃ ┗ useBookStateStore.ts
 ┣ types/
 ┃ ┣ book.ts
 ┃ ┣ library.ts
 ┃ ┗ user.ts
 ┣ utils/
 ┃ ┣ constants.ts
 ┃ ┣ formatters.ts
 ┃ ┗ helpers.ts
 ┣ App.tsx
 ┣ main.tsx
 ┗ index.css
```

## 4️⃣ 라우팅 구조

| 경로                 | 페이지           | 설명                                  |
| -------------------- | ---------------- | ------------------------------------- |
| `/`                  | HomePage         | 검색창 + 내 도서관 요약               |
| `/search?q=`         | SearchResultPage | 검색 결과 리스트 (무한스크롤 포함)    |
| `/book/:id`          | BookDetailPage   | 도서 상세 + 도서관 가용성 + 상태/리뷰 |
| `/mylibrary`         | MyLibraryPage    | 내 도서관 관리                        |
| `/mypage`            | MyPage           | 나의 독서 상태(찜/읽는 중/완독 탭)    |
| `/signin`, `/signup` | AuthPage         | 회원 인증                             |

> **AI-Friendly Tip:** 페이지 경로와 동일한 파일명을 `pages/` 폴더 내에 생성할 것.

---

## 4️⃣ constants.ts 구체화

**utils/constants.ts**

```ts
export const QUERY_KEYS = {
  BOOKS_SEARCH: "booksSearch",
  BOOK_DETAIL: "bookDetail",
  USER_LIBRARIES: "userLibraries",
  USER_BOOK_STATE: "userBookState",
};

export const API_PATHS = {
  SEARCH_BOOKS: "/api/books/search",
  BOOK_DETAIL: (id: string) => `/api/books/${id}`,
  BOOK_AVAILABILITY: (id: string) => `/api/books/${id}/availability`,
  USER_LIBRARIES: "/api/me/libraries",
  USER_BOOK_STATE: (bookId: string) => `/api/me/books/${bookId}/state`,
};

export const DEFAULT_SEARCH_RADIUS_KM = 5;
export const MAX_MY_LIBRARIES = 3;
```

> **원칙:** 문자열 상수를 중앙화해 유지보수성과 자동완성 지원을 극대화한다.

---

## 5️⃣ TypeScript 타입 정의

```ts
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  pubYear: number;
  isbn13: string;
  coverUrl?: string;
  rating?: number;
  availability?: "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN";
}

export interface Library {
  id: string;
  name: string;
  address: string;
  phone?: string;
  homepage?: string;
  distanceKm?: number;
  available?: boolean;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
}

export interface UserBookState {
  bookId: string;
  state: "WISHLIST" | "READING" | "READ";
  rating?: number;
  comment?: string;
  startDate?: string;
  endDate?: string;
}
```

---

## 6️⃣ 커스텀 훅 명세 (Custom Hooks)

### 🔍 useBookSearch.ts

```ts
/**
 * @param keyword - 검색어
 * @returns {
 *  data: Book[],
 *  isLoading: boolean,
 *  isError: boolean,
 *  fetchNextPage: () => void,
 *  hasNextPage: boolean
 * }
 * @description React Query의 useInfiniteQuery 기반으로 구현.
 */
export function useBookSearch(keyword: string) { ... }
```

### 🏛 useUserLibrary.ts

```ts
/**
 * @returns {
 *  libraries: Library[],
 *  addLibrary: (lib: Library) => void,
 *  removeLibrary: (id: string) => void
 * }
 * @description Zustand store(useLibraryStore)와 연동하여
 * '내 도서관' CRUD를 관리한다.
 */
export function useUserLibrary() { ... }
```

### 🔐 useAuth.ts

```ts
/**
 * @returns {
 *  user: User | null,
 *  signin: (email: string, pw: string) => Promise<void>,
 *  signout: () => void
 * }
 * @description JWT 기반 인증 로직을 처리한다.
 */
export function useAuth() { ... }
```

> **원칙:** 훅의 입출력 인터페이스를 문서화하여 AI/협업 시 오해를 방지한다.

---

## 7️⃣ 상태 관리 (Zustand Stores)

### 🏛 useLibraryStore.ts

```ts
import { create } from "zustand";
import { Library } from "@/types/library";

interface LibraryStore {
  myLibraries: Library[];
  addLibrary: (library: Library) => void;
  removeLibrary: (id: string) => void;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  myLibraries: [],
  addLibrary: (library) =>
    set((s) => ({ myLibraries: [...s.myLibraries, library].slice(-3) })),
  removeLibrary: (id) =>
    set((s) => ({ myLibraries: s.myLibraries.filter((l) => l.id !== id) })),
}));
```

### 📚 useBookStateStore.ts

```ts
import { create } from "zustand";
import { UserBookState } from "@/types/user";

interface BookStateStore {
  userBookStates: UserBookState[];
  setBookState: (state: UserBookState) => void;
}

export const useBookStateStore = create<BookStateStore>((set) => ({
  userBookStates: [],
  setBookState: (state) =>
    set((s) => {
      const filtered = s.userBookStates.filter(
        (b) => b.bookId !== state.bookId
      );
      return { userBookStates: [...filtered, state] };
    }),
}));
```

> **원칙:** 단일 책임 원칙(SRP)을 유지하고, 불변성 기반 상태 업데이트만 허용.

---

## 8️⃣ API 로딩/에러 처리 정책

모든 React Query 기반 API는 다음 3단계 상태를 처리해야 함.

| 상태            | 처리 방식                                      |
| --------------- | ---------------------------------------------- |
| **로딩 중**     | Skeleton UI or Spinner 표시 (`isLoading`)      |
| **에러**        | Toast + Retry 버튼 (`isError`)                 |
| **데이터 없음** | Empty State 컴포넌트 (“검색 결과가 없습니다.”) |

```tsx
const { data, isLoading, isError, refetch } = useQuery(
  [QUERY_KEYS.BOOKS_SEARCH, keyword],
  () => fetchBooks(keyword)
);

if (isLoading) return <SkeletonList />;
if (isError) return <ErrorState retry={refetch} />;
if (!data?.length) return <EmptyState message="검색 결과가 없습니다." />;
```

> **원칙:** 모든 페이지(Search, Detail, Library)는 동일한 상태 UX 패턴을 유지.

---

## 9️⃣ 빌드 환경 및 명령어

**개발 환경**

- Node.js ≥ 20
- pnpm (권장)
- ESLint + Prettier + Husky(커밋 훅)
- Tailwind CSS 3
- React 18 + Vite 5

**명령어**

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm format
```

---

## 🔟 유지보수 원칙 (Anti-Pattern 방지)

| 항목      | 안티패턴               | 권장 패턴                   |
| --------- | ---------------------- | --------------------------- |
| 상태 관리 | 전역 store 남용        | 도메인별 분리               |
| API 호출  | useEffect 내부 호출    | React Query로 통합          |
| Props     | any 사용               | 명시적 인터페이스 정의      |
| 상수      | 문자열 하드코딩        | constants.ts 관리           |
| 스타일    | 무의미한 Tailwind 혼합 | Design System 규칙 준수     |
| 컴포넌트  | UI/로직 혼재           | hooks + presentational 분리 |
| 상태 변경 | setState 중첩          | 함수형 업데이트만 사용      |

## 11️⃣ 컴포넌트 명세 예시

### 📘 BookCard.tsx

```tsx
interface BookCardProps {
  book: Book;
  onClick: (id: string) => void;
}

export const BookCard = ({ book, onClick }: BookCardProps) => (
  <div
    onClick={() => onClick(book.id)}
    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex gap-4"
  >
    <img
      src={book.coverUrl ?? "/placeholder.png"}
      alt={book.title}
      className="w-24 h-36 object-cover rounded-md"
    />
    <div className="flex flex-col justify-between flex-1">
      <div>
        <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <p className="text-xs text-gray-400">
          {book.publisher} · {book.pubYear}
        </p>
      </div>
      <div className="text-sm flex items-center gap-2">
        {book.availability === "AVAILABLE" ? (
          <span className="text-green-500 font-medium">● 대출 가능</span>
        ) : book.availability === "UNAVAILABLE" ? (
          <span className="text-gray-400">● 대출 중</span>
        ) : (
          <span className="text-gray-300">● 확인 중</span>
        )}
      </div>
    </div>
  </div>
);
```

### 🏛 LibraryCard.tsx

```tsx
interface LibraryCardProps {
  library: Library;
}

export const LibraryCard = ({ library }: LibraryCardProps) => (
  <div className="bg-white rounded-xl shadow-sm p-3 hover:shadow-md transition flex justify-between items-center">
    <div>
      <h4 className="font-semibold text-gray-800">{library.name}</h4>
      <p className="text-xs text-gray-500">{library.address}</p>
      {library.distanceKm && (
        <p className="text-xs text-gray-400 mt-1">
          📍 {library.distanceKm.toFixed(1)}km
        </p>
      )}
    </div>
    <div>
      {library.available ? (
        <span className="text-green-500 font-semibold">대출 가능</span>
      ) : (
        <span className="text-gray-400">확인 중</span>
      )}
    </div>
  </div>
);
```

> **원칙:** 모든 카드형 컴포넌트는 동일한 Tailwind spacing scale과 hover 효과를 따른다.

---

## 12️⃣ Design System Guideline

| 항목              | 기준                               | 설명                            |
| ----------------- | ---------------------------------- | ------------------------------- |
| **Spacing**       | 4, 8, 16, 24                       | UI 요소 간 일관된 여백 유지     |
| **Border Radius** | 6, 12, 16px                        | 카드/버튼 둥근 모서리 규격 통일 |
| **Typography**    | Pretendard / Noto Sans KR          | 본문 및 헤딩 스타일             |
| **Color System**  | Primary: #3563E9, Neutral: #E5E7EB | 접근성 4.5:1 이상               |
| **Shadow**        | Tailwind `shadow-sm/md`            | Depth 표현 통일                 |

> **원칙:** UI 상수(`UI.SPACING`, `UI.RADIUS`)는 모든 컴포넌트에 공통 적용되어야 한다.

## 🤖 AI 코드 생성 지침

> **AI-Friendly 기준:** 이 문서는 AI가 자동으로 일관된 React 코드를 생성할 수 있도록 설계됨.

| 항목                | 규칙                                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| **훅 생성**         | 새 훅은 반드시 `use` 접두사로 시작한다.                                 |
| **API 호출 훅**     | React Query 기반으로 구현하고, queryKey는 `QUERY_KEYS`에서 참조한다.    |
| **Zustand Store**   | 항상 `useXXXStore` 형태로 export하며, 단일 책임만 가진다.               |
| **Form Validation** | React Hook Form + Zod 조합만 사용한다.                                  |
| **디자인 일관성**   | Tailwind spacing과 radius는 `UI` 상수를 따른다.                         |
| **라우팅 규칙**     | `pages` 폴더의 파일명은 라우트 경로를 그대로 반영한다.                  |
| **에러 처리**       | `isLoading`, `isError`, `EmptyState` 3단계 상태 패턴을 반드시 구현한다. |
| **Props 설계**      | 모든 컴포넌트의 Props는 명시적 인터페이스로 정의한다.                   |

---

## ✅ 요약

이 v3 버전은 AI와 인간 개발자 모두를 위한 **안정적 코드 아키텍처의 기준선**입니다.

- `.env`로 환경 독립성 확보
- constants.ts로 상수 일원화
- Custom Hook 인터페이스 명세로 자동 생성 정확도 향상
- Zustand + React Query의 상태 책임 명확화
- 유지보수성 중심의 안티패턴 차단 구조

> “코드는 단순히 동작해야 하는 게 아니라, **예측 가능하게 유지되어야 한다.**”  
> — 시니어 프론트엔드 개발자, CheckBook v3 설계 주석
