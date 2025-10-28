# Design Change v1 - UI/UX 리뉴얼

## 개요
CheckBook 프로젝트의 메인페이지(HomePage)와 마이페이지(MyPage)를 새로운 디자인으로 전면 리뉴얼하였습니다.

**작업 일시**: 2025-10-21
**참고 이미지**: `docs/images/메인페이지.png`, `docs/images/내기록페이지.png`

---

## 1. 색상 팔레트 변경 (tailwind.config.js)

### Before
- **Primary**: `#3563E9` (파란색)
- **Secondary**: `#90A3BF` (회색-파란색)
- **Accent**: `#F59E0B` (주황색)

### After
- **Primary**: `#F7B731` (노란색)
- **Secondary**: `#FFF8E7` (연한 노란색 배경)
- **Accent**: `#FF6B9D` (핑크색)

### 추가된 색상
```javascript
chart: {
  yellow: '#F7B731',
  gray: '#D1D5DB',
  orange: '#FF8C42',
  pink: '#FF6B9D',
  blue: '#5DADE2',
}
```

### 중립 색상 추가
- `neutral-800`: `#1F2937`
- `neutral-900`: `#111827`

---

## 2. Header 컴포넌트 변경

### 변경 사항
- **로고**: "CheckBook" → "My Book📚"
- **색상**: `text-blue-600` → `text-primary` (노란색)

### 파일
- `src/components/Layout/Header.tsx:68-71`

---

## 3. HomePage 전면 리뉴얼

### 주요 변경 사항

#### 3.1 Hero 섹션 - 2열 레이아웃
**Before**
- 단일 배너
- 검색창 포함

**After**
- **왼쪽**: 책 스택 일러스트 (4개 책, 회전 효과)
  - 보라색, 분홍색, 노란색, 파란색 그라데이션
- **오른쪽**: 노란색-핑크색 그라데이션 배경
  - "배경" 배지 (핑크색)
  - 메인 타이틀: "오늘의 독서를 기록해보세요!"
  - 설명 텍스트 2줄

#### 3.2 베스트셀러 섹션
**추가됨**
- 🏆 베스트셀러 타이틀
- 6개 도서 그리드 (2열 / 3열 / 6열 반응형)
- 페이지네이션 점 (2개)
- Mock 데이터 6권:
  1. 문과 남자의 과학 공부
  2. 세이노의 가르침
  3. 최수완의 한국사
  4. 물별의 연어 1
  5. 나만나 많은 여름이
  6. 도둑맞은 집중력

#### 3.3 검색 기능
- Hero 섹션에서 제거 (Header로 이동 완료)

### 파일
- `src/pages/HomePage.tsx` (v2 - 완전 재작성)

---

## 4. MyPage 전면 리뉴얼

### 주요 변경 사항

#### 4.1 레이아웃 구조
**Before**
- 단일 컬럼
- 통계 카드 4개 (가로 나열)

**After**
- **3열 그리드** (lg 스크린 이상)
  - 왼쪽 2열: 메인 콘텐츠
  - 오른쪽 1열: 사이드바

#### 4.2 통계 섹션 - 차트 추가 (Recharts)
**새로 추가됨**
1. **많이 읽은 장르** (원형 차트)
   - Pie Chart (5개 장르)
   - 색상: 노란색, 회색, 주황색, 연회색, 진회색
   - 범례: 순위별 표시

2. **이달의 기록현황** (막대 그래프)
   - Bar Chart (3개월: 5월, 6월, 7월)
   - 색상: 노란색 (`#F7B731`)
   - 둥근 모서리 (상단)
   - 설명 텍스트: "작년대비가 기록중에서 1위 증가하였어요!"

#### 4.3 독서 기록 섹션
**변경됨**
- 탭 스타일: 파란색 → 노란색 (bg-primary)
- 도서 그리드: **4열** (기존 3열에서 변경)
- "읽게 된 일기" 드롭다운 추가

#### 4.4 우측 사이드바 (새로 추가)
1. **내가 저장한 키워드**
   - 노란색 라운드 태그 (bg-primary)
   - Mock 데이터: 소설, 인문·사회, 집밥·요리, 동시

2. **최근 기록된 메모**
   - 3개 메모 카드
   - 메모 제목 + 내용 미리보기 + 관련 도서명

### 파일
- `src/pages/MyPage.tsx` (v2 - 완전 재작성)
- `src/pages/MyPage_old.tsx` (백업)

---

## 5. 추가된 라이브러리

### Recharts
```bash
pnpm add recharts
```

**사용 컴포넌트**
- `PieChart`, `Pie`, `Cell` (장르 통계)
- `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid` (월별 기록)
- `ResponsiveContainer` (반응형 래퍼)

---

## 6. 테스트 결과

### ✅ TypeScript 검증
```bash
pnpm tsc --noEmit
```
- **결과**: 에러 없음

### ✅ Production Build
```bash
pnpm build
```
- **시간**: 17.56s
- **크기**:
  - index.html: 0.77 kB
  - CSS: 39.84 kB (gzip: 7.48 kB)
  - JS: 607.01 kB (gzip: 192.90 kB)

### ✅ Dev Server
```bash
pnpm dev
```
- **URL**: http://localhost:5173/
- **상태**: 정상 작동

---

## 7. 파일 변경 요약

### 수정된 파일
1. `tailwind.config.js` - 색상 팔레트 변경
2. `src/components/Layout/Header.tsx` - 로고 및 색상 변경
3. `src/pages/HomePage.tsx` - 완전 재작성 (v2)
4. `src/pages/MyPage.tsx` - 완전 재작성 (v2)

### 백업 파일
1. `src/pages/MyPage_old.tsx` - 이전 버전 백업

### 새로 생성된 문서
1. `docs/Design_change_v1.md` (본 문서)

---

## 8. Before / After 비교

### HomePage
| 항목 | Before | After |
|------|--------|-------|
| Hero 레이아웃 | 단일 배너 | 2열 (일러스트 + 그라데이션) |
| 검색창 | Hero 섹션 내 | Header로 이동 |
| 베스트셀러 | 없음 | 6개 도서 그리드 + 페이지네이션 |
| 색상 테마 | 파란색 | 노란색-핑크색 |

### MyPage
| 항목 | Before | After |
|------|--------|-------|
| 통계 카드 | 4개 카드 (텍스트) | 2개 차트 (원형+막대) |
| 레이아웃 | 단일 컬럼 | 3열 그리드 (메인 2열 + 사이드바 1열) |
| 도서 그리드 | 3열 | 4열 |
| 탭 색상 | 파란색 | 노란색 |
| 사이드바 | 없음 | 키워드 + 최근 메모 |

---

## 9. 유지보수 포인트

### 1. Mock 데이터 위치
- **HomePage**: `BESTSELLER_BOOKS` (line 25-32)
- **MyPage**: `GENRE_DATA` (line 24-30), `MONTHLY_DATA` (line 33-37)

### 2. 향후 API 연동 시 수정 필요 사항
- 베스트셀러 목록: `/api/books/bestsellers`
- 장르 통계: `/api/users/me/genre-stats`
- 월별 기록: `/api/users/me/monthly-stats`
- 저장한 키워드: `/api/users/me/keywords`
- 최근 메모: `/api/users/me/recent-memos`

### 3. 반응형 breakpoint
- **모바일**: 1열
- **태블릿 (md)**: 2-3열
- **데스크톱 (lg)**: 4-6열

---

## 10. 다음 단계 제안

### Phase 1: 데이터 연동
- [ ] Zustand 스토어에 차트 데이터 추가
- [ ] API 엔드포인트 구현
- [ ] Mock 데이터 → 실제 데이터 전환

### Phase 2: 인터랙션 강화
- [ ] 베스트셀러 캐러셀 자동 슬라이드
- [ ] 차트 호버 효과 (Tooltip)
- [ ] 키워드 클릭 → 검색 연동
- [ ] 메모 클릭 → 상세 페이지 이동

### Phase 3: 성능 최적화
- [ ] 차트 컴포넌트 lazy loading
- [ ] 이미지 최적화 (도서 커버)
- [ ] Bundle size 최적화 (code splitting)

---

## 완료 체크리스트

- [x] Recharts 라이브러리 설치
- [x] tailwind.config.js 색상 팔레트 변경
- [x] Header 컴포넌트 리디자인
- [x] HomePage Hero 섹션 변경 (2열 레이아웃)
- [x] 베스트셀러 캐러셀 섹션 추가
- [x] MyPage 통계 차트 추가 (원형+막대)
- [x] MyPage 우측 사이드바 추가
- [x] TypeScript 타입 검증
- [x] 빌드 및 개발 서버 테스트
- [x] Design_change_v1.md 문서 작성

---

**작성일**: 2025-10-21
**작성자**: Claude Code
**버전**: 1.0
