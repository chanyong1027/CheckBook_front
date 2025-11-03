# CheckBook 프론트엔드 개선 계획서

**작성일:** 2025-10-28
**최종 수정:** 2025-10-29
**버전:** 2.1
**목표:** API 연동 전 프론트엔드 완성도 향상 (localStorage 기반 프로토타입)

---

## 📊 전체 진행 현황

### ✅ 완료된 작업 (세션 1-9 + 추가 구현)

**기본 인프라:**

- 환경 설정, TypeScript strict mode, Tailwind CSS 디자인 시스템
- 타입 정의 (13개), 유틸리티 함수 (25개), 에러 클래스 (6개)
- API 모듈 (28개 함수), Zustand Store (2개), Custom Hooks (7개)
- UI 컴포넌트 (28개), 레이아웃 (Header/Footer)
- 라우팅 설정 완료 (React Router v6)

**페이지:**

- HomePage (Hero 섹션 + 베스트셀러 Mock 데이터)
- SearchResultPage (Mock 데이터 기반 검색)
- BookDetailPage (도서 상세 + 찜하기 + 내 서재에 추가 UI)
- MyLibraryPage (내 도서관 관리)
- MyPage (독서 기록, 차트)
- LoginPage, SignupPage (폼 검증 + Mock 회원가입/로그인)

**✨ 최근 완료 (2025-10-28):**

#### 1. **인증 상태 관리** ✅

- useAuth 훅 localStorage 기반으로 개선
- LoginPage/SignupPage Mock 로그인/회원가입
- Header 인증 상태 표시 (데스크톱 + 모바일)
- 로그아웃 기능 (클라이언트 전용, 토큰 삭제)
- 새로고침 후에도 로그인 유지
- **닉네임 저장 버그 수정** - 회원가입 시 입력한 닉네임이 localStorage에 제대로 저장되도록 수정

#### 2. **독서 상태 편집 기능** ✅

- BookStateEditModal 컴포넌트 생성
- 독서 상태, 별점, 메모, 시작일/완료일 입력 UI
- react-hook-form + zod 검증
- Zustand store에 저장 및 localStorage persist
- BookDetailPage에 모달 통합

#### 3. **검색 결과 Mock 데이터** ✅

- `src/utils/mockData.ts` 생성 (30개 도서 데이터)
- 실제 도서 정보 (제목, 저자, 출판사, ISBN, 설명, 별점)
- SearchResultPage에 Mock 검색 기능 적용
- HomePage 베스트셀러에 Mock 데이터 적용
- 유틸리티 함수: `findBookById`, `searchBooks`, `getBestsellers`, `getRandomBooks`

#### 4. **BookDetailPage UI 재디자인** ✅

- **찜하기 버튼** (하트 아이콘, 토글 기능)
- **내 서재에 추가 버튼** (노란색, 확장 패널)
- **BookShelfPanel 컴포넌트 신규 생성**
  - 탭: "읽고 있는 책" / "다 읽은 책"
  - 날짜 범위 선택 (시작일/종료일)
  - **커스텀 달력 UI** (월 단위, 날짜 선택 가능)
  - 별점 선택 (0-5점, 호버 효과)
  - 짧은 기록 입력 (textarea, 500자 제한)
- Mock 이미지를 `/example_image.png`로 통일 (public 폴더)
- 도서 정보 레이아웃 개선 (컴팩트한 디자인)

#### 5. **MyPage 차트 실제 데이터 연동** ✅ ⭐ NEW

- **mockData.ts에 category 필드 추가** (30개 전체 도서)
  - 컴퓨터/IT (6권), 자기계발 (7권), 소설 (4권), 과학 (3권), 역사 (2권), 심리학 (2권), 경제/경영 (1권), 인문·사회 (1권), 에세이 (2권)
- **장르별 통계 차트** - Zustand store의 완독 책 데이터 기반 계산
  - 상위 5개 장르 표시, 동적 색상 할당
  - Empty state (완독 책 없을 때)
- **월별 완독 현황 차트** - 최근 6개월 데이터 계산
  - endDate 기반 월별 카운트
  - Y축 자동 범위 조정 (최소 5)
- **도서 카드 그리드** - 실제 책 정보 표시
  - 책 제목, 저자, 표지 이미지, 별점
  - 클릭 시 상세 페이지 이동
- **최근 메모** - comment 필드 있는 책 3개 표시
  - updatedAt 기준 정렬
  - 별점, 메모 내용, 책 제목, 날짜 표시
- **평균 별점 계산** - 완독 책의 평균 별점 계산
- **Zustand 무한 루프 문제 해결**
  - MyPage에서 `allBookStates` 한 번만 구독
  - `useMemo`로 필터링 결과 메모이제이션
  - 배열 참조 안정화로 리렌더 최적화

---

**구현 위치:**

- `src/utils/mockData.ts` - 30개 Mock 도서 데이터 (category 필드 포함)
- `src/components/BookShelfPanel.tsx` - 내 서재 추가 패널 (달력, 별점, 기록)
- `src/pages/BookDetailPage.tsx` - UI 재디자인 및 패널 통합
- `src/pages/SearchResultPage.tsx` - Mock 검색 기능
- `src/pages/HomePage.tsx` - Mock 베스트셀러
- `src/pages/MyPage.tsx` - 실제 데이터 기반 차트 및 통계 (useMemo 패턴)
- `public/example_image.png` - 통일된 Mock 표지 이미지

**localStorage 키:**

- `checkbook_token` - JWT 토큰
- `checkbook_user` - 사용자 정보 (JSON)
- `checkbook_mock_users` - Mock 회원가입 데이터
- `book-state-storage` - 독서 상태 (Zustand persist)

---

## 🎯 미완료 작업 (우선순위별)

### **P0 (최우선)** 🔥

#### ✅ ~~1-4. 기본 기능 구현 완료~~ ✅

위의 "최근 완료" 섹션 참조

---

### **P1 (필수 개선)**

#### ✅ ~~1. **MyPage 차트 실제 데이터 연동**~~ ✅ **완료 (2025-10-29)**

**구현 완료:**

- ✅ mockData.ts에 모든 책 category 필드 추가
- ✅ 장르별 통계 계산 (상위 5개)
- ✅ 월별 완독 수 계산 (최근 6개월)
- ✅ 도서 카드에 실제 책 정보 표시
- ✅ 최근 메모 3개 표시
- ✅ 평균 별점 계산
- ✅ Zustand 무한 루프 문제 해결 (useMemo 패턴)

**핵심 구현:**

```typescript
// MyPage.tsx - useMemo 패턴으로 최적화
const allBookStates = useBookStateStore((state) => state.userBookStates);

const readBooks = useMemo(
  () => allBookStates.filter((item) => item.state === "READ"),
  [allBookStates]
);

const genreData = useMemo(() => {
  const genreCounts: Record<string, number> = {};
  readBooks.forEach((bookState) => {
    const book = findBookById(bookState.bookId);
    const category = book?.category || "기타";
    genreCounts[category] = (genreCounts[category] || 0) + 1;
  });
  // 상위 5개 반환...
}, [readBooks]);
```

**파일 수정:**

- `src/utils/mockData.ts` - 30개 책에 category 추가
- `src/pages/MyPage.tsx` - 실제 데이터 계산 로직 구현
- `public/example_image.png` - 이미지 경로 통일

---

#### ✅ ~~2. **MyLibraryPage 도서관 검색 Mock 구현**~~ ✅ **완료 (2025-10-29)**

**구현 완료:**

- ✅ Mock 도서관 데이터 15개 추가 (서울 지역 주요 도서관)
- ✅ 도서관 검색 로직 구현 (이름, 주소, 유형으로 검색)
- ✅ 이미 등록된 도서관 자동 제외 필터링
- ✅ 거리순 자동 정렬 (가까운 순)
- ✅ 검색 결과 없음 Empty State 추가
- ✅ 유틸리티 함수 4개 추가 (SOLID 원칙 준수)

**핵심 구현:**

```typescript
// src/utils/mockData.ts - 15개 도서관 데이터
export const MOCK_LIBRARIES: Library[] = [
  {
    id: 'lib-001',
    name: '국립중앙도서관',
    address: '서울특별시 서초구 반포대로 201',
    phone: '02-535-4142',
    homepage: 'https://www.nl.go.kr',
    distanceKm: 1.2,
    latitude: 37.5049,
    longitude: 127.0371,
    openingHours: '평일 09:00-21:00, 주말 09:00-18:00',
    closedDays: '매주 월요일, 공휴일',
    type: '국립',
  },
  // ... 나머지 14개 도서관
];

// 유틸리티 함수
export const searchLibraries = (query: string): Library[] => {
  // 이름, 주소, 유형으로 검색
};
export const sortLibrariesByDistance = (libraries: Library[]): Library[];
export const findLibraryById = (id: string): Library | undefined;
export const getLibrariesByRegion = (region: string): Library[];

// src/pages/MyLibraryPage.tsx - 검색 로직
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;

  setIsSearching(true);
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // 1. 검색어로 필터링
    const filteredLibraries = searchLibraries(searchQuery);

    // 2. 이미 등록된 도서관 제외
    const availableLibraries = filteredLibraries.filter(
      (library) => !myLibraries.some((myLib) => myLib.id === library.id)
    );

    // 3. 거리순 정렬
    const sortedLibraries = sortLibrariesByDistance(availableLibraries);

    setSearchResults(sortedLibraries);
  } catch (error) {
    console.error('검색 오류:', error);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};
```

**파일 수정:**

- `src/utils/mockData.ts` - Mock 도서관 15개 + 유틸리티 함수 4개 추가
- `src/pages/MyLibraryPage.tsx` - 검색 로직 구현 및 Empty State 추가

**SOLID 원칙 준수:**

- **Single Responsibility**: 각 함수가 단일 책임 (검색, 정렬, 필터링 분리)
- **Open/Closed**: searchLibraries 함수로 확장 가능
- **Dependency Inversion**: Mock 함수를 추상화하여 의존성 역전

---

#### 3. **드래그 앤 드롭 순서 변경**

**문제:**

- MyLibraryPage에서 도서관 순서 변경 UI 없음

**구현 필요:**

```typescript
// @dnd-kit 라이브러리 설치
// npm install @dnd-kit/core @dnd-kit/sortable

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// SortableLibraryCard 컴포넌트
const SortableLibraryCard = ({ library }: { library: Library }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: library.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LibraryCard library={library} />
    </div>
  );
};

// MyLibraryPage에서 사용
const handleDragEnd = (event) => {
  const { active, over } = event;

  if (active.id !== over.id) {
    const oldIndex = myLibraries.findIndex(lib => lib.id === active.id);
    const newIndex = myLibraries.findIndex(lib => lib.id === over.id);

    const newOrder = arrayMove(myLibraries, oldIndex, newIndex);
    reorderLibraries(newOrder);
  }
};
```

**예상 작업 시간:** 2-3시간

**파일 수정:**

- `package.json` - @dnd-kit 패키지 추가
- `src/pages/MyLibraryPage.tsx` - 드래그 앤 드롭 로직 추가

---

### **P2 (추가 개선)**

#### 7. **페이지 전환 애니메이션** (Framer Motion 활용)

```typescript
// src/components/PageTransition.tsx
import { motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// App.tsx에서 사용
<Route path="/" element={
  <PageTransition>
    <HomePage />
  </PageTransition>
} />
```

**예상 작업 시간:** 1시간

---

#### 8. **Toast 알림 적용** (독서 상태 변경 시)

```typescript
// BookDetailPage.tsx
const handleStateChange = (state: ReadingState) => {
  setBookState({
    bookId,
    state,
    // ...
  });

  const messages = {
    WISHLIST: "찜 목록에 추가했습니다!",
    READING: "읽는 중인 책으로 등록했습니다!",
    READ: "완독 목록에 추가했습니다!",
  };

  toast.success(messages[state]);
};
```

**예상 작업 시간:** 30분

---

#### 9. **반응형 디자인 검증** (모바일/태블릿)

- 모바일 브레이크포인트 (≤ 768px) 테스트
- 태블릿 브레이크포인트 (769-1024px) 테스트
- 터치 이벤트 최적화

**예상 작업 시간:** 1-2시간

---

#### 10. **접근성 개선** (키보드 네비게이션)

- Tab 키로 모든 인터랙티브 요소 접근 가능
- Enter/Space 키로 버튼 동작
- Escape 키로 모달 닫기

**예상 작업 시간:** 1시간

---

## 🚀 추천 작업 순서 (우선순위별)

### **Week 1: 핵심 기능 완성 (5-7일)**

#### Day 1-2: 독서 상태 편집 기능 📍 **최우선!**

```
✅ BookStateEditModal 컴포넌트 생성
✅ 별점 선택 UI
✅ 메모/리뷰 입력
✅ 날짜 선택 (시작일/완료일)
✅ Zustand store 연동
✅ Toast 알림 추가
```

#### Day 3: 검색 결과 Mock 데이터

```
✅ Mock 도서 데이터 20-30개 생성
✅ SearchResultPage에 필터링 로직 추가
✅ 최근 검색어 저장 (localStorage)
✅ "검색 결과 없음" Empty State
```

#### ✅ ~~Day 4: MyPage 차트 실제 데이터 연동~~ ✅ **완료**

```
✅ 장르별 통계 계산 로직
✅ 월별 완독 수 계산 로직
✅ Mock 데이터 제거
✅ 도서 카드 실제 데이터 표시
✅ 최근 메모 표시
✅ 평균 별점 계산
✅ Zustand 무한 루프 해결
```

#### Day 5-6: MyLibraryPage 도서관 검색

```
✅ Mock 도서관 데이터 10-15개 생성
✅ 검색 로직 구현
✅ 도서관 추가/삭제 테스트
```

#### Day 7: 드래그 앤 드롭 순서 변경

```
✅ @dnd-kit 패키지 설치
✅ SortableLibraryCard 컴포넌트 생성
✅ 순서 변경 로직 구현
```

---

### **Week 2: UX 개선 (3-4일)**

#### Day 8: 페이지 전환 애니메이션

```
✅ PageTransition 컴포넌트 생성
✅ 모든 페이지에 적용
```

#### Day 9: Toast 알림 통합

```
✅ 독서 상태 변경 시 Toast
✅ 도서관 추가/삭제 시 Toast
✅ 로그인/로그아웃 시 Toast (이미 완료)
```

#### Day 10-11: 반응형 & 접근성 검증

```
✅ 모바일 테스트
✅ 태블릿 테스트
✅ 키보드 네비게이션 테스트
```

---

## 📋 체크리스트 (전체 진행 상황)

### 인증 (Auth)

- [x] 로그인/회원가입 UI
- [x] useAuth 훅 (localStorage 기반)
- [x] Header 인증 상태 표시
- [x] 로그아웃 기능
- [ ] Protected Route (로그인 필요 페이지)

### 도서 검색 (Book Search)

- [x] SearchResultPage UI
- [x] Mock 도서 데이터 추가 (30개)
- [x] 검색 필터링 로직
- [ ] 최근 검색어 저장

### 도서 상세 (Book Detail)

- [x] BookDetailPage UI
- [x] 독서 상태 편집 패널 (BookShelfPanel)
- [x] 별점 선택 UI
- [x] 리뷰 입력 UI
- [x] 커스텀 달력 UI

### 독서 기록 (My Page)

- [x] MyPage UI (탭 구조)
- [x] 차트 실제 데이터 연동 ✅
- [x] 장르별 통계 계산 ✅
- [x] 월별 완독 수 계산 ✅
- [x] 도서 카드 실제 데이터 표시 ✅
- [x] 최근 메모 표시 ✅
- [x] 평균 별점 계산 ✅

### 도서관 관리 (My Library)

- [x] MyLibraryPage UI
- [x] Mock 도서관 데이터 추가 (15개) ✅
- [x] 도서관 검색 로직 ✅
- [x] 이미 등록된 도서관 제외 ✅
- [x] 거리순 정렬 ✅
- [x] 검색 결과 Empty State ✅
- [ ] 드래그 앤 드롭 순서 변경

### UX 개선

- [ ] 페이지 전환 애니메이션
- [x] Toast 알림 (로그인/로그아웃 완료)
- [ ] Toast 알림 (독서 상태 변경)
- [ ] 반응형 디자인 검증
- [ ] 접근성 개선

---

## 🎯 MVP 완성 기준

**필수 기능 (P0):**

- [x] 인증 상태 관리 ✅
- [x] 독서 상태 편집 ✅
- [x] 검색 결과 표시 ✅

**권장 기능 (P1):**

- [x] 차트 실제 데이터 ✅
- [x] 도서관 검색 ✅
- [ ] 순서 변경

**추가 기능 (P2):**

- [ ] 애니메이션
- [ ] Toast 알림
- [ ] 접근성

---

## 💡 다음 작업 추천

### 📍 **우선순위 1: 드래그 앤 드롭 순서 변경 (P1 마지막 작업)**

**이유:**

- P0 전체 완료, P1 2/3 완료
- 사용자 경험 개선을 위한 마지막 P1 기능
- MyLibraryPage 도서관 순서 변경 기능

**시작 방법:**

```bash
# 1. @dnd-kit 패키지 설치
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# 2. SortableLibraryCard 컴포넌트 생성
src/components/SortableLibraryCard.tsx

# 3. MyLibraryPage에 드래그 앤 드롭 로직 통합
src/pages/MyLibraryPage.tsx 수정
```

**예상 완료 시간:** 2-3시간

---

### 📍 **우선순위 2: UX 개선 (P2)**

P1 완료 후 다음 단계:

- 페이지 전환 애니메이션 (Framer Motion)
- Toast 알림 확장 (독서 상태 변경, 도서관 추가/삭제)
- 반응형 디자인 검증
- 키보드 네비게이션 접근성

---

## 📚 참고 문서

- `docs/Summary.md` - 프로젝트 전체 개요
- `docs/reference/CheckBook_CodeSpec_v5.md` - 코딩 규칙
- `docs/reference/CheckBook_Project_Plan.md` - 기획서
- `CHECKPOINTS.md` - 세션별 검증 기록
- `Session5_Summary.md` - 세션 1-5 요약
- `Session7_Summary.md` - 세션 6-7 요약

---

**작성자:** Claude Code
**최종 수정:** 2025-10-29
**프로젝트 상태:** P0 작업 3/3 완료 ✅ | P1 작업 2/3 완료 (차트, 도서관 검색 완료)
