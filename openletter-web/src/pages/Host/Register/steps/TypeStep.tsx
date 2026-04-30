import { useState } from 'react';
import styles from '../Register.module.css';

const TYPES = [
  { icon: '🏠', label: '단독주택', desc: '독채 주택 전체' },
  { icon: '🏢', label: '아파트', desc: '도심형 아파트' },
  { icon: '🏡', label: '별장/펜션', desc: '자연 속 독립 공간' },
  { icon: '🏯', label: '한옥', desc: '전통 한국 건축' },
  { icon: '🛖', label: '독채 캐빈', desc: '숲속 통나무집' },
  { icon: '🏨', label: '부티크 호텔', desc: '감성 소규모 호텔' },
];

export function TypeStep() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>어떤 유형의 숙소를 등록하시나요?</h1>
      <p className={styles.stepDesc}>숙소 유형을 선택해주세요.</p>
      <div className={styles.typeGrid}>
        {TYPES.map(t => (
          <div
            key={t.label}
            className={`${styles.typeCard} ${selected === t.label ? styles.typeCardSelected : ''}`}
            onClick={() => setSelected(t.label)}
          >
            <div className={styles.typeIcon}>{t.icon}</div>
            <div className={styles.typeLabel}>{t.label}</div>
            <div className={styles.typeDesc}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
