import type { Stay, StayDetail } from '../types';

export const STAYS: Stay[] = [
  {
    id: 1,
    name: '오픈레터하우스',
    region: '서울',
    district: '신당동',
    categories: ['아트 스테이'],
    capacity: '2~4명',
    price: 150000,
    badges: ['단독소개'],
    description: '편지처럼 남겨지는 공간',
    images: ['/images/stays/openletter-house/main.svg'],
  },
  {
    id: 2,
    name: '초록재',
    region: '서울',
    district: '강동',
    categories: ['친환경'],
    capacity: '2~4명',
    price: 130000,
    badges: [],
    description: '자연과 함께하는 친환경 공간',
    images: ['/images/stays/chorok-jae/main.svg'],
  },
  {
    id: 3,
    name: '천호재',
    region: '서울',
    district: '강동구',
    categories: ['로컬 스테이'],
    capacity: '2~4명',
    price: 120000,
    badges: ['신규'],
    description: '카페 골목에 숨어있는 조용한 공간',
    images: [],
  },
];

export const CONCEPT_PLACEHOLDERS: Record<string, Array<Omit<Stay, 'id' | 'images'> & { _color: string }>> = {
  '아트 스테이': [
    { name: '파란 아틀리에', region: '경기', district: '파주시', categories: ['아트 스테이'], capacity: '2~4명', price: 180000, badges: [], description: '', _color: 'cp-3' },
    { name: '갤러리하우스', region: '부산', district: '수영구', categories: ['아트 스테이'], capacity: '2~4명', price: 160000, badges: [], description: '', _color: 'cp-5' },
    { name: '모노스튜디오', region: '제주', district: '애월읍', categories: ['아트 스테이'], capacity: '1~2명', price: 170000, badges: [], description: '', _color: 'cp-1' },
  ],
  '친환경': [
    { name: '숲속의 집', region: '강원', district: '홍천군', categories: ['친환경'], capacity: '2~6명', price: 140000, badges: [], description: '', _color: 'cp-2' },
    { name: '흙집스테이', region: '전남', district: '순천시', categories: ['친환경'], capacity: '2~4명', price: 120000, badges: [], description: '', _color: 'cp-4' },
    { name: '솔숲재', region: '경북', district: '영양군', categories: ['친환경'], capacity: '2~4명', price: 125000, badges: [], description: '', _color: 'cp-6' },
  ],
  '로컬 스테이': [
    { name: '서촌골방', region: '서울', district: '종로구', categories: ['로컬 스테이'], capacity: '1~2명', price: 110000, badges: [], description: '', _color: 'cp-1' },
    { name: '부산골목집', region: '부산', district: '초량동', categories: ['로컬 스테이'], capacity: '2~4명', price: 130000, badges: [], description: '', _color: 'cp-6' },
    { name: '전주한옥', region: '전북', district: '전주시', categories: ['로컬 스테이'], capacity: '2~6명', price: 150000, badges: [], description: '', _color: 'cp-4' },
  ],
};

export const STAY_DETAILS: Record<number, StayDetail> = {
  1: {
    id: 1,
    name: '오픈레터하우스',
    location: '서울, 신당동',
    colorClass: 'cp-b1',
    badges: ['promo'],
    reviews: { score: 4.9, count: 24 },
    originalPrice: 139000,
    discount: 14,
    finalPrice: 119000,
    coupon: '1개 쿠폰 사용 가능',
    promo: '[3.26.~4.26.] 3~5월 투숙 시 최대 20% 할인 및 기프트',
    introImage: '/images/stays/openletter-house/main.svg',
    room: { name: '103 소담', type: '기본형', minGuests: 2, maxGuests: 2 },
    description: `편지처럼 남겨지는 공간, 오픈레터하우스는 서울 신당동 구 우체국 건물에 자리한 아트 스테이입니다. 오래된 건물의 뼈대를 살려 현대적으로 재해석한 공간으로, 도심 속 예술적인 휴식을 선사합니다.\n\n자연 채광이 가득한 내부에는 예술 작품과 따뜻한 조명이 어우러져, 시간이 멈춘 듯한 여유로움을 경험할 수 있습니다.`,
    address: '서울특별시 중구 신당동 123',
    locationDesc: '신당역 3번 출구에서 도보 5분, 황학동 벼룩시장 인근에 위치합니다.',
    checkin: '15:00',
    checkout: '11:00',
    rules: ['반려동물 동반 불가', '흡연 금지', '파티 및 행사 금지', '22:00 이후 소음 주의', '추가 인원 입실 불가', '취사 가능 (조리도구 구비)'],
    sampleReviews: [
      { name: '김*현', date: '2025. 3. 15.', score: 5.0, text: '조용하고 아늑한 공간이었어요. 사진과 실제가 동일하고 어메니티도 너무 좋았습니다.' },
      { name: '이*진', date: '2025. 2. 28.', score: 4.9, text: '전포 카페거리 근처라 위치도 좋고, 공간이 생각보다 훨씬 넓었어요.' },
      { name: '박*은', date: '2025. 1. 10.', score: 5.0, text: '혼자 여행으로 왔는데 완전 힐링했어요. 조명도 예쁘고 비품도 충분히 갖춰져 있었어요.' },
    ],
  },
  2: {
    id: 2,
    name: '초록재',
    location: '서울, 강동',
    colorClass: 'cp-b2',
    badges: [],
    reviews: { score: 4.8, count: 12 },
    originalPrice: null,
    discount: null,
    finalPrice: 130000,
    coupon: null,
    promo: null,
    room: { name: '메인 하우스', type: '기본형', minGuests: 2, maxGuests: 4 },
    description: `자연과 함께하는 친환경 공간, 초록재입니다. 서울 강동구의 조용한 주거 지역에 위치하여 도시 속 자연의 여유를 즐길 수 있는 친환경 스테이입니다.\n\n모든 자재를 천연 소재로 마감하였으며, 텃밭과 정원을 갖춘 공간에서 느긋한 휴식을 즐기세요.`,
    address: '서울특별시 강동구 123',
    locationDesc: '강동역에서 도보 10분 거리에 위치합니다.',
    checkin: '15:00',
    checkout: '11:00',
    rules: ['반려동물 협의 가능', '흡연 금지', '22:00 이후 소음 주의', '취사 가능'],
    sampleReviews: [
      { name: '최*우', date: '2025. 3. 10.', score: 5.0, text: '정원이 정말 예뻐요. 자연 속에서 힐링하고 왔습니다!' },
      { name: '정*희', date: '2025. 2. 20.', score: 4.7, text: '친환경 소재로 된 인테리어가 정말 편안했어요.' },
    ],
  },
  3: {
    id: 3,
    name: '천호재',
    location: '서울, 강동구',
    colorClass: 'cp-b3',
    badges: ['신규'],
    reviews: { score: 4.7, count: 5 },
    originalPrice: null,
    discount: null,
    finalPrice: 120000,
    coupon: null,
    promo: null,
    introImage: undefined,
    room: { name: '마루방', type: '기본형', minGuests: 2, maxGuests: 4 },
    description: `카페 골목 사이에 자리한 로컬 스테이, 천호재입니다. 강동구 천호대로를 따라 메가커피, 스타벅스, 이디야 등 다양한 카페들이 도보권에 있어 커피 산책을 즐기기에 최적입니다.\n\n낡은 빌라를 리모델링한 공간으로, 낮은 층고와 나무 마감이 주는 아늑함 속에 긴 여유를 즐길 수 있습니다.`,
    address: '서울특별시 강동구 천호대로 1156-5',
    locationDesc: '천호역 2번 출구에서 도보 7분 거리에 위치합니다.',
    checkin: '15:00',
    checkout: '11:00',
    rules: ['반려동물 협의 가능', '흡연 금지', '22:00 이후 소음 주의', '취사 가능'],
    sampleReviews: [
      { name: '한*수', date: '2025. 4. 10.', score: 4.8, text: '천호역에서 가깝고 주변 카페가 많아 너무 좋았어요!' },
      { name: '오*진', date: '2025. 4. 02.', score: 4.6, text: '조용하고 아늑한 공간. 커피 루트 다 돌아봤어요.' },
    ],
  },
};

export const AC_DATA = [
  { type: 'region', name: '서울' },
  { type: 'region', name: '제주' },
  { type: 'region', name: '강원' },
  { type: 'region', name: '강릉' },
  { type: 'region', name: '춘천' },
  { type: 'region', name: '양양' },
  { type: 'region', name: '부산' },
  { type: 'region', name: '경주' },
  { type: 'region', name: '전주' },
  { type: 'region', name: '남원' },
  { type: 'region', name: '양평' },
  { type: 'region', name: '가평' },
  { type: 'region', name: '인천' },
  { type: 'region', name: '남해' },
  { type: 'region', name: '평창' },
  { type: 'region', name: '전라' },
  { type: 'region', name: '경상' },
  { type: 'region', name: '충청' },
  { type: 'stay', name: '오픈레터하우스' },
  { type: 'stay', name: '초록재' },
  { type: 'stay', name: '천호재' },
];

export const DOMESTIC_REGIONS = ['전체', '서울', '제주', '강원', '강릉', '춘천', '양양', '부산', '경상', '경주', '전라', '전주', '남원', '경기', '양평', '가평', '인천', '충청'];
export const OVERSEAS_REGIONS = ['전체', '일본', '태국', '베트남', '발리', '유럽'];

// 숙소별 위경도 (네이버 지도 마커용)
export const STAY_LATLNG: Record<string, { lat: number; lng: number }> = {
  '오픈레터하우스': { lat: 37.5592, lng: 127.0097 }, // 서울 신당동
  '초록재':         { lat: 37.5499, lng: 127.1478 }, // 서울 강동구
  '천호재':         { lat: 37.5384, lng: 127.1240 }, // 서울 강동구 천호대로 1156-5
  '파란 아틀리에':  { lat: 37.7572, lng: 126.7821 }, // 경기 파주시
  '갤러리하우스':   { lat: 35.1672, lng: 129.1132 }, // 부산 수영구
  '숲속의 집':      { lat: 37.6978, lng: 127.8894 }, // 강원 홍천군
  '흙집스테이':     { lat: 34.9501, lng: 127.4871 }, // 전남 순천시
  '서촌골방':       { lat: 37.5832, lng: 126.9704 }, // 서울 종로구 서촌
  '부산골목집':     { lat: 35.1097, lng: 129.0325 }, // 부산 초량동
  '전주한옥':       { lat: 35.8177, lng: 127.1536 }, // 전북 전주시
};

export interface RoutePOI {
  lat: number;
  lng: number;
  name: string;
  walkMinutes: number;
  description?: string;
}

// 커피향 루트 카페 핀 (강동구 천호 일대 실제 카페)
export const COFFEE_ROUTE_POIS: RoutePOI[] = [
  { lat: 37.5382, lng: 127.1258, name: '메가커피 천호역점', walkMinutes: 3, description: '24시간 운영 · 넓은 좌석' },
  { lat: 37.5376, lng: 127.1275, name: '스타벅스 천호점', walkMinutes: 7, description: '천호대로 창가 뷰 · 리저브 메뉴' },
  { lat: 37.5369, lng: 127.1284, name: '어라운드커피', walkMinutes: 10, description: '독립카페 · 원두 직접 로스팅' },
  { lat: 37.5361, lng: 127.1271, name: '투썸플레이스 강동점', walkMinutes: 13, description: '케이크 종류 다양 · 조용한 분위기' },
  { lat: 37.5371, lng: 127.1248, name: '빈티지로스터스', walkMinutes: 5, description: '독립카페 · 브런치 메뉴 있음' },
];

// 숙소별 커피향 루트 절대좌표 (실제 주변 카페 기반)
export const STAY_COFFEE_ROUTES: Record<string, { lat: number; lng: number }[]> = {
  '천호재': [
    { lat: 37.5384, lng: 127.1240 }, // 천호재 출발
    { lat: 37.5383, lng: 127.1258 }, // 메가커피 천호역점
    { lat: 37.5377, lng: 127.1274 }, // 스타벅스 천호점
    { lat: 37.5369, lng: 127.1283 }, // 이디야커피 강동점
    { lat: 37.5358, lng: 127.1271 }, // 투썸플레이스 강동
    { lat: 37.5362, lng: 127.1252 }, // 컴포즈커피 천호
    { lat: 37.5371, lng: 127.1238 }, // 빽다방 천호역
    { lat: 37.5384, lng: 127.1240 }, // 천호재 귀환
  ],
};
