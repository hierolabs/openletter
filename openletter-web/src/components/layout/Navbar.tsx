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
        <div className={styles.searchBox} onClick={open}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          어디로 떠날까요?
        </div>

        <button className={styles.hostBtn} onClick={() => navigate('/host')}>호스트 센터</button>

        {!user && (
          <button className={styles.loginBtn} onClick={signInWithGoogle}>로그인</button>
        )}

        <div className={styles.userMenuWrap} ref={dropdownRef}>
          <button
            className={styles.iconBtn}
            onClick={e => { e.stopPropagation(); setDropdownOpen(p => !p); }}
            title="내 계정"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
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

        <button className={styles.iconBtn} title="언어">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
