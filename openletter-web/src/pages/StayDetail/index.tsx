import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STAY_DETAILS } from '../../data/stays';
import type { StayDetail } from '../../types';
import styles from './StayDetail.module.css';

const COLOR_MAP: Record<string, string> = {
  'cp-b1': 'linear-gradient(135deg, #1e2e48 0%, #3a5472 100%)',
  'cp-b2': 'linear-gradient(135deg, #1a3040 0%, #2e5568 100%)',
  'cp-b3': 'linear-gradient(135deg, #0f1e38 0%, #28476a 100%)',
  'cp-b4': 'linear-gradient(135deg, #2a1e10 0%, #5a4030 100%)',
  'cp-b5': 'linear-gradient(135deg, #102838 0%, #1e5068 100%)',
  'cp-b6': 'linear-gradient(135deg, #221828 0%, #4a3860 100%)',
};

const BADGE_MAP: Record<string, { label: string; cls: string }> = {
  promo: { label: '프로모션', cls: styles.badgePromo },
  sale: { label: '마감할인', cls: styles.badgeSale },
  solo: { label: '단독소개', cls: styles.badgeSolo },
};

const TABS = ['스테이 소개', '객실 선택', '리뷰', '위치 및 정보', '안내사항'];

function TabIntro({ s }: { s: StayDetail }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>스테이 소개</h2>
      <p className={styles.descText}>{s.description}</p>
      <div className={styles.contentImg} style={{ background: COLOR_MAP[s.colorClass] || '#ccc' }}>
        {s.introImage && <img src={s.introImage} alt="스테이 소개" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.opacity = '0')} />}
      </div>
    </div>
  );
}

function TabRooms({ s }: { s: StayDetail }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>객실 선택</h2>
      <div className={styles.roomCard}>
        <div className={styles.roomImg} style={{ background: COLOR_MAP[s.colorClass] || '#ccc' }} />
        <div className={styles.roomBody}>
          <div className={styles.roomName}>{s.room.name}</div>
          <div className={styles.roomDesc}>{s.room.type} / 기준 {s.room.minGuests}명 (최대 {s.room.maxGuests}명)</div>
          <div className={styles.roomPriceRow}>
            {s.originalPrice && <span className={styles.priceOriginal}>₩{s.originalPrice.toLocaleString()}</span>}
            {s.discount && <span className={styles.discountRate}>{s.discount}%</span>}
            <span className={styles.priceFinal}>₩{s.finalPrice.toLocaleString()}~</span>
          </div>
          <button className={styles.roomReserveBtn} onClick={() => alert('예약하기 기능은 준비 중입니다.')}>이 객실 예약하기</button>
        </div>
      </div>
    </div>
  );
}

function TabReviews({ s }: { s: StayDetail }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>리뷰 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--light)' }}>{s.reviews.count}개</span></h2>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 40, fontWeight: 700 }}>{s.reviews.score.toFixed(1)}</span>
        <span style={{ fontSize: 14, color: 'var(--light)' }}>/ 5.0</span>
      </div>
      {s.sampleReviews.map((r, i) => (
        <div key={i} className={styles.reviewCard}>
          <div className={styles.reviewScoreBadge}>★ {r.score.toFixed(1)}</div>
          <div className={styles.reviewHeader}>
            <span className={styles.reviewerName}>{r.name}</span>
            <span className={styles.reviewDate}>{r.date}</span>
          </div>
          <p className={styles.reviewBody}>{r.text}</p>
        </div>
      ))}
    </div>
  );
}

function TabLocation({ s }: { s: StayDetail }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>위치 및 정보</h2>
      <div className={styles.mapPlaceholder}>🗺 지도 (준비 중)</div>
      <div className={styles.locationInfo}>
        <strong>{s.address}</strong><br />
        {s.locationDesc}
      </div>
    </div>
  );
}

function TabRules({ s }: { s: StayDetail }) {
  return (
    <div className={styles.tabSection}>
      <h2 className={styles.sectionHeading}>안내사항</h2>
      <div className={styles.checkinoutGrid}>
        <div className={styles.cioBox}><div className={styles.cioLabel}>체크인</div><div className={styles.cioTime}>{s.checkin}</div></div>
        <div className={styles.cioBox}><div className={styles.cioLabel}>체크아웃</div><div className={styles.cioTime}>{s.checkout}</div></div>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>이용 규칙</h3>
      <div className={styles.rulesGrid}>
        {s.rules.map((r, i) => (
          <div key={i} className={styles.ruleItem}><span className={styles.ruleDot} />{r}</div>
        ))}
      </div>
    </div>
  );
}

export function StayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabIdx, setTabIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const numId = Number(id);
  const stay = STAY_DETAILS[numId] || STAY_DETAILS[1];
  const bg = COLOR_MAP[stay.colorClass] || '#ccc';

  const TAB_CONTENT = [
    <TabIntro s={stay} />,
    <TabRooms s={stay} />,
    <TabReviews s={stay} />,
    <TabLocation s={stay} />,
    <TabRules s={stay} />,
  ];

  return (
    <div>
      {/* Hero Gallery */}
      <div className={styles.detailHero}>
        <div className={styles.heroGrid}>
          <button className={styles.heroBack} onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className={styles.heroActions}>
            <button className={styles.heroActionBtn} title="공유">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            <button className={styles.heroActionBtn} onClick={() => setBookmarked(p => !p)} title="북마크">
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          <div className={`${styles.heroItem} ${styles.heroMain}`} style={{ background: bg }}>
            {stay.introImage && <img src={stay.introImage} alt={stay.name} onError={e => (e.currentTarget.style.opacity = '0')} />}
          </div>
          {[2, 3, 4, 5].map(n => (
            <div key={n} className={`${styles.heroItem} ${styles.heroSub}`} style={{ background: bg }} />
          ))}

          <button className={styles.btnShowAll}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            사진 모두 보기
          </button>
        </div>
      </div>

      {/* Detail Body */}
      <div className={styles.detailBody}>
        {/* Left */}
        <div className={styles.detailLeft}>
          <div className={styles.detailHead}>
            <div>
              {stay.badges.length > 0 && (
                <div className={styles.detailBadges}>
                  {stay.badges.map(b => {
                    const m = BADGE_MAP[b];
                    return m ? <span key={b} className={`${styles.badge} ${m.cls}`}>{m.label}</span> : null;
                  })}
                </div>
              )}
              <h1 className={styles.detailName}>{stay.name}</h1>
              <p className={styles.detailLocation}>{stay.location}</p>
              <div className={styles.detailReviews}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--light)' }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>{stay.reviews.score.toFixed(1)}</span>
                <span className={styles.reviewLink}>후기 {stay.reviews.count}개</span>
              </div>
            </div>
          </div>

          {/* 쿠폰/프로모션 */}
          <div>
            {stay.coupon && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>쿠폰</span>
                <span className={styles.infoVal}>{stay.coupon}</span>
                <button className={styles.couponCta}>↓ 쿠폰 받기</button>
              </div>
            )}
            {stay.promo && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>프로모션</span>
                <span className={`${styles.infoVal} ${styles.infoLink}`}>{stay.promo}</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className={styles.detailTabs}>
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`${styles.detailTab} ${tabIdx === i ? styles.tabActive : ''}`}
                onClick={() => setTabIdx(i)}
              >
                {t}
              </button>
            ))}
          </div>

          <div>{TAB_CONTENT[tabIdx]}</div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.detailRight}>
          <div className={styles.sidebarBox}>
            <div className={styles.sdgRow}>
              <button className={styles.sdgBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <span className={styles.sdgLabel}>일정</span>
                  <span className={styles.sdgVal}>날짜 선택</span>
                </div>
              </button>
              <button className={styles.sdgBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <div>
                  <span className={styles.sdgLabel}>인원</span>
                  <span className={styles.sdgVal}>1명</span>
                </div>
              </button>
            </div>

            <div className={styles.sbRoom}>
              <div className={styles.sbRoomThumb} style={{ background: bg }} />
              <div className={styles.sbRoomInfo}>
                <div className={styles.sbRoomName}>{stay.room.name}</div>
                <div className={styles.sbRoomDesc}>{stay.room.type} / 기준 {stay.room.minGuests}명</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--light)', flexShrink: 0, marginTop: 2 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <div className={styles.sbPriceArea}>
              {stay.originalPrice && <div className={styles.sbOriginal}>₩{stay.originalPrice.toLocaleString()}</div>}
              <div className={styles.sbFinalRow}>
                {stay.discount && <span className={styles.sbDiscount}>{stay.discount}%</span>}
                <span className={styles.sbFinal}>₩{stay.finalPrice.toLocaleString()}</span>
                <span className={styles.sbPer}>/ 박</span>
              </div>
              <div className={styles.sbTotalRow}>
                <span className={styles.sbTotalLabel}>객실 요금</span>
                <span className={styles.sbTotalPrice}>₩{stay.finalPrice.toLocaleString()} × 1박</span>
              </div>
            </div>

            <div className={styles.sbReserveArea}>
              <button className={styles.reserveBtn} onClick={() => alert('예약하기 기능은 준비 중입니다.')}>예약하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
