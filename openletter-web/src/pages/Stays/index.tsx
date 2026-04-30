import { useSearchParams } from 'react-router-dom';
import { StayCard } from '../../components/common/StayCard';
import { STAYS, CONCEPT_PLACEHOLDERS } from '../../data/stays';
import type { Stay } from '../../types';
import styles from './Stays.module.css';

const CARD_COLORS = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6'];

export function StaysPage() {
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') || '';
  const category = searchParams.get('category') || '';
  const date = searchParams.get('date') || '';
  const guests = searchParams.get('guests') || '';

  type PlaceholderStay = Omit<Stay, 'id' | 'images'> & { _color: string };

  const allStays: Array<Stay | PlaceholderStay> = [
    ...STAYS,
    ...Object.values(CONCEPT_PLACEHOLDERS).flat(),
  ];

  const filtered = allStays.filter(s => {
    if (category && !s.categories.includes(category)) return false;
    if (region && region !== '전체') {
      const r = region.toLowerCase();
      if (!s.region.includes(region) && !s.district?.includes(region) && !s.name.includes(region)) return false;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {category ? `${category} 스테이` : region && region !== '전체' ? `${region} 스테이` : '전체 스테이'}
        </h1>
        {(region || date || guests) && (
          <div className={styles.searchInfo}>
            {region && region !== '전체' && <span>{region}</span>}
            {date && <span>{date}</span>}
            {guests && <span>{guests}</span>}
          </div>
        )}
        <p className={styles.count}>{filtered.length}개의 스테이</p>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>검색 결과가 없습니다.</p>
          <p>다른 지역이나 날짜로 검색해보세요.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((s, i) => (
            <StayCard
              key={('id' in s ? s.id : '') + s.name + i}
              stay={s}
              colorClass={(s as PlaceholderStay)._color || CARD_COLORS[i % CARD_COLORS.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
