import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Stay } from '../../types';
import styles from './StayCard.module.css';

const BADGE_CLS: Record<string, string> = {
  '단독소개': styles.badgePromo,
  '신규': styles.badgePromo,
  '마감할인': styles.badgeSale,
};

interface Props {
  stay: Stay | (Omit<Stay, 'id' | 'images'> & { _color: string; id?: number });
  colorClass?: string;
}

export function StayCard({ stay, colorClass }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();
  const cls = colorClass || stay._color || '';
  const hasId = 'id' in stay && stay.id;
  const images = 'images' in stay ? stay.images : [];

  function handleClick() {
    if (hasId) navigate(`/stays/${stay.id}`);
    else navigate('/stays');
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={`${styles.imgWrap} ${cls}`}>
        {images?.[0] ? (
          <img src={images[0]} alt={stay.name} />
        ) : (
          <div className={styles.placeholder}>{stay.name}</div>
        )}
        {(stay.badges || []).length > 0 && (
          <div className={styles.badges}>
            {(stay.badges || []).map(b => (
              <span key={b} className={`${styles.badge} ${BADGE_CLS[b] || styles.badgePromo}`}>{b}</span>
            ))}
          </div>
        )}
        <button
          className={`${styles.bookmark} ${bookmarked ? styles.saved : ''}`}
          onClick={e => { e.stopPropagation(); setBookmarked(p => !p); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{stay.name}</div>
        <div className={styles.meta}>{stay.region}{stay.district ? `, ${stay.district}` : ''} · {stay.capacity}</div>
        <div className={styles.priceRow}>
          <span className={styles.price}>₩{stay.price.toLocaleString()}~</span>
        </div>
      </div>
    </div>
  );
}
