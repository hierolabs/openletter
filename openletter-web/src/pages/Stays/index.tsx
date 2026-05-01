import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StayCard } from '../../components/common/StayCard';
import { NaverMap } from '../../components/map/NaverMap';
import type { MapMarker } from '../../components/map/NaverMap';
import { STAYS, CONCEPT_PLACEHOLDERS, STAY_LATLNG, STAY_COFFEE_ROUTES, COFFEE_ROUTE_POIS } from '../../data/stays';
import type { Stay } from '../../types';
import styles from './Stays.module.css';

const CARD_COLORS = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6'];

const ROUTES = [
  { id: 'coffee',    emoji: '🥐', label: '커피향',    color: '#C17F3A' },
  { id: 'dawn',      emoji: '🌿', label: '새벽산책',  color: '#3A7D44' },
  { id: 'dog',       emoji: '🐕', label: '강아지산책', color: '#8B6355' },
  { id: 'season',    emoji: '🌸', label: '계절감성',  color: '#C2547A' },
  { id: 'food',      emoji: '🍜', label: '골목맛집',  color: '#C0392B' },
  { id: 'running',   emoji: '🏃', label: '러닝코스',  color: '#2471A3' },
  { id: 'bookstore', emoji: '📚', label: '동네서점',  color: '#5B3FA8' },
  { id: 'night',     emoji: '🌙', label: '야경산책',  color: '#1F3A7A' },
  { id: 'indie',     emoji: '🎨', label: '인디바이브', color: '#7B3FA8' },
  { id: 'cafe',      emoji: '☕', label: '스테디카페', color: '#4E342E' },
] as const;

type RouteId = typeof ROUTES[number]['id'];

export function StaysPage() {
  const [searchParams] = useSearchParams();
  const region   = searchParams.get('region')   || '';
  const category = searchParams.get('category') || '';
  const date     = searchParams.get('date')     || '';
  const guests   = searchParams.get('guests')   || '';

  const [activeRouteId, setActiveRouteId] = useState<RouteId>('coffee');
  const [hoveredStay, setHoveredStay] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredStayName, setHoveredStayName] = useState<string | null>(null);

  type PlaceholderStay = Omit<Stay, 'id' | 'images'> & { _color: string };

  const allStays: Array<Stay | PlaceholderStay> = [
    ...STAYS,
    ...Object.values(CONCEPT_PLACEHOLDERS).flat(),
  ];

  const filtered = allStays.filter(s => {
    if (category && !s.categories.includes(category)) return false;
    if (region && region !== '전체') {
      if (!s.region.includes(region) && !s.district?.includes(region) && !s.name.includes(region)) return false;
    }
    return true;
  });

  const mapMarkers: MapMarker[] = filtered
    .filter(s => s.name in STAY_LATLNG)
    .map(s => ({ ...STAY_LATLNG[s.name], name: s.name, price: s.price }));

  const mapCenter = mapMarkers.length > 0
    ? {
        lat: mapMarkers.reduce((sum, m) => sum + m.lat, 0) / mapMarkers.length,
        lng: mapMarkers.reduce((sum, m) => sum + m.lng, 0) / mapMarkers.length,
      }
    : { lat: 37.5665, lng: 126.9780 };

  const activeRoute = ROUTES.find(r => r.id === activeRouteId)!;

  const routeWaypoints = (
    hoveredStayName &&
    activeRouteId === 'coffee' &&
    STAY_COFFEE_ROUTES[hoveredStayName]
  ) || null;

  const routePOIs = activeRouteId === 'coffee' ? COFFEE_ROUTE_POIS : null;

  return (
    <div className={styles.page}>

      {/* ── 루트 필터 바 ── */}
      <div className={styles.routeBar}>
        {ROUTES.map(r => (
          <button
            key={r.id}
            className={`${styles.routeBtn} ${activeRouteId === r.id ? styles.routeBtnActive : ''}`}
            style={activeRouteId === r.id
              ? { '--route-color': r.color, borderColor: r.color, background: r.color } as React.CSSProperties
              : undefined}
            onClick={() => setActiveRouteId(r.id)}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>

      {/* ── 헤더 ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {category
            ? `${category} 스테이`
            : region && region !== '전체'
              ? `${region} 스테이`
              : '전체 스테이'}
        </h1>

        {/* 선택된 루트 표시 */}
        <div className={styles.activeRouteInfo}>
          <span className={styles.activeRouteDot} style={{ background: activeRoute.color }} />
          <span>{activeRoute.emoji} <strong>{activeRoute.label}</strong> 루트로 탐색 중</span>
        </div>

        {(region || date || guests) && (
          <div className={styles.searchInfo}>
            {region && region !== '전체' && <span>{region}</span>}
            {date && <span>{date}</span>}
            {guests && <span>{guests}</span>}
          </div>
        )}
        <p className={styles.count}>{filtered.length}개의 스테이</p>
      </div>

      {/* ── 카드 + 지도 레이아웃 ── */}
      <div className={styles.layout}>

        <div className={styles.cardList}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>검색 결과가 없습니다.</p>
              <p>다른 지역이나 날짜로 검색해보세요.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((s, i) => {
                const coord = STAY_LATLNG[s.name];
                return (
                  <StayCard
                    key={('id' in s ? s.id : '') + s.name + i}
                    stay={s}
                    colorClass={(s as PlaceholderStay)._color || CARD_COLORS[i % CARD_COLORS.length]}
                    onHoverStart={() => {
                      if (coord) { setHoveredStay(coord); setHoveredStayName(s.name); }
                    }}
                    onHoverEnd={() => { setHoveredStay(null); setHoveredStayName(null); }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.mapPanel}>
          <NaverMap
            markers={mapMarkers}
            center={mapCenter}
            zoom={mapMarkers.length === 1 ? 15 : 11}
            hoveredStay={hoveredStay}
            activeRoute={activeRoute}
            routeWaypoints={routeWaypoints}
            routePOIs={routePOIs}
          />
        </div>

      </div>
    </div>
  );
}
