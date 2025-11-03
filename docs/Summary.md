# CheckBook 프로젝트 백엔드-프론트엔드 연동 분석 요약

**작성일**: 2025-10-23
**분석 범위**: BookProject (백엔드 Spring Boot) ↔ frontEnd (React + TypeScript)

---

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [백엔드 현황](#백엔드-현황)
3. [프론트엔드 현황](#프론트엔드-현황)
4. [연동 가능성 분석](#연동-가능성-분석)
5. [완성된 점](#완성된-점)
6. [부족한 점](#부족한-점)
7. [우선순위별 개선 과제](#우선순위별-개선-과제)

---

## 프로젝트 개요

### 핵심 가치 제안
- **도서 검색 통합**: 알라딘 API 연동으로 도서 검색
- **도서관 가용성 확인**: 정보나루 API로 근처 도서관의 소장/대출 가능 여부 조회
- **독서 기록 관리**: 찜/읽는 중/완독 상태 관리 + 별점/리뷰

### 기술 스택
**백엔드**: Spring Boot + JPA + Spring Security + JWT
**프론트엔드**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand + React Query

---

## 백엔드 현황

### ✅ 구현 완료 API

#### 1. 사용자 인증 (`UserController`)
- `POST /api/users/register` - 회원가입
- `POST /api/users/login` - 로그인 (JWT 발급)
- `GET /api/users/check-email` - 이메일 중복 확인
- `GET /api/users/check-username` - 닉네임 중복 확인
- `GET /api/users/{id}` - 사용자 정보 조회
- `PUT /api/users/{id}` - 사용자 정보 수정
- `DELETE /api/users/{id}` - 회원 탈퇴

#### 2. 도서 검색 (`BookController`)
- `GET /api/books/search?query=&page=&size=` - 도서 검색 (페이지네이션)
- `GET /api/books/detail/{isbn}` - 도서 상세 정보
- `GET /api/books/bestsellers` - 베스트셀러 조회
- `GET /api/books/new-releases` - 신간 조회
- `POST /api/books/search/libraries` - 특정 도서의 주변 도서관 소장 여부 확인

#### 3. 도서관 (`LibraryController`)
- `GET /api/libraries/search?latitude=&longitude=&distance=` - 근처 도서관 검색
- `GET /api/libraries/{d4lLibCode}/availability?isbn=` - 특정 도서관의 도서 대출 가능 여부
- `POST /api/libraries/{libraryId}/my-library` - 내 도서관 추가
- `GET /api/libraries/my-library` - 내 도서관 목록 조회
- `DELETE /api/libraries/{libraryId}/my-library` - 내 도서관 삭제
- `GET /api/libraries/book-status?isbn=&region=` - 지역별 도서관 소장 상태

#### 4. 독서 기록 (`BookRecordController`)
- `POST /api/records` - 내 서재에 책 추가
- `GET /api/records/my?status=` - 내 서재 조회 (상태별 필터링)
- `GET /api/records/{recordId}` - 특정 기록 조회
- `GET /api/records/book/{isbn}` - 특정 도서의 내 기록 조회
- `PATCH /api/records/{recordId}` - 독서 상태 수정
- `PUT /api/records/{recordId}/review` - 리뷰 및 평점 수정
- `DELETE /api/records/{recordId}` - 서재에서 삭제

### 🔴 백엔드 미완료/문제점

#### P0 (긴급 수정 필요)
1. **리뷰 API 버그** - JWT UserDetails 캐스팅 오류
2. **로그아웃 API 부재** - JWT 블랙리스트 처리 없음
3. **카카오 API 키 노출** - 하드코딩된 API 키 (보안 문제)
4. **도서 상세 응답 불완전** - 도서관 가용성 정보 미포함

#### P1 (필수 개선)
1. **내 도서관 최대 3개 제한** - 검증 로직 부재
2. **사용자 프로필 위치 정보** - 기본 위치/반경 설정 미구현
3. **테스트 코드 부재** - `src/test/java` 비어있음

---

## 프론트엔드 현황

### ✅ 구현 완료 페이지

#### 1. 인증 페이지
- **LoginPage** (`/login`)
  - React Hook Form + Zod 검증
  - 이메일/비밀번호 입력
  - 에러 메시지 표시

- **SignupPage** (`/signup`)
  - 이메일/닉네임/비밀번호/비밀번호 확인
  - 비밀번호 패턴 검증 (영문+숫자)
  - 비밀번호 일치 확인

#### 2. 메인 페이지
- **HomePage** (`/`)
  - Hero 섹션 (2열 레이아웃, 노란색-핑크 그라데이션)
  - 베스트셀러 섹션 (6개 도서 그리드, 페이지네이션)
  - Mock 데이터 사용 중

#### 3. 마이페이지
- **MyPage** (`/mypage`)
  - 장르 통계 차트 (Pie Chart)
  - 월별 독서 기록 차트 (Bar Chart)
  - 독서 상태별 탭 (찜/읽는 중/완독)
  - 4열 도서 그리드
  - 우측 사이드바 (키워드, 최근 메모)
  - Mock 데이터 사용 중

#### 4. 기타 페이지 (스켈레톤)
- SearchResultPage (`/search`)
- BookDetailPage (`/book/:id`)
- MyLibraryPage (`/mylibrary`)

#### 5. 레이아웃 컴포넌트
- **Header** - 로고(홈 리다이렉트), 검색바, 로그인/회원가입 버튼
- **Footer** - 하단 정보

### 🔴 프론트엔드 미완료/문제점

#### P0 (긴급 구현 필요)
1. **API 연동 부재** - 모든 페이지가 Mock 데이터 사용
2. **인증 상태 관리 미구현** - JWT 저장/관리 로직 없음
3. **핵심 페이지 미완성**:
   - SearchResultPage (도서 검색 결과)
   - BookDetailPage (도서 상세 + 도서관 가용성)
   - MyLibraryPage (내 도서관 관리)

#### P1 (필수 구현)
1. **Axios 인스턴스 설정** - JWT 인터셉터 미구현
2. **에러 처리 통합** - 글로벌 에러 핸들러 부재
3. **로딩 상태 관리** - Suspense/ErrorBoundary 미적용

---

## 연동 가능성 분석

### ✅ 연동 준비 완료 항목

#### 1. 회원가입/로그인
**백엔드**:
- `POST /api/users/register`
- `POST /api/users/login`

**프론트엔드**:
- LoginPage, SignupPage 완성
- React Hook Form + Zod 검증 구현

**연동 작업**:
- API 호출 추가 (axios)
- JWT 토큰 localStorage 저장
- 로그인 후 홈으로 리다이렉트

#### 2. 내 도서관 관리 기능
**백엔드**:
- `GET /api/libraries/my-library`
- `POST /api/libraries/{libraryId}/my-library`
- `DELETE /api/libraries/{libraryId}/my-library`

**프론트엔드**:
- MyLibraryPage 라우팅 준비됨

**연동 작업**:
- MyLibraryPage UI 구현
- CRUD API 호출 추가

#### 3. 독서 기록 관리
**백엔드**:
- `GET /api/records/my?status=`
- `PATCH /api/records/{recordId}`

**프론트엔드**:
- MyPage 탭 구조 완성 (찜/읽는 중/완독)

**연동 작업**:
- Mock 데이터 → 실제 API 호출로 대체
- 상태 변경 API 연동

### 🔶 부분 연동 가능

#### 도서 검색
**백엔드**: `GET /api/books/search?query=&page=&size=`
**프론트엔드**: Header 검색바, SearchResultPage 스켈레톤

**필요 작업**:
- SearchResultPage UI 완성
- 무한 스크롤 구현 (React Query useInfiniteQuery)
- BookCard 컴포넌트 연동

#### 베스트셀러
**백엔드**: `GET /api/books/bestsellers`
**프론트엔드**: HomePage 베스트셀러 섹션 (Mock 데이터)

**필요 작업**:
- Mock 데이터 제거
- API 호출로 대체
- 에러/로딩 처리

### ❌ 연동 불가 (백엔드 문제)

#### 도서 상세 + 도서관 가용성
**문제**: 백엔드 API가 도서관 가용성 정보를 도서 상세 응답에 포함하지 않음

**백엔드 수정 필요**:
```java
// 현재: GET /api/books/detail/{isbn} - 도서 정보만 반환
// 필요: 도서 정보 + 내 도서관 우선 + 근처 도서관 가용성
```

**해결 방안**:
1. 도서 상세 API에 가용성 정보 통합
2. 또는 프론트에서 2개 API 병렬 호출
   - `GET /api/books/detail/{isbn}`
   - `POST /api/books/search/libraries`

---

## 완성된 점

### 🎨 프론트엔드 디자인 시스템
✅ **색상 팔레트 일관성**
- Primary: `#F7B731` (노란색)
- Secondary: `#FFF8E7` (연한 노란색)
- Accent: `#FF6B9D` (핑크)

✅ **컴포넌트 스타일 통일**
- rounded-xl, shadow-sm/md
- hover/focus 트랜지션
- 반응형 그리드 (1/2/3/4/6열)

✅ **타이포그래피 & 레이아웃**
- Tailwind 기반 일관된 spacing
- Header/Footer 레이아웃 구조

### 🔐 백엔드 인증 시스템
✅ **JWT 기반 인증**
- Spring Security + JwtTokenProvider
- 회원가입/로그인 API 완성
- SecurityConfig로 엔드포인트 보호

✅ **도메인 모델 완성도**
- User, Book, Library, BookRecord 엔티티
- JPA 관계 설정 (ManyToOne, OneToMany)
- ReadStatus Enum (Wishlist, Reading, Completed)

### 📚 핵심 기능 백엔드 구현
✅ **도서 검색 & 외부 API 연동**
- 알라딘 API 검색/상세/베스트셀러
- 검색 결과 캐싱

✅ **도서관 좌표 기반 검색**
- PostGIS 지원 (좌표 기반 거리 계산)
- 정보나루 API 연동

✅ **독서 기록 CRUD**
- 상태 전환 로직 (Reading → Completed 시 자동 날짜)
- 별점/리뷰 저장

---

## 부족한 점

### 🔴 P0 (즉시 해결 필요)

#### 프론트엔드
1. **API 연동 전무**
   - 모든 페이지가 Mock 데이터
   - Axios 인스턴스 미생성
   - React Query 설정만 존재, 실제 사용 없음

2. **인증 흐름 미완성**
   - JWT 저장/관리 로직 없음
   - 로그인 후 상태 관리 없음
   - Protected Route 미구현

3. **핵심 페이지 미구현**
   - SearchResultPage (빈 스켈레톤)
   - BookDetailPage (가장 중요, 구현 0%)
   - MyLibraryPage (빈 스켈레톤)

#### 백엔드
1. **로그아웃 API 부재**
   - JWT 블랙리스트 없음
   - Refresh Token 로직 없음

2. **도서 상세 API 불완전**
   - 도서관 가용성 정보 미포함
   - 내 도서관 우선 정렬 없음

3. **보안 취약점**
   - 카카오 API 키 하드코딩
   - 환경 변수 미사용

### 🔶 P1 (필수 개선)

#### 프론트엔드
1. **상태 관리 미활용**
   - Zustand store 정의만 있고 사용 안 함
   - `useBookStateStore`, `useLibraryStore` 연동 필요

2. **에러 처리 부재**
   - Toast 알림만 설정, 실제 사용 없음
   - ErrorBoundary 없음
   - Retry 로직 없음

3. **성능 최적화 미적용**
   - 이미지 lazy loading 없음
   - 무한 스크롤 미구현
   - Code splitting 없음

#### 백엔드
1. **비즈니스 로직 검증 부족**
   - 내 도서관 3개 제한 검증 없음
   - 중복 기록 방지 로직 없음

2. **테스트 코드 전무**
   - 단위 테스트 0%
   - 통합 테스트 0%

### 🔷 P2 (추후 개선)

1. **접근성 (a11y)**
   - ARIA 라벨 부분적
   - 키보드 네비게이션 미검증

2. **반응형 테스트**
   - 모바일 실기기 테스트 필요

3. **SEO**
   - meta 태그 미설정
   - OG 이미지 없음

---

## 우선순위별 개선 과제

### 🔥 Phase 1: 핵심 연동 (1-2주)

#### 1.1 인증 흐름 완성
**백엔드**:
- [ ] 로그아웃 API 구현 (`POST /api/users/logout`)
- [ ] Refresh Token 로직 추가

**프론트엔드**:
- [ ] Axios 인스턴스 생성 (`src/api/index.ts`)
  ```typescript
  import axios from 'axios';

  export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  // JWT 인터셉터
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```

- [ ] 로그인/회원가입 API 연동
  - `LoginPage.tsx:31` - API 호출 추가
  - `SignupPage.tsx:31` - API 호출 추가
  - JWT 저장 (localStorage)

- [ ] useAuth 커스텀 훅 구현
  ```typescript
  // src/hooks/useAuth.ts
  export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    const signin = async (email: string, password: string) => {
      const response = await api.post('/api/users/login', { userEmail: email, userPw: password });
      localStorage.setItem('accessToken', response.data.jwtToken);
      setUser(response.data);
    };

    const signout = () => {
      localStorage.removeItem('accessToken');
      setUser(null);
    };

    return { user, signin, signout };
  }
  ```

- [ ] Protected Route 구현

#### 1.2 도서 검색 & 결과 페이지
**프론트엔드**:
- [ ] SearchResultPage 구현
  - BookCard 컴포넌트 생성
  - 무한 스크롤 (useInfiniteQuery)
  - 로딩/에러/Empty 상태 처리

- [ ] HomePage 베스트셀러 API 연동
  - Mock 데이터 제거
  - `GET /api/books/bestsellers` 호출

**API 연동 예시**:
```typescript
// src/hooks/useBookSearch.ts
export function useBookSearch(keyword: string) {
  return useInfiniteQuery({
    queryKey: ['books', keyword],
    queryFn: ({ pageParam = 1 }) =>
      api.get('/api/books/search', {
        params: { query: keyword, page: pageParam, size: 12 }
      }),
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.page + 1 : undefined,
  });
}
```

#### 1.3 도서 상세 페이지 (최우선)
**백엔드**:
- [ ] 도서 상세 API 개선
  ```java
  // GET /api/books/detail/{isbn}
  // 응답에 도서관 가용성 포함
  {
    "book": { ... },
    "myLibraries": [ /* 내 도서관 3개 우선 */ ],
    "nearbyLibraries": [ /* 반경 5km 내 */ ]
  }
  ```

**프론트엔드**:
- [ ] BookDetailPage 구현
  - 상단: 도서 메타 정보
  - 중단: 도서관 가용성 카드 리스트
  - 하단: 독서 상태 토글 + 리뷰

### ⚡ Phase 2: 핵심 기능 완성 (2-3주)

#### 2.1 내 도서관 관리
**백엔드**:
- [ ] 내 도서관 3개 제한 검증
- [ ] 순서 변경 API (`PATCH /api/libraries/my-library/order`)

**프론트엔드**:
- [ ] MyLibraryPage 구현
  - 지역 선택 드롭다운 (시도/시군구)
  - 도서관 검색 (API 연동)
  - 드래그 앤 드롭 순서 변경

#### 2.2 독서 기록 관리
**프론트엔드**:
- [ ] MyPage API 연동
  - `GET /api/records/my?status=` 호출
  - 상태 전환 (`PATCH /api/records/{recordId}`)
  - 리뷰 작성 (`PUT /api/records/{recordId}/review`)

- [ ] 차트 데이터 실제 API 연동
  - 장르 통계 API 필요 (백엔드 추가)
  - 월별 기록 API 필요 (백엔드 추가)

#### 2.3 에러 처리 & UX 개선
**프론트엔드**:
- [ ] ErrorBoundary 구현
- [ ] Toast 알림 통합
- [ ] 로딩 스켈레톤 UI
- [ ] Empty State 컴포넌트

### 🚀 Phase 3: 품질 & 배포 (1-2주)

#### 3.1 보안 강화
**백엔드**:
- [ ] 환경 변수로 API 키 이전
- [ ] CORS 설정 검증
- [ ] Rate Limiting 추가

**프론트엔드**:
- [ ] .env 파일 생성
  ```env
  VITE_API_BASE_URL=http://localhost:8080
  ```

#### 3.2 테스트
**백엔드**:
- [ ] 컨트롤러 테스트
- [ ] 서비스 로직 테스트
- [ ] 외부 API 모킹

**프론트엔드**:
- [ ] Vitest 설정
- [ ] 컴포넌트 테스트 (React Testing Library)
- [ ] E2E 테스트 (Playwright)

#### 3.3 성능 최적화
- [ ] React Query 캐시 전략
- [ ] 이미지 최적화
- [ ] Code splitting
- [ ] Lighthouse 점수 개선

---

## 🎯 MVP 달성 체크리스트

### 백엔드
- [x] 회원가입/로그인 API
- [ ] 로그아웃 API
- [x] 도서 검색 API
- [ ] 도서 상세 + 가용성 통합 API
- [x] 내 도서관 CRUD
- [ ] 내 도서관 3개 제한 검증
- [x] 독서 기록 CRUD
- [ ] 통계 API (장르, 월별)

### 프론트엔드
- [x] 로그인/회원가입 페이지
- [ ] 인증 상태 관리 (useAuth)
- [ ] Axios 인스턴스 + 인터셉터
- [ ] SearchResultPage 구현
- [ ] BookDetailPage 구현 ⚠️ **최우선**
- [ ] MyLibraryPage 구현
- [ ] MyPage API 연동
- [ ] 에러 처리 통합

### 연동 테스트
- [ ] 로그인 → JWT 저장 → API 호출
- [ ] 도서 검색 → 상세 → 도서관 가용성
- [ ] 내 도서관 추가/삭제
- [ ] 독서 상태 변경 → 서버 반영
- [ ] 리뷰 작성 → 목록 갱신

---

## 📌 권장 작업 순서

### Week 1-2: 핵심 연동
1. Axios 인스턴스 + useAuth 구현
2. 로그인/회원가입 API 연동
3. SearchResultPage 구현
4. **BookDetailPage 구현 (가장 중요)**
5. 백엔드 도서 상세 API 개선

### Week 3-4: 기능 완성
1. MyLibraryPage 구현
2. MyPage API 연동
3. 독서 상태 관리 통합
4. 에러 처리 & Toast 통합

### Week 5-6: 품질 개선
1. 테스트 코드 작성
2. 보안 강화 (환경 변수)
3. 성능 최적화
4. 배포 준비

---

## 💡 주요 참고 사항

### API 베이스 URL 설정
**개발**: `http://localhost:8080`
**배포**: 환경 변수로 관리

### JWT 처리
**저장**: `localStorage.setItem('accessToken', token)`
**전송**: `Authorization: Bearer {token}`

### 에러 응답 포맷 (백엔드 표준화 필요)
```json
{
  "error": "UNAUTHORIZED",
  "message": "인증이 필요합니다.",
  "timestamp": "2025-10-23T..."
}
```

### 페이지네이션 파라미터
- `page`: 1부터 시작
- `size`: 기본 12개
- 응답: `{ items: [...], page: 1, hasNext: true }`

---

**작성자**: Claude Code
**최종 수정**: 2025-10-23
**버전**: 1.0

---

## 🆕 2025-10-30 업데이트: 현재 프론트엔드 진행 상황

### ✅ 완료된 주요 개선사항

#### 1. Mock 모드 인프라 구축 ✅
**문제**: API 없이 HTML이 반환되어 Zustand에 잘못된 데이터 저장
**해결**:
- ✅ `.env.development` 생성 (`VITE_USE_MOCK=true`)
- ✅ `useUserLibrary` 훅에서 Mock 모드 분기 처리
- ✅ Zustand persist migration 추가 (잘못된 데이터 자동 정리)
- ✅ 모든 `.map()` 호출에 방어 코드 (`|| []`)
- ✅ `CLEAR_STORAGE.md` 가이드 문서 작성

**파일**: `.env.development`, `src/hooks/useUserLibrary.ts`, `src/store/useLibraryStore.ts`

#### 2. HomePage 디자인 개선 ✅
**변경 사항**:
- ✅ Hero 배너: 카드 형태 + 그라데이션 배경 (`from-yellow-50 via-pink-50 to-pink-100`)
- ✅ 베스트셀러 섹션: 카드 안에 배치 (`bg-white rounded-2xl shadow-lg`)
- ✅ 신간 도서 섹션 추가 (2024년 출판 책 6권)
- ✅ Footer 간소화 (3칸→2칸, 바로가기 제거, 높이 축소)
- ✅ 전체 페이지 여백 통일 (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`)

**파일**: `src/pages/HomePage.tsx`, `src/components/Layout/Footer.tsx`, `src/utils/mockData.ts`

#### 3. MyLibraryPage UX 개선 ✅
**문제**: 도서관 추가 후 검색 결과 사라짐, 중복 추가 방지 부족
**해결**:
- ✅ 추가 후에도 검색 결과 유지
- ✅ `LibraryCard`에 `isAdded` prop 추가 → "✓ 추가됨" 회색 버튼 표시
- ✅ 중복 추가 시 alert 메시지
- ✅ 추가된 도서관은 disabled 상태로 클릭 불가

**파일**: `src/pages/MyLibraryPage.tsx`, `src/components/LibraryCard.tsx`

#### 4. ReviewPage 신규 페이지 구현 ✅
**기능**:
- ✅ "읽고 있는 책" / "다 읽은 책" 탭 분리
- ✅ 책 정보 (이미지, 제목, 저자, 별점) + 리뷰 textarea
- ✅ 페이지네이션 (10개씩)
- ✅ 인라인 편집 (Edit/Save/Cancel)
- ✅ Zustand store 연동

**파일**: `src/pages/ReviewPage.tsx`, `src/App.tsx` (라우팅 추가)

#### 5. Header 내비게이션 개선 ✅
**추가**:
- ✅ "내 도서관" 버튼 → `/mylibrary`
- ✅ "내 리뷰" 버튼 → `/review`
- ✅ 검색바 너비 조정 (`max-w-lg`)
- ✅ 모바일 메뉴에도 반영

**파일**: `src/components/Layout/Header.tsx`, `src/App.tsx`

---

### 🔴 남은 우선순위 작업

#### P0 (긴급 - API 연동 필수)

1. **useAuth 훅 구현 및 인증 흐름** ⚠️ **최우선**
   - **현재 상태**: `useAuth.ts` 파일은 존재하지만 실제 API 호출 없음
   - **필요 작업**:
     - [ ] `signin()` 함수에서 `POST /api/users/login` 호출
     - [ ] JWT 토큰 localStorage 저장
     - [ ] `signout()` 함수에서 localStorage 삭제
     - [ ] `isAuthenticated` 상태 관리
   - **파일**: `src/hooks/useAuth.ts`, `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`

2. **BookDetailPage 완성** ⚠️ **최우선**
   - **현재 상태**: Mock 데이터로 기본 레이아웃만 구현됨
   - **필요 작업**:
     - [ ] API 연동: `GET /api/books/detail/{isbn}`
     - [ ] 도서관 가용성 표시 (내 도서관 우선)
     - [ ] 독서 상태 토글 버튼 (찜/읽는 중/완독)
     - [ ] 리뷰 섹션 통합
   - **백엔드 확인 필요**: 도서관 가용성 정보가 응답에 포함되는지 확인
   - **파일**: `src/pages/BookDetailPage.tsx`, `src/api/books.ts`

3. **SearchResultPage 완성**
   - **현재 상태**: 빈 스켈레톤만 존재
   - **필요 작업**:
     - [ ] `useBookSearch` 훅 구현 (React Query useInfiniteQuery)
     - [ ] BookCard 그리드 레이아웃
     - [ ] 무한 스크롤 또는 페이지네이션
     - [ ] 로딩/에러/Empty 상태 처리
   - **파일**: `src/pages/SearchResultPage.tsx`, `src/hooks/useBookSearch.ts`

4. **Axios 인터셉터 활성화**
   - **현재 상태**: `src/api/index.ts`에 인터셉터 구조는 있으나 실제 사용 안 함
   - **필요 작업**:
     - [ ] JWT 토큰 자동 첨부
     - [ ] 401 에러 시 로그아웃 처리
     - [ ] 네트워크 에러 Toast 알림
   - **파일**: `src/api/index.ts`

#### P1 (필수 - 기능 완성)

1. **MyPage API 연동**
   - **현재 상태**: Mock 데이터로 차트 및 책 리스트 표시
   - **필요 작업**:
     - [ ] `GET /api/records/my?status=` 호출
     - [ ] 상태 전환 API 연동 (`PATCH /api/records/{recordId}`)
     - [ ] 차트 데이터 실제 API 연동
   - **백엔드 확인 필요**: 장르 통계, 월별 독서 통계 API 존재 여부
   - **파일**: `src/pages/MyPage.tsx`, `src/hooks/useUserBookState.ts`

2. **MyLibraryPage API 연동**
   - **현재 상태**: Mock 데이터로 도서관 검색 구현
   - **필요 작업**:
     - [ ] `GET /api/libraries/search` 호출
     - [ ] `POST /api/libraries/{libraryId}/my-library` 연동
     - [ ] `DELETE /api/libraries/{libraryId}/my-library` 연동
   - **파일**: `src/pages/MyLibraryPage.tsx`, `src/api/libraries.ts`

3. **BookStateEditModal API 연동**
   - **현재 상태**: 로컬 Zustand store만 업데이트
   - **필요 작업**:
     - [ ] 저장 시 서버에 반영 (`PATCH /api/records/{recordId}`)
     - [ ] 낙관적 업데이트 (Optimistic Update)
   - **파일**: `src/components/BookStateEditModal.tsx`

4. **Toast 알림 통합**
   - **현재 상태**: `react-toastify` 설정만 있고 실제 사용 안 함
   - **필요 작업**:
     - [ ] 성공 메시지 Toast로 변경 (alert 제거)
     - [ ] 에러 메시지 Toast로 통합
   - **파일**: 모든 페이지 컴포넌트

#### P2 (품질 개선)

1. **이미지 최적화**
   - **문제**: 모든 책 이미지가 `/example_image.png`로 통일
   - **필요 작업**:
     - [ ] 실제 API 이미지 URL 연동
     - [ ] lazy loading 적용
     - [ ] placeholder 이미지 개선

2. **ErrorBoundary 구현**
   - **필요 작업**:
     - [ ] 글로벌 ErrorBoundary 컴포넌트 생성
     - [ ] 페이지별 ErrorBoundary 적용

3. **로딩 상태 개선**
   - **필요 작업**:
     - [ ] 스켈레톤 UI 통일
     - [ ] Suspense 적용

---

### 📊 현재 구현 완성도 (2025-10-30 기준)

| 영역 | 완성도 | 상태 |
|------|--------|------|
| **인증 (Login/Signup)** | 80% | 🟡 UI 완성, API 연동 필요 |
| **HomePage** | 95% | 🟢 디자인 완료, API 연동만 남음 |
| **SearchResultPage** | 20% | 🔴 스켈레톤만 존재 |
| **BookDetailPage** | 50% | 🟡 레이아웃 있음, API 연동 필요 |
| **MyPage** | 85% | 🟡 Mock 데이터로 완성, API 연동 필요 |
| **MyLibraryPage** | 80% | 🟡 Mock 검색 완성, API 연동 필요 |
| **ReviewPage** | 90% | 🟢 기능 완성, API 연동만 남음 |
| **Header/Footer** | 100% | 🟢 완성 |
| **Mock 인프라** | 100% | 🟢 완성 |
| **Zustand Store** | 90% | 🟡 구조 완성, API 연동 필요 |

---

### 🎯 다음 세션 권장 작업 순서

#### Week 1: 인증 및 핵심 페이지 API 연동
1. **useAuth 훅 완성** (0.5일)
   - `signin()`, `signout()` API 호출
   - JWT 저장/관리
   - Protected Route 구현

2. **SearchResultPage 구현** (1일)
   - `useBookSearch` 훅 생성
   - 무한 스크롤 구현
   - BookCard 그리드

3. **BookDetailPage API 연동** (1.5일)
   - 도서 상세 API 호출
   - 도서관 가용성 표시
   - 독서 상태 토글

#### Week 2: 기능 완성 및 통합
1. **MyPage API 연동** (1일)
   - 독서 기록 API 호출
   - 상태 전환 연동

2. **MyLibraryPage API 연동** (0.5일)
   - 도서관 검색 API 호출
   - CRUD 연동

3. **Toast 알림 통합** (0.5일)
   - alert → toast 변경
   - 에러 메시지 통합

4. **통합 테스트** (0.5일)
   - 로그인 → 검색 → 상세 → 상태 변경 플로우 확인

---

### 💡 주요 개선 포인트

1. **Mock 모드 활용**
   - 백엔드 없이도 개발 가능한 인프라 구축 완료
   - `VITE_USE_MOCK=false`로 변경 시 즉시 API 연동 모드 전환

2. **디자인 시스템 정립**
   - 레퍼런스 이미지 기반 통일된 디자인
   - Tailwind CSS 기반 일관된 스타일링
   - 반응형 레이아웃 완성

3. **상태 관리 구조**
   - Zustand + React Query 조합 완성
   - Persist 기능으로 로컬 데이터 저장
   - Migration으로 데이터 무결성 보장

4. **컴포넌트 재사용성**
   - LibraryCard, BookCard 등 범용 컴포넌트
   - LoadingSpinner, EmptyState 등 공통 UI
   - 일관된 Props 패턴

---

**업데이트 작성자**: Claude Code
**업데이트 일시**: 2025-10-30
**다음 업데이트**: API 연동 완료 후
