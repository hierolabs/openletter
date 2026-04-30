import styles from '../Register.module.css';

export function PhotosStep() {
  return (
    <div className={styles.stepPage}>
      <h1 className={styles.stepTitle}>숙소 사진을 추가해주세요</h1>
      <p className={styles.stepDesc}>최소 5장 이상의 사진을 업로드해주세요. 첫 번째 사진이 대표 사진으로 사용됩니다.</p>
      <div className={styles.photoDrop}>
        <div className={styles.photoDropIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div className={styles.photoDropTitle}>사진을 여기에 드래그하거나 클릭하여 업로드</div>
        <div className={styles.photoDropDesc}>JPG, PNG, WEBP (최대 10MB)</div>
      </div>
    </div>
  );
}
