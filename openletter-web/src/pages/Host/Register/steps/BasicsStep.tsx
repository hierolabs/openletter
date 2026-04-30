import { useState } from 'react';
import styles from '../Register.module.css';

export function BasicsStep() {
  const [counts, setCounts] = useState({ guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 });
  const items = [
    { key: 'guests', label: '최대 인원', min: 1 },
    { key: 'bedrooms', label: '침실', min: 0 },
    { key: 'beds', label: '침대', min: 1 },
    { key: 'bathrooms', label: '욕실', min: 1 },
  ] as const;

  function adjust(key: keyof typeof counts, dir: number) {
    const item = items.find(i => i.key === key)!;
    setCounts(p => ({ ...p, [key]: Math.max(item.min, p[key] + dir) }));
  }

  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>기본 정보를 입력해주세요</h1>
      <p className={styles.stepDesc}>인원과 공간 구성을 알려주세요.</p>
      {items.map(item => (
        <div key={item.key} className={styles.counterRow}>
          <span className={styles.counterLabel}>{item.label}</span>
          <div className={styles.counter}>
            <button className={styles.counterBtn} onClick={() => adjust(item.key, -1)} disabled={counts[item.key] <= item.min}>−</button>
            <span className={styles.counterNum}>{counts[item.key]}</span>
            <button className={styles.counterBtn} onClick={() => adjust(item.key, 1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
