import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StayCard } from '../../components/common/StayCard';
import { STAYS, CONCEPT_PLACEHOLDERS } from '../../data/stays';
import type { Stay } from '../../types';
import styles from './Home.module.css';

const SLIDES = [
  {
    id: 1,
    title: '영감이 있는 공간, 아트 스테이',
    sub: '구 우체국 건물에 위치한 아트 스테이.\n예술과 함께 특별한 하루를 보내세요',
    bg: 'linear-gradient(135deg, #3d3028 0%, #6b4c3b 100%)',
    stayId: 1,
  },
  {
    id: 2,
    title: '자연이 선사하는 평온함',
    sub: '도심을 벗어나 자연 속에서\n진정한 휴식을 경험하세요',
    bg: 'linear-gradient(135deg, #2b3a4a 0%, #4a6580 100%)',
    stayId: 2,
  },
  {
    id: 3,
    title: '그 동네 사람처럼 살아보기',
    sub: '로컬 문화와 함께하는\n진짜 여행의 시작',
    bg: 'linear-gradient(135deg, #2d4235 0%, #4a7a5c 100%)',
    stayId: null,
  },
];

const CARD_COLORS = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6'];

interface ConceptSectionProps {
  title: string;
  desc: string;
  category: string;
  linkCategory: string;
}

function ConceptSection({ title, desc, category, linkCategory }: ConceptSectionProps) {
  const real = STAYS.filter(s => s.categories?.includes(category)).slice(0, 3);
  const fills = (CONCEPT_PLACEHOLDERS[category] || []).slice(0, 3 - real.length);

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
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(p => (p + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <section className={styles.hero}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
            style={{ background: slide.bg }}
          >
            <div className={styles.slideContent}>
              <h1 className={styles.slideTitle}>{slide.title}</h1>
              <p className={styles.slideSub}>{slide.sub}</p>
            </div>
          </div>
        ))}

        <button className={`${styles.arrow} ${styles.prev}`} onClick={() => setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className={`${styles.arrow} ${styles.next}`} onClick={() => setCurrent(p => (p + 1) % SLIDES.length)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className={styles.dots}>
          {SLIDES.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>

        <div className={styles.counter}>{current + 1} / {SLIDES.length}</div>
      </section>

      {/* Concept Sections */}
      <ConceptSection title="아트 스테이" desc="예술가의 손길이 담긴 공간에서의 하룻밤" category="아트 스테이" linkCategory="아트 스테이" />
      <ConceptSection title="친환경 스테이" desc="자연과 함께 숨쉬는 지속 가능한 공간" category="친환경" linkCategory="친환경" />
      <ConceptSection title="로컬 스테이" desc="그 동네 사람처럼 살아보는 특별한 경험" category="로컬 스테이" linkCategory="로컬 스테이" />
    </div>
  );
}
