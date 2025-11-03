# CheckBook 디자인 개선 요구사항 및 구현 계획

## 📋 요구사항 분석

### 1. Hero 배너 개선 (HomePage)
**문제점:**
- 현재 Hero 섹션이 헤더와 균형이 안 맞음
- 배경이 하얀색이라 단조로움
- 레퍼런스 이미지와 비교 시 여백과 그라데이션 부족

**목표:**
- 메인페이지.png 레퍼런스처럼 양옆 여백 추가
- 그라데이션 배경 (노란색→분홍색) 적용
- 헤더와 시각적 균형 맞춤

**구현 방식:**
- Hero section을 `container` 안에서 카드 형태로 변경
- `rounded-3xl` 적용하여 양옆 여백 생성
- `bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-100` 그라데이션 적용
- 기존 코드 구조 유지, Tailwind 클래스만 수정

---

### 2. 베스트셀러 섹션 카드화 (HomePage)
**문제점:**
- 현재 베스트셀러가 화면에 꽉 차서 답답함
- 섹션 구분이 명확하지 않음

**목표:**
- 베스트셀러 전체를 카드(`bg-white shadow-lg rounded-2xl`) 안에 배치
- 레퍼런스 이미지처럼 패딩과 여백 추가

**구현 방식:**
- 기존 `<section>` 내부에 카드 wrapper 추가
- `bg-white rounded-2xl shadow-lg p-8` 스타일 적용
- 그리드 레이아웃 유지

---

### 3. 신간 도서 섹션 추가 (HomePage)
**문제점:**
- 현재 베스트셀러만 있고 신간 도서 없음

**목표:**
- 베스트셀러 아래에 신간 도서 섹션 추가
- 동일한 카드 레이아웃 적용

**구현 방식:**
1. **mockData.ts에 `getNewBooks()` 함수 추가**
   - `pubYear === 2024`인 책들을 필터링
   - 최대 6권 반환

2. **HomePage에 신간 도서 섹션 추가**
   - 베스트셀러와 동일한 카드 구조
   - 타이틀: "📘 신간 도서"
   - 페이지네이션 제거 (6권 고정)

---

### 4. Footer 간소화
**문제점:**
- 현재 Footer가 3칸 그리드로 너무 넓음
- "바로가기" 섹션 불필요

**목표:**
- Footer 높이 축소
- "바로가기" 섹션 제거
- 로고 + 정보만 남기고 1~2줄로 압축

**구현 방식:**
- `grid-cols-1 md:grid-cols-2`로 변경
- "바로가기" 섹션 삭제
- `py-8` → `py-4`로 패딩 축소

---

### 5. 내 도서관 페이지 UX 개선 (MyLibraryPage)
**문제점:**
- 도서관 추가 후 검색 결과가 사라짐 (line 93: `setSearchResults(prev => prev.filter(...))`)
- 이미 추가된 도서관을 다시 추가하려 할 때 안내 부족

**목표:**
- 추가 후에도 검색 결과 유지
- 추가된 도서관은 "추가됨" 버튼으로 표시
- 추가된 도서관 다시 클릭 시 "이미 추가되었습니다" 메시지

**구현 방식:**
1. **handleAddLibrary 수정**
   - `setSearchResults` 필터링 로직 제거
   - 성공 토스트 메시지 추가

2. **LibraryCard 상태 표시**
   - `myLibraries`에 이미 있으면 `disabled` 버튼 표시
   - 버튼 텍스트: "추가됨"

3. **중복 추가 방지**
   - `addLibrary` 호출 전 `hasLibrary()` 체크
   - 중복이면 alert 또는 toast로 안내

---

## 🛠️ 구현 순서 (SOLID 원칙 준수)

### Phase 1: mockData 확장 (Single Responsibility)
- `getNewBooks()` 함수 추가
- 기존 함수들과 동일한 패턴 유지

### Phase 2: HomePage 리팩토링 (Open/Closed Principle)
- Hero 섹션 카드화 + 그라데이션
- 베스트셀러 카드화
- 신간 도서 섹션 추가
- 기존 컴포넌트 구조 유지, 스타일만 변경

### Phase 3: Footer 간소화 (Interface Segregation)
- 불필요한 섹션 제거
- props 변경 없이 내부 JSX만 수정

### Phase 4: MyLibraryPage UX 개선 (Dependency Inversion)
- `handleAddLibrary` 로직 개선
- LibraryCard props에 `isAdded` 추가하여 상태 표시
- Toast 알림 시스템 활용

---

## 📐 Tailwind 클래스 참고

### Hero 배너
```css
/* 기존 */
<section className="relative overflow-hidden">

/* 변경 */
<section className="container mx-auto px-4 py-8">
  <div className="bg-gradient-to-r from-yellow-50 via-pink-50 to-pink-100 rounded-3xl p-12">
```

### 베스트셀러 카드
```css
<section className="container mx-auto px-4 py-12">
  <div className="bg-white rounded-2xl shadow-lg p-8">
    {/* 기존 내용 */}
  </div>
</section>
```

### Footer
```css
/* py-8 → py-4 */
/* grid-cols-3 → grid-cols-2 */
<div className="max-w-7xl mx-auto px-4 py-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
```

---

## ✅ 테스트 시나리오

1. **Hero 배너**: 양옆 여백, 그라데이션 확인
2. **베스트셀러**: 카드 내부에 잘 배치되었는지 확인
3. **신간 도서**: 6권 표시, 클릭 시 상세 페이지 이동
4. **Footer**: 높이 축소, 바로가기 제거 확인
5. **내 도서관**: 추가 후 검색 결과 유지, 중복 추가 방지 확인

---

## 🎯 예상 결과

- **일관된 디자인**: 레퍼런스 이미지와 유사한 레이아웃
- **가독성 향상**: 카드 형태로 섹션 구분 명확
- **UX 개선**: 내 도서관 페이지 사용성 증가
- **유지보수성**: 기존 컴포넌트 구조 유지하며 스타일만 변경
- **확장성**: 신규 섹션 추가 시 동일 패턴 적용 가능
