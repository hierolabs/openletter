import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const STATS = [
  { label: '총 예약', value: '0건', icon: '📅' },
  { label: '이번 달 수입', value: '₩0', icon: '💰' },
  { label: '리뷰 평점', value: '-', icon: '⭐' },
  { label: '총 조회수', value: '0회', icon: '👁' },
];

const MENU = ['내 숙소', '예약 관리', '정산', '리뷰', '설정'];

export function HostDashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo} onClick={() => navigate('/')}>
          OPEN LETTER<span>HOST</span>
        </div>
        <nav className={styles.sidebarNav}>
          {MENU.map(item => (
            <div key={item} className={styles.sidebarItem}>{item}</div>
          ))}
        </nav>
        <button className={styles.guestModeBtn} onClick={() => navigate('/')}>← 게스트 모드</button>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>호스트 대시보드</h1>
          <button className={styles.registerBtn} onClick={() => navigate('/host/register/select')}>
            + 새 숙소 등록
          </button>
        </div>

        <div className={styles.statsGrid}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>내 숙소</h2>
          <div className={styles.emptyState}>
            <p>등록된 숙소가 없습니다.</p>
            <p>첫 번째 숙소를 등록해보세요!</p>
            <button className={styles.emptyBtn} onClick={() => navigate('/host/register/select')}>숙소 등록하기</button>
          </div>
        </div>
      </main>
    </div>
  );
}
