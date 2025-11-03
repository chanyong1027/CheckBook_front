/**
 * Mock 데이터
 *
 * @description
 * - API 연동 전 프론트엔드 테스트용 Mock 도서 데이터
 * - 검색, 베스트셀러, 상세 페이지에서 사용
 */

import type { Book } from '@/types/book';
import type { Library } from '@/types/library';

/**
 * Mock 도서 데이터 (30개)
 */
export const MOCK_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: '리액트를 다루는 기술',
    author: '김민준',
    publisher: '길벗',
    pubYear: 2024,
    isbn13: '9788960882447',
    coverUrl: '/example_image.png',
    description: 'React의 기본부터 실전 프로젝트까지, 웹 개발의 새로운 패러다임을 배워보세요.',
    rating: 4.8,
    category: '컴퓨터/IT',
  },
  {
    id: 'book-2',
    title: '세이노의 가르침',
    author: '세이노',
    publisher: '데이원',
    pubYear: 2023,
    isbn13: '9791192300245',
    coverUrl: '/example_image.png',
    description: '부와 성공을 위한 인생 철학. 누적 판매 100만 부 돌파!',
    rating: 4.9,
    category: '자기계발',
  },
  {
    id: 'book-3',
    title: '혼자 공부하는 파이썬',
    author: '윤인성',
    publisher: '한빛미디어',
    pubYear: 2024,
    isbn13: '9791169211635',
    coverUrl: '/example_image.png',
    description: '1:1 과외하듯 배우는 파이썬 프로그래밍 자습서. 기초 문법부터 실전 프로젝트까지.',
    rating: 4.7,
    category: '컴퓨터/IT',
  },
  {
    id: 'book-4',
    title: '문과 남자의 과학 공부',
    author: '유지원',
    publisher: '어크로스',
    pubYear: 2024,
    isbn13: '9791167743084',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/34373/14/cover500/k712938854_1.jpg',
    description: '문과생도 재미있게 읽는 과학 교양서. 물리, 화학, 생물의 핵심 개념을 쉽게 설명.',
    rating: 4.6,
    category: '과학',
  },
  {
    id: 'book-5',
    title: '불편한 편의점',
    author: '김호연',
    publisher: '나무옆의자',
    pubYear: 2021,
    isbn13: '9791191438253',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/27036/33/cover500/k672835631_1.jpg',
    description: '서울역 노숙자 독거노인과 편의점 알바생의 따뜻한 이야기. 100만 부 판매 베스트셀러.',
    rating: 4.7,
    category: '소설',
  },
  {
    id: 'book-6',
    title: '도둑맞은 집중력',
    author: '요한 하리',
    publisher: '어크로스',
    pubYear: 2024,
    isbn13: '9791167743251',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/34534/91/cover500/k832939164_1.jpg',
    description: '우리는 왜 집중하지 못할까? 집중력을 되찾기 위한 12가지 방법.',
    rating: 4.5,
    category: '심리학',
  },
  {
    id: 'book-7',
    title: '나의 하루는 4시 40분에 시작된다',
    author: '김유진',
    publisher: '토네이도',
    pubYear: 2020,
    isbn13: '9791158511999',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/24287/52/cover500/k072632530_1.jpg',
    description: '새벽 루틴으로 인생이 바뀐다. 미라클 모닝 실천 가이드.',
    rating: 4.4,
    category: '자기계발',
  },
  {
    id: 'book-8',
    title: '자바의 정석',
    author: '남궁성',
    publisher: '도우출판',
    pubYear: 2024,
    isbn13: '9788994492032',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/34850/11/cover500/8994492038_1.jpg',
    description: 'Java 프로그래밍 바이블. 초보자부터 실무자까지 필독서.',
    rating: 4.9,
    category: '컴퓨터/IT',
  },
  {
    id: 'book-9',
    title: '총, 균, 쇠',
    author: '재레드 다이아몬드',
    publisher: '문학사상',
    pubYear: 2023,
    isbn13: '9788970127248',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/32854/45/cover500/8970127240_1.jpg',
    description: '인류 문명의 발전과 불평등의 기원을 탐구한 퓰리처상 수상작.',
    rating: 4.8,
    category: '역사',
  },
  {
    id: 'book-10',
    title: '아몬드',
    author: '손원평',
    publisher: '창비',
    pubYear: 2017,
    isbn13: '9788936434267',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/11142/52/cover500/8936434268_1.jpg',
    description: '감정을 느끼지 못하는 소년의 성장 이야기. 청소년 문학의 걸작.',
    rating: 4.6,
    category: '소설',
  },
  {
    id: 'book-11',
    title: '코스모스',
    author: '칼 세이건',
    publisher: '사이언스북스',
    pubYear: 2023,
    isbn13: '9791192908908',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/33121/76/cover500/k742837445_1.jpg',
    description: '우주의 신비와 과학의 경이로움. 전 세계 4천만 부 판매 과학 교양서의 고전.',
    rating: 4.9,
    category: '과학',
  },
  {
    id: 'book-12',
    title: '완벽한 공부법',
    author: '고영성, 신영준',
    publisher: '로크미디어',
    pubYear: 2019,
    isbn13: '9791188754205',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/19819/73/cover500/k322531975_1.jpg',
    description: '뇌과학이 밝혀낸 가장 효율적인 공부법. 학습 능력을 극대화하는 방법.',
    rating: 4.5,
    category: '자기계발',
  },
  {
    id: 'book-13',
    title: '데일 카네기 인간관계론',
    author: '데일 카네기',
    publisher: '현대지성',
    pubYear: 2019,
    isbn13: '9791187142836',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/19234/74/cover500/k352531458_1.jpg',
    description: '사람을 다루는 기술. 전 세계 1억 5천만 부 판매 자기계발서의 바이블.',
    rating: 4.7,
    category: '자기계발',
  },
  {
    id: 'book-14',
    title: '객체지향의 사실과 오해',
    author: '조영호',
    publisher: '위키북스',
    pubYear: 2015,
    isbn13: '9788998139766',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/5890/96/cover500/8998139766_1.jpg',
    description: '객체지향 프로그래밍의 본질을 이해하는 필독서. 역할, 책임, 협력 중심 설계.',
    rating: 4.8,
    category: '컴퓨터/IT',
  },
  {
    id: 'book-15',
    title: '미드나잇 라이브러리',
    author: '매트 헤이그',
    publisher: '인플루엔셜',
    pubYear: 2021,
    isbn13: '9791168340367',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/27329/66/cover500/k652835962_1.jpg',
    description: '후회로 가득한 인생, 다시 살 수 있다면? 뉴욕타임스 베스트셀러.',
    rating: 4.5,
    category: '소설',
  },
  {
    id: 'book-16',
    title: '지적 대화를 위한 넓고 얕은 지식',
    author: '채사장',
    publisher: '한빛비즈',
    pubYear: 2020,
    isbn13: '9791157844234',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/24850/16/cover500/k702733238_1.jpg',
    description: '역사, 경제, 정치, 사회, 윤리를 하나로 꿰뚫는 지식의 지도.',
    rating: 4.6,
    category: '인문·사회',
  },
  {
    id: 'book-17',
    title: '돈의 심리학',
    author: '모건 하우절',
    publisher: '인플루엔셜',
    pubYear: 2021,
    isbn13: '9791168340503',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/27485/93/cover500/k992836227_1.jpg',
    description: '부와 행복을 얻는 금융 심리학. 월스트리트저널 베스트셀러.',
    rating: 4.7,
    category: '경제/경영',
  },
  {
    id: 'book-18',
    title: '클린 코드',
    author: '로버트 마틴',
    publisher: '인사이트',
    pubYear: 2013,
    isbn13: '9788966260959',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/2327/44/cover500/8966260950_1.jpg',
    description: '읽기 좋은 코드를 작성하는 방법. 프로그래머 필독서.',
    rating: 4.8,
    category: '컴퓨터/IT',
  },
  {
    id: 'book-19',
    title: '사피엔스',
    author: '유발 하라리',
    publisher: '김영사',
    pubYear: 2024,
    isbn13: '9788934986454',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/34892/4/cover500/8934986450_1.jpg',
    description: '인류의 역사를 뒤흔든 3가지 혁명. 전 세계 2천만 부 판매 화제작.',
    rating: 4.9,
    category: '역사',
  },
  {
    id: 'book-20',
    title: '원씽',
    author: '게리 켈러, 제이 파파산',
    publisher: '비즈니스북스',
    pubYear: 2013,
    isbn13: '9788997575534',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/2494/55/cover500/8997575538_1.jpg',
    description: '복잡한 세상을 이기는 단순함의 힘. 단 하나에 집중하라.',
    rating: 4.6,
    category: '자기계발',
  },
  {
    id: 'book-21',
    title: '이기적 유전자',
    author: '리처드 도킨스',
    publisher: '을유문화사',
    pubYear: 2018,
    isbn13: '9788932473901',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/15809/89/cover500/8932473900_1.jpg',
    description: '진화생물학의 고전. 유전자 관점에서 본 생명의 의미.',
    rating: 4.7,
    category: '과학',
  },
  {
    id: 'book-22',
    title: '흐르는 강물처럼',
    author: '파울로 코엘료',
    publisher: '문학동네',
    pubYear: 2021,
    isbn13: '9788954682114',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/27089/48/cover500/k392835683_1.jpg',
    description: '인생의 흐름을 따라가는 지혜. 연금술사 작가의 삶의 철학.',
    rating: 4.4,
    category: '소설',
  },
  {
    id: 'book-23',
    title: '해커와 화가',
    author: '폴 그레이엄',
    publisher: '한빛미디어',
    pubYear: 2014,
    isbn13: '9788968480683',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/4304/40/cover500/8968480680_1.jpg',
    description: '실리콘밸리의 전설이 말하는 프로그래밍과 창조의 본질.',
    rating: 4.6,
    category: '컴퓨터/IT',
  },
  {
    id: 'book-24',
    title: '아주 작은 습관의 힘',
    author: '제임스 클리어',
    publisher: '비즈니스북스',
    pubYear: 2019,
    isbn13: '9791162540886',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/19206/52/cover500/k252531429_1.jpg',
    description: '매일 1%씩 성장하는 습관의 복리 효과. 뉴욕타임스 베스트셀러 1위.',
    rating: 4.8,
    category: '자기계발',
  },
  {
    id: 'book-25',
    title: '설득의 심리학',
    author: '로버트 치알디니',
    publisher: '21세기북스',
    pubYear: 2013,
    isbn13: '9788950949846',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/2377/76/cover500/8950949849_1.jpg',
    description: '사람들이 "예"라고 말하게 만드는 6가지 법칙. 심리학의 고전.',
    rating: 4.7,
    category: '심리학',
  },
  {
    id: 'book-26',
    title: '타이탄의 도구들',
    author: '팀 페리스',
    publisher: '토네이도',
    pubYear: 2017,
    isbn13: '9791158511432',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/11729/94/cover500/k882534659_1.jpg',
    description: '세계 최고의 성공자들이 공개하는 일, 부, 건강의 비밀.',
    rating: 4.5,
    category: '자기계발',
  },
  {
    id: 'book-27',
    title: '데미안',
    author: '헤르만 헤세',
    publisher: '민음사',
    pubYear: 2023,
    isbn13: '9788937462788',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/32561/77/cover500/8937462788_1.jpg',
    description: '자아를 찾아가는 청년의 성장 소설. 헤르만 헤세의 대표작.',
    rating: 4.6,
    category: '소설',
  },
  {
    id: 'book-28',
    title: '오늘도 무사히',
    author: '김수현',
    publisher: '문학동네',
    pubYear: 2023,
    isbn13: '9788954699228',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/32276/70/cover500/k652836874_1.jpg',
    description: '힘든 하루를 견디는 당신을 위한 위로의 메시지.',
    rating: 4.5,
    category: '에세이',
  },
  {
    id: 'book-29',
    title: '나는 나로 살기로 했다',
    author: '김수현',
    publisher: '마음의숲',
    pubYear: 2016,
    isbn13: '9791160260359',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/8621/77/cover500/k702533669_1.jpg',
    description: '타인의 시선이 아닌 나 자신을 위한 삶. 200만 부 판매 베스트셀러.',
    rating: 4.4,
    category: '에세이',
  },
  {
    id: 'book-30',
    title: '러닝 타입스크립트',
    author: '조시 골드버그',
    publisher: '한빛미디어',
    pubYear: 2023,
    isbn13: '9791169210225',
    coverUrl: '/example_image.png', // 'https://image.aladin.co.kr/product/32182/44/cover500/k052836774_1.jpg',
    description: 'TypeScript의 기본부터 고급 기능까지. 실무에서 바로 쓰는 타입스크립트.',
    rating: 4.7,
    category: '컴퓨터/IT',
  },
];

/**
 * ID로 도서 찾기
 */
export const findBookById = (id: string): Book | undefined => {
  return MOCK_BOOKS.find((book) => book.id === id);
};

/**
 * 검색어로 도서 필터링
 */
export const searchBooks = (query: string): Book[] => {
  if (!query.trim()) {
    return MOCK_BOOKS;
  }

  const lowerQuery = query.toLowerCase();
  return MOCK_BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.publisher.toLowerCase().includes(lowerQuery)
  );
};

/**
 * 베스트셀러 도서 (상위 10개)
 */
export const getBestsellers = (): Book[] => {
  return MOCK_BOOKS.slice(0, 10);
};

/**
 * 랜덤 도서 가져오기
 */
export const getRandomBooks = (count: number): Book[] => {
  const shuffled = [...MOCK_BOOKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * 신간 도서 가져오기
 * @description 2024년에 출판된 책들을 반환 (최대 6권)
 * @returns 신간 도서 목록
 *
 * @example
 * const newBooks = getNewBooks();
 * console.log(`신간 도서 ${newBooks.length}권`);
 */
export const getNewBooks = (): Book[] => {
  // 2024년 출판된 책들 필터링
  const newBooks = MOCK_BOOKS.filter((book) => book.pubYear === 2024);

  // 최대 6권만 반환
  return newBooks.slice(0, 6);
};

/**
 * Mock 도서관 데이터 (15개)
 * @description 서울 지역 주요 도서관 Mock 데이터
 */
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
  {
    id: 'lib-002',
    name: '강남구립도서관',
    address: '서울특별시 강남구 학동로 426',
    phone: '02-3445-0900',
    homepage: 'https://www.gangnam.go.kr/library',
    distanceKm: 2.5,
    latitude: 37.5172,
    longitude: 127.0473,
    openingHours: '평일 09:00-22:00, 주말 09:00-17:00',
    closedDays: '둘째, 넷째 월요일',
    type: '공공',
  },
  {
    id: 'lib-003',
    name: '서울시립중앙도서관',
    address: '서울특별시 중구 세종대로 110',
    phone: '02-120',
    homepage: 'https://lib.seoul.go.kr',
    distanceKm: 3.8,
    latitude: 37.5662,
    longitude: 126.9784,
    openingHours: '평일 09:00-20:00, 주말 09:00-18:00',
    closedDays: '매주 월요일',
    type: '시립',
  },
  {
    id: 'lib-004',
    name: '서초구립반포도서관',
    address: '서울특별시 서초구 신반포로 1길 15',
    phone: '02-590-0801',
    homepage: 'https://seocholib.or.kr',
    distanceKm: 1.8,
    latitude: 37.5043,
    longitude: 127.0046,
    openingHours: '평일 09:00-21:00, 주말 09:00-18:00',
    closedDays: '매주 월요일',
    type: '공공',
  },
  {
    id: 'lib-005',
    name: '송파도서관',
    address: '서울특별시 송파구 송파대로 37길 21',
    phone: '02-2147-2700',
    homepage: 'https://www.songpalib.or.kr',
    distanceKm: 4.2,
    latitude: 37.5051,
    longitude: 127.1103,
    openingHours: '평일 09:00-22:00, 주말 09:00-18:00',
    closedDays: '매주 월요일, 공휴일',
    type: '공공',
  },
  {
    id: 'lib-006',
    name: '마포평생학습관',
    address: '서울특별시 마포구 홍익로2길 16',
    phone: '02-3153-5800',
    homepage: 'https://www.mapolll.or.kr',
    distanceKm: 5.6,
    latitude: 37.5506,
    longitude: 126.9222,
    openingHours: '평일 09:00-22:00, 주말 09:00-18:00',
    closedDays: '매주 월요일',
    type: '평생학습',
  },
  {
    id: 'lib-007',
    name: '용산도서관',
    address: '서울특별시 용산구 두텁바위로 160',
    phone: '02-749-8100',
    homepage: 'https://www.yslib.or.kr',
    distanceKm: 3.5,
    latitude: 37.5298,
    longitude: 126.9656,
    openingHours: '평일 09:00-20:00, 주말 09:00-17:00',
    closedDays: '매주 월요일, 공휴일',
    type: '공공',
  },
  {
    id: 'lib-008',
    name: '양천구립도서관',
    address: '서울특별시 양천구 목동동로 81',
    phone: '02-2648-7822',
    homepage: 'https://www.yclibrary.seoul.kr',
    distanceKm: 7.8,
    latitude: 37.5262,
    longitude: 126.8658,
    openingHours: '평일 09:00-22:00, 주말 09:00-18:00',
    closedDays: '매주 월요일',
    type: '공공',
  },
  {
    id: 'lib-009',
    name: '노원어린이도서관',
    address: '서울특별시 노원구 한글비석로 573',
    phone: '02-933-7145',
    homepage: 'https://www.nowonlib.kr',
    distanceKm: 9.2,
    latitude: 37.6548,
    longitude: 127.0615,
    openingHours: '평일 09:00-18:00, 주말 09:00-17:00',
    closedDays: '매주 월요일, 공휴일',
    type: '어린이',
  },
  {
    id: 'lib-010',
    name: '성북구립도서관',
    address: '서울특별시 성북구 화랑로13길 32',
    phone: '02-918-4202',
    homepage: 'https://www.sblib.seoul.kr',
    distanceKm: 6.4,
    latitude: 37.5894,
    longitude: 127.0167,
    openingHours: '평일 09:00-21:00, 주말 09:00-18:00',
    closedDays: '매주 월요일',
    type: '공공',
  },
  {
    id: 'lib-011',
    name: '광진정보도서관',
    address: '서울특별시 광진구 아차산로78길 90',
    phone: '02-450-1645',
    homepage: 'https://www.gwangjinlib.seoul.kr',
    distanceKm: 5.8,
    latitude: 37.5481,
    longitude: 127.0826,
    openingHours: '평일 09:00-22:00, 주말 09:00-18:00',
    closedDays: '매주 월요일, 공휴일',
    type: '공공',
  },
  {
    id: 'lib-012',
    name: '동대문구정보화도서관',
    address: '서울특별시 동대문구 천호대로 227',
    phone: '02-2299-0771',
    homepage: 'https://www.ddmlib.or.kr',
    distanceKm: 7.1,
    latitude: 37.5744,
    longitude: 127.0406,
    openingHours: '평일 09:00-21:00, 주말 09:00-18:00',
    closedDays: '매주 월요일',
    type: '공공',
  },
  {
    id: 'lib-013',
    name: '서대문구립이진아기념도서관',
    address: '서울특별시 서대문구 성산로 526',
    phone: '02-3140-8695',
    homepage: 'https://www.sdmlib.or.kr',
    distanceKm: 6.9,
    latitude: 37.5792,
    longitude: 126.9367,
    openingHours: '평일 09:00-22:00, 주말 09:00-18:00',
    closedDays: '매주 월요일, 공휴일',
    type: '공공',
  },
  {
    id: 'lib-014',
    name: '영등포평생학습관',
    address: '서울특별시 영등포구 영중로 8길 26',
    phone: '02-2670-1379',
    homepage: 'https://www.ydplll.or.kr',
    distanceKm: 8.5,
    latitude: 37.5184,
    longitude: 126.9067,
    openingHours: '평일 09:00-22:00, 주말 09:00-17:00',
    closedDays: '매주 월요일',
    type: '평생학습',
  },
  {
    id: 'lib-015',
    name: '은평구립도서관',
    address: '서울특별시 은평구 은평로 289',
    phone: '02-385-8685',
    homepage: 'https://www.eplib.or.kr',
    distanceKm: 9.7,
    latitude: 37.6176,
    longitude: 126.9284,
    openingHours: '평일 09:00-21:00, 주말 09:00-18:00',
    closedDays: '매주 월요일, 공휴일',
    type: '공공',
  },
];

/**
 * ID로 도서관 찾기
 * @param id - 도서관 ID
 * @returns 도서관 정보 또는 undefined
 */
export const findLibraryById = (id: string): Library | undefined => {
  return MOCK_LIBRARIES.find((library) => library.id === id);
};

/**
 * 검색어로 도서관 필터링
 * @param query - 검색 키워드 (도서관명, 주소)
 * @returns 필터링된 도서관 목록
 *
 * @example
 * // 이름으로 검색
 * const results = searchLibraries('강남');
 *
 * @example
 * // 주소로 검색
 * const results = searchLibraries('서초구');
 */
export const searchLibraries = (query: string): Library[] => {
  if (!query.trim()) {
    return MOCK_LIBRARIES;
  }

  const lowerQuery = query.toLowerCase().trim();
  return MOCK_LIBRARIES.filter(
    (library) =>
      library.name.toLowerCase().includes(lowerQuery) ||
      library.address.toLowerCase().includes(lowerQuery) ||
      (library.type && library.type.toLowerCase().includes(lowerQuery))
  );
};

/**
 * 거리 기준으로 도서관 정렬
 * @param libraries - 도서관 목록
 * @returns 거리 순으로 정렬된 도서관 목록
 */
export const sortLibrariesByDistance = (libraries: Library[]): Library[] => {
  return [...libraries].sort((a, b) => {
    const distA = a.distanceKm ?? Infinity;
    const distB = b.distanceKm ?? Infinity;
    return distA - distB;
  });
};

/**
 * 특정 지역의 도서관 필터링
 * @param region - 지역명 (예: '강남구', '서초구')
 * @returns 해당 지역의 도서관 목록
 */
export const getLibrariesByRegion = (region: string): Library[] => {
  const lowerRegion = region.toLowerCase();
  return MOCK_LIBRARIES.filter((library) =>
    library.address.toLowerCase().includes(lowerRegion)
  );
};
