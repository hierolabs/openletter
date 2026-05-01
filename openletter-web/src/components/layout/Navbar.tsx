import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSearchModal } from '../../context/SearchModalContext';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { open } = useSearchModal();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        OPEN LETTER
        <span>HOUSE</span>
      </Link>

      <div className={styles.navRight}>
        <button className={styles.hostBtn} onClick={() => navigate('/host')}>호스트 센터</button>

        <div className={styles.userMenuWrap} ref={dropdownRef}>
          <button
            className={styles.menuToggle}
            onClick={e => { e.stopPropagation(); setDropdownOpen(p => !p); }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className={styles.avatar} />
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#717171" stroke="none">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            )}
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              {user ? (
                <>
                  <div className={styles.ddHeader}>
                    <div className={styles.ddName}>{user.displayName || '사용자'}님</div>
                    <div className={styles.ddSub}>내 계정 관리</div>
                  </div>
                  {[['내 예약', '/mypage'], ['쿠폰', '/mypage'], ['내 리뷰', '/mypage'], ['메시지', '/mypage'], ['내 정보', '/mypage'], ['설정', '/mypage'], ['고객센터', '/mypage']].map(([label, href]) => (
                    <Link key={label} to={href} className={styles.ddItem} onClick={() => setDropdownOpen(false)}>{label}</Link>
                  ))}
                  <div className={styles.ddDivider} />
                  <button className={`${styles.ddItem} ${styles.ddLogout}`} onClick={() => { signOut(); setDropdownOpen(false); }}>로그아웃</button>
                </>
              ) : (
                <>
                  <button className={styles.ddItem} onClick={() => { signInWithGoogle(); setDropdownOpen(false); }}>로그인</button>
                  <a className={styles.ddItem} href="#">회원가입</a>
                  <div className={styles.ddDivider} />
                  <a className={styles.ddItem} href="#">고객센터</a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
