import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../context/SearchModalContext';
import { StayCard } from '../../components/common/StayCard';
import { STAYS, CONCEPT_PLACEHOLDERS } from '../../data/stays';
import type { Stay } from '../../types';
import styles from './Home.module.css';

const CARD_COLORS = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6'];

const INFO_CARDS = [
  {
    title: 'OPEN LETTER HOUSE란?',
    desc: '로컬 문화와 함께하는 진짜 여행의 시작',
    bg: '#f5f0e8',
    emoji: '✉️',
  },
  {
    title: '숙소 관리가 귀찮다면?',
    desc: '오픈레터 관리 구독 서비스 — 숙소 운영을 우리에게 맡겨보세요',
    bg: '#eeebf8',
    emoji: '🏡',
  },
  {
    title: '매물부터 리모델링까지',
    desc: '숙소 컨설팅 서비스 — 매물 발굴부터 리모델링까지 직접 공급해드려요',
    bg: '#e8f0f8',
    emoji: '🔑',
  },
];

function InfoSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const total = INFO_CARDS.length;

  function slide(dir: 1 | -1) {
    const next = Math.max(0, Math.min(total - 1, idx + dir));
    setIdx(next);
    if (trackRef.current) {
      const card = trackRef.current.children[next] as HTMLElement;
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  return (
    <div className={styles.infoSection}>
      <div className={styles.infoHeader}>
        <h2 className={styles.infoTitle}>지금 확인해보세요</h2>
        <div className={styles.infoArrows}>
          <button className={styles.arrowBtn} onClick={() => slide(-1)} disabled={idx === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className={styles.arrowBtn} onClick={() => slide(1)} disabled={idx === total - 1}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      <div className={styles.infoTrack} ref={trackRef}>
        {INFO_CARDS.map((card) => (
          <div key={card.title} className={styles.infoCard} style={{ background: card.bg }}>
            <div className={styles.infoCardText}>
              <p className={styles.infoCardTitle}>{card.title}</p>
              <p className={styles.infoCardDesc}>{card.desc}</p>
            </div>
            <span className={styles.infoCardEmoji}>{card.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ConceptSectionProps {
  title: string;
  desc: string;
  category: string;
  linkCategory: string;
}

function ConceptSection({ title, desc, category, linkCategory }: ConceptSectionProps) {
  const real = STAYS.filter(s => s.categories?.includes(category)).slice(0, 4);
  const fills = (CONCEPT_PLACEHOLDERS[category] || []).slice(0, 4 - real.length);

  type PlaceholderStay = Omit<Stay, 'id' | 'images'> & { _color: string };
  const cards: Array<Stay | PlaceholderStay> = [...real, ...fills];

  return (
    <div className={styles.conceptSection}>
      <div className={styles.conceptHeader}>
        <div>
          <h2 className={styles.conceptTitle}>{title}</h2>
          <p className={styles.conceptDesc}>{desc}</p>
        </div>
        <Link to={`/stays?category=${encodeURIComponent(linkCategory)}`} className={styles.sectionArrow}>
          전체보기
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
      <div className={styles.cardGrid}>
        {cards.map((c, i) => (
          <StayCard key={'name' in c ? c.name + i : i} stay={c} colorClass={(c as PlaceholderStay)._color || CARD_COLORS[i % CARD_COLORS.length]} />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const { open } = useSearchModal();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>

      {/* ── 큰 검색바 ── */}
      <div className={styles.searchSection}>
        <div className={styles.searchPill} onClick={open}>
          <div className={styles.searchItem}>
            <span className={styles.searchLabel}>어디로</span>
            <span className={styles.searchPlaceholder}>여행지 검색</span>
          </div>
          <span className={styles.searchDivider} />
          <div className={styles.searchItem}>
            <span className={styles.searchLabel}>날짜</span>
            <span className={styles.searchPlaceholder}>날짜 추가</span>
          </div>
          <span className={styles.searchDivider} />
          <div className={styles.searchItem}>
            <span className={styles.searchLabel}>인원</span>
            <span className={styles.searchPlaceholder}>게스트 추가</span>
          </div>
          <button className={styles.searchBtn} onClick={e => { e.stopPropagation(); open(); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            검색
          </button>
        </div>
      </div>

      {/* ── 지도 찾기 배너 ── */}
      <section className={styles.banner} onClick={() => navigate('/neighborhood')}>
        <div className={styles.bannerInner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.8">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
          <span className={styles.bannerText}>
            어디에 살아야 할지 고민된다면? <strong>내 동네 찾기</strong>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </section>

      <InfoSlider />

      <ConceptSection title="아트 스테이" desc="예술가의 손길이 담긴 공간에서의 하룻밤" category="아트 스테이" linkCategory="아트 스테이" />
      <ConceptSection title="친환경 스테이" desc="자연과 함께 숨쉬는 지속 가능한 공간" category="친환경" linkCategory="친환경" />
      <ConceptSection title="로컬 스테이" desc="그 동네 사람처럼 살아보는 특별한 경험" category="로컬 스테이" linkCategory="로컬 스테이" />
    </div>
  );
}
