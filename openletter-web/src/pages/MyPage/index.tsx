import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './MyPage.module.css';

const TABS = ['예약내역', '위시리스트', '쿠폰', '내 정보'];

export function MyPage() {
  const { user, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState(0);

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <div className={styles.loginIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2>로그인이 필요합니다</h2>
        <p>마이페이지를 이용하시려면 로그인해주세요.</p>
        <button className={styles.loginBtn} onClick={signInWithGoogle}>Google로 로그인</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.profileSection}>
        <div className={styles.profileAvatar}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="" />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
        <div>
          <h2 className={styles.profileName}>{user.displayName || '사용자'}님</h2>
          <p className={styles.profileEmail}>{user.email}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t, i) => (
          <button key={t} className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {tab === 0 && (
          <div className={styles.empty}>
            <p>예약 내역이 없습니다.</p>
            <p>첫 번째 스테이 여행을 계획해보세요.</p>
          </div>
        )}
        {tab === 1 && (
          <div className={styles.empty}>
            <p>위시리스트가 비어있습니다.</p>
            <p>마음에 드는 스테이를 저장해보세요.</p>
          </div>
        )}
        {tab === 2 && (
          <div className={styles.couponSection}>
            <div className={styles.couponCard}>
              <div className={styles.couponDiscount}>10%</div>
              <div>
                <div className={styles.couponTitle}>첫 예약 할인 쿠폰</div>
                <div className={styles.couponExpiry}>~ 2025. 12. 31.</div>
              </div>
            </div>
          </div>
        )}
        {tab === 3 && (
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>이름</span>
              <span className={styles.infoVal}>{user.displayName || '-'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>이메일</span>
              <span className={styles.infoVal}>{user.email || '-'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
