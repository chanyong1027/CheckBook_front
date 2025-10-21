# CheckBook UI/UX 설계 기획서 (v0.9)

> **역할 시점**: 시니어 프론트엔드 개발자 & UX 디자이너  
> **목표**: 사용자가 “책을 찾고 → 근처 도서관에서 대출 여부를 확인 → 독서 상태를 기록”하는 여정을 **3클릭 이하**로 완결할 수 있는 인터페이스 설계  
> **핵심 철학**: 단순성, 가시성, 신뢰성 (Simplicity / Visibility / Trust)

---

## 1) UX 핵심 원칙
| 원칙 | 설명 | 실제 적용 예시 |
|------|------|----------------|
| **1. 인지 부하 최소화** | 모든 페이지는 한 눈에 “무엇을 할 수 있는지” 명확해야 함 | 검색창은 항상 상단 고정, CTA는 화면 1개 내 |
| **2. 사용자 컨텍스트 유지** | 검색→상세→도서관→리뷰 흐름이 단절되지 않게 | 상세페이지에서 바로 상태 변경/도서관 보기 가능 |
| **3. 정보의 위계 구조** | 중요도 순: 도서 기본정보 > 가용성 > 내 도서관 > 리뷰 | 색상 대비와 여백으로 시각 계층화 |
| **4. 감정적 친밀감** | 독서라는 맥락에 맞는 따뜻한 톤 & 타이포그래피 | 서체: Pretendard / 배경톤: #FAFAF9 / 포인트: #3563E9 |
| **5. 모바일 우선 (Mobile-First)** | 70% 이상이 모바일 사용 예상 | 반응형 기준 width ≤ 768px 중심 설계 |

---

## 2) 주요 사용자 플로우별 UX 전략

### (1) 도서 검색 → 결과 리스트
**목표:** 사용자가 원하는 책을 빠르게 찾고, ‘내 도서관’의 가용성 여부를 직관적으로 인지할 수 있게 함.

**UI 구성:**
- 상단 검색바 고정 (Placeholder: “책 제목이나 저자를 입력하세요”)  
- 결과 리스트 카드 구성:
  - 좌: 썸네일(고정비율 2:3)  
  - 우: 제목(2줄 제한) / 저자 / 출판년도 / 별점  
  - 하단 우측: **‘대출 가능 도서관 n곳’** 또는 ‘가용성 확인 중’  
- Hover/Touch 시 툴팁: “가까운 도서관 보기 →”

**UX 포인트:**
- 최근 검색어 & 추천 키워드 캐싱  
- “내 도서관 우선 보기” 필터 상단 고정  
- **검색 반응속도 300ms 이하 (Optimistic UI + Skeleton)**

---

### (2) 도서 상세 페이지
**목표:** 책의 정보, 주변 도서관, 나의 독서 상태를 한 화면에서 해결

**구조:**  
1. 상단: 썸네일 + 메타 정보(제목, 저자, 출판사, 연도, ISBN, 알라딘 링크)  
2. 중단: **도서관 가용성 섹션**
   - “내 도서관” (3개 카드 고정, 상태별 색상 아이콘)  
   - “근처 도서관 (5km 이내)” 리스트 (무한스크롤)  
   - 각 카드: 이름, 거리, 대출 가능여부(● 초록/회색/회색점선), 홈페이지 링크, 전화버튼  
3. 하단: **독서 상태 & 리뷰**
   - [찜하기] [읽는 중] [완독] 3개 탭형 토글  
   - 캘린더 모달(시작일/완독일 선택), 별점(5단계), 코멘트(최대 140자)  

**UX 포인트:**  
- 상태 전환 시 애니메이션 (Framer Motion)  
- 도서관 리스트 Lazy-load + “새로고침” 버튼  
- 책 표지가 없을 경우 fallback 일러스트 적용  

---

### (3) 내 도서관 관리
**목표:** 사용자 중심의 ‘개인화된 도서관 우선순위’ 설정 UX

**UI 구조:**  
- 지역 선택 드롭다운 (시도 → 시군구)  
- 도서관 검색 인풋 (placeholder: “도서관 이름으로 검색”)  
- 결과 리스트: 이름 / 거리 / 주소 / +추가 버튼  
- 상단 고정 섹션: “내 도서관(최대 3개)” — 드래그로 순서 변경 가능  

**UX 포인트:**  
- 드래그 앤 드롭으로 순서 변경 (react-beautiful-dnd)  
- 3개 초과 시 Toast 알림 “최대 3곳까지 등록할 수 있어요.”  
- 추가/삭제 시 즉시 반영(Optimistic update)  

---

### (4) 마이페이지 (독서 기록)
**목표:** 개인의 독서 여정을 시각적으로 표현하며, 행동을 유도

**UI 구성:**
- 상단: 독서 상태별 탭(찜 / 읽는 중 / 완독)  
- 각 탭 내용: 카드 리스트(썸네일, 제목, 별점, 코멘트 미리보기)  
- 하단 요약 그래프 (월별 완독 수 / 평균 별점)

**UX 포인트:**  
- 상태별 색상 코드:  
  - 찜(#F7B731), 읽는 중(#5DADE2), 완독(#58D68D)  
- 달력에서 선택한 기간별 독서 기록 필터링  
- 카드 클릭 → 해당 책 상세페이지로 이동  

---

## 3) 시각 디자인 시스템 (Design System)

### 3.1 색상 팔레트
| 역할 | HEX | 설명 |
|------|-----|------|
| Primary | `#3563E9` | 메인 CTA, 링크, 버튼 배경 |
| Secondary | `#EEF2FF` | 카드 배경, 보조 버튼 |
| Accent | `#58D68D` | ‘대출 가능’ 표시 등 긍정 신호 |
| Neutral | `#FAFAF9`, `#E5E7EB`, `#9CA3AF` | 배경, 라인, 텍스트 |
| Danger | `#E74C3C` | 오류, 경고 표시 |

### 3.2 타이포그래피
| 계층 | 폰트 크기 | 두께 | 예시 |
|------|-----------|------|------|
| H1 | 24px | 700 | 페이지 제목 (도서 상세 등) |
| H2 | 20px | 600 | 섹션 제목 |
| Body | 16px | 400 | 본문 텍스트 |
| Caption | 13px | 400 | 보조 설명 |

폰트: **Pretendard / Noto Sans KR**  
라인 간격: 1.5~1.8em  
글자 간격: -0.25px

### 3.3 컴포넌트 스타일 가이드
| 컴포넌트 | 설계 가이드 |
|-----------|-------------|
| **Button** | Tailwind: `rounded-xl px-4 py-2 font-medium shadow-md transition-all hover:opacity-90` |
| **Card** | `bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition` |
| **Input/SearchBar** | `border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-xl px-3 py-2` |
| **Tag** | `bg-blue-50 text-blue-600 rounded-full px-2 py-1 text-sm` |

---

## 4) 인터랙션 & 애니메이션 설계
| 영역 | 사용 라이브러리 | 설명 |
|-------|-----------------|------|
| 페이지 전환 | Framer Motion | Fade-In/Out, Direction Slide |
| 도서관 리스트 갱신 | Lottie or Motion | 새로고침 시 회전 애니메이션 |
| 버튼 | Tailwind `transition` + scale | Hover시 1.05x 확대 |
| 상태 변경 | Toastify | “완독으로 변경되었습니다.” 피드백 |

---

## 5) 반응형 브레이크포인트
| 구분 | Width | 주요 변경 사항 |
|-------|--------|----------------|
| Mobile | ≤ 768px | 1열 카드, 하단 탭 내비게이션 |
| Tablet | 769–1024px | 2열 카드, 상단 내비 |
| Desktop | ≥ 1025px | 3~4열 카드, 좌측 메뉴바 고정 |

---

## 6) 접근성(Accessibility)
- 색 대비 최소 4.5:1, 상태 색상은 아이콘/텍스트 병행  
- 키보드 포커스 링 유지, `aria-label` 전 컴포넌트 적용  
- 이미지 ALT 텍스트: 도서명, 도서관명 명시  
- 모션 최소화 옵션 (prefers-reduced-motion 대응)

---

## 7) 기술 구현 포인트 (React + TypeScript + Tailwind)
- **상태 관리:** Zustand or React Query 기반 캐시  
- **라우팅:** React Router v6 / Next.js App Router  
- **UI 컴포넌트:** Headless UI + shadcn/ui  
- **폼 처리:** React Hook Form + Zod  
- **API 연동:** Axios + 인터셉터 (토큰/에러 핸들링)  
- **다국어 (차후):** react-intl or i18next 준비  

```tsx
// 예시: 검색 리스트 카드
export const BookCard = ({ book }: { book: Book }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md flex gap-4">
    <img src={book.coverUrl} alt={book.title} className="w-24 h-36 object-cover rounded-md" />
    <div className="flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author}</p>
        <p className="text-xs text-gray-400">{book.publisher} · {book.pubYear}</p>
      </div>
      <div className="text-blue-600 text-sm font-medium">📍 내 도서관: 대출 가능</div>
    </div>
  </div>
);
```

---

## 8) 디자인 산출물 계획
| 산출물 | 도구 | 비고 |
|---------|------|------|
| 와이어프레임 | Figma (low fidelity) | UX 플로우 검증용 |
| UI 디자인 | Figma (component system) | Tailwind class mapping |
| 프로토타입 | Framer / Figma Prototype | 사용자 테스트용 |
| 디자인 시스템 문서 | Storybook + DocsPage | 개발-디자인 싱크용 |

---

## 9) KPI 기반 UX 개선 로드맵
| 지표 | 개선 목표 | 추후 실험 |
|-------|------------|-----------|
| 검색 → 상세 전환율 | 40% → 55% | 썸네일 확대 + CTA 노출 개선 |
| 상세 → 상태 변경 | 20% → 35% | 상태 버튼 시각 피드백 강화 |
| 리뷰 작성율 | 15% → 30% | “나의 완독률 배지” 게임화 |

---

## 10) 결론
CheckBook의 UI/UX는 **정보 접근 속도 + 감정적 몰입감**을 동시에 추구한다.  
React + Tailwind의 속도감과 모듈화된 컴포넌트 구조를 기반으로 MVP 단계에서도 **매끄러운 검색→상세→기록 플로우**를 완성하는 것을 1차 목표로 한다.

> “좋은 UX는 사용자가 생각하기 전에 행동하게 만든다.” – CheckBook의 설계 철학

---

**작성:** UX 리드 & 프론트엔드 시니어 개발자  
**버전:** 0.9 (2025-10)  
**차기 계획:** 디자인 시스템 Figma 세부 컴포넌트 정의 + Storybook 연동
