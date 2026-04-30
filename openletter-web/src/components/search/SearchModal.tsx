import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchModal } from '../../context/SearchModalContext';
import { AC_DATA, DOMESTIC_REGIONS, OVERSEAS_REGIONS } from '../../data/stays';
import type { GuestCounts } from '../../types';
import styles from './SearchModal.module.css';

const today = new Date();
today.setHours(0, 0, 0, 0);

function fmtDate(d: Date) {
  return (d.getMonth() + 1) + '/' + d.getDate();
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const BADGE_MAP: Record<string, string> = {
  region: 'region',
  stay: 'stay',
};

interface CalendarProps {
  checkin: Date | null;
  checkout: Date | null;
  onSelect: (date: Date) => void;
  baseYear: number;
  baseMonth: number;
  onNav: (dir: number) => void;
}

function Calendar({ checkin, checkout, onSelect, baseYear, baseMonth, onNav }: CalendarProps) {
  const [hover, setHover] = useState<Date | null>(null);

  function getNextMonth() {
    let m = baseMonth + 1, y = baseYear;
    if (m > 11) { m = 0; y++; }
    return { year: y, month: m };
  }

  function getCellState(date: Date) {
    let isStart = false, isEnd = false, isInRange = false;
    if (checkin && checkout) {
      isStart = date.getTime() === checkin.getTime();
      isEnd = date.getTime() === checkout.getTime();
      isInRange = date > checkin && date < checkout;
    } else if (checkin) {
      if (hover) {
        const lo = checkin <= hover ? checkin : hover;
        const hi = checkin <= hover ? hover : checkin;
        isStart = date.getTime() === lo.getTime();
        isEnd = date.getTime() === hi.getTime();
        isInRange = date > lo && date < hi;
      } else {
        isStart = date.getTime() === checkin.getTime();
      }
    }
    return { isStart, isEnd, isInRange };
  }

  function renderMonth(year: number, month: number) {
    const firstDay = getFirstDay(year, month);
    const days = getDaysInMonth(year, month);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e-${i}`} className={styles.calCell} />);
    }
    for (let d = 1; d <= days; d++) {
      const date = new Date(year, month, d);
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const dow = date.getDay();
      const { isStart, isEnd, isInRange } = getCellState(date);

      const cls = [
        styles.calCell,
        isPast ? styles.disabled : '',
        isToday ? styles.todayCell : '',
        isStart ? styles.rangeStart : '',
        isEnd ? styles.rangeEnd : '',
        isInRange ? styles.inRange : '',
        dow === 0 ? styles.dowSun : '',
        dow === 6 ? styles.dowSat : '',
      ].filter(Boolean).join(' ');

      cells.push(
        <div
          key={d}
          className={cls}
          onClick={() => !isPast && onSelect(date)}
          onMouseEnter={() => !isPast && checkin && !checkout && setHover(date)}
        >
          <div className={styles.calDayBg} />
          <div className={styles.calDayNum}>{d}</div>
        </div>
      );
    }
    return (
      <div className={styles.calMonth}>
        <div className={styles.calMonthHeader}>
          <span className={styles.calMonthTitle}>{year}년 {month + 1}월</span>
        </div>
        <div className={styles.calGrid}>
          {DOW.map((d, i) => (
            <div key={d} className={`${styles.calDow}${i === 0 ? ' ' + styles.calDowSun : i === 6 ? ' ' + styles.calDowSat : ''}`}>{d}</div>
          ))}
          {cells}
        </div>
      </div>
    );
  }

  const { year: y1, month: m1 } = getNextMonth();
  const isPrevDisabled = baseYear === today.getFullYear() && baseMonth === today.getMonth();

  return (
    <div
      className={styles.calNavRow}
      onMouseLeave={() => setHover(null)}
    >
      <button
        className={styles.calNavBtn}
        onClick={() => onNav(-1)}
        disabled={isPrevDisabled}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div className={styles.calMonths}>
        {renderMonth(baseYear, baseMonth)}
        {renderMonth(y1, m1)}
      </div>
      <button className={styles.calNavBtn} onClick={() => onNav(1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export function SearchModal() {
  const { isOpen, close } = useSearchModal();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [autocomplete, setAutocomplete] = useState<typeof AC_DATA>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const [checkin, setCheckin] = useState<Date | null>(null);
  const [checkout, setCheckout] = useState<Date | null>(null);
  const [baseYear, setBaseYear] = useState(today.getFullYear());
  const [baseMonth, setBaseMonth] = useState(today.getMonth());
  const [calOpen, setCalOpen] = useState(false);

  const [guests, setGuests] = useState<GuestCounts>({ adult: 1, child: 0, infant: 0 });
  const [guestOpen, setGuestOpen] = useState(false);

  const [tab, setTab] = useState<'domestic' | 'overseas'>('domestic');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['전체']);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  function handleInput(val: string) {
    setQuery(val);
    if (val.trim()) {
      const matches = AC_DATA.filter(item => item.name.includes(val.trim()));
      setAutocomplete(matches);
      setShowAutocomplete(matches.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  }

  function selectAutocomplete(name: string) {
    setQuery(name);
    setShowAutocomplete(false);
  }

  function handleDateClick() {
    setGuestOpen(false);
    setCalOpen(p => !p);
  }

  function handleGuestClick() {
    setCalOpen(false);
    setGuestOpen(p => !p);
  }

  function handleCalSelect(date: Date) {
    if (!checkin || checkout) {
      setCheckin(date);
      setCheckout(null);
    } else if (date.getTime() === checkin.getTime()) {
      setCheckin(null);
    } else if (date < checkin) {
      setCheckin(date);
      setCheckout(null);
    } else {
      setCheckout(date);
    }
  }

  function handleCalNav(dir: number) {
    let m = baseMonth + dir, y = baseYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    if (y < today.getFullYear() || (y === today.getFullYear() && m < today.getMonth())) {
      return;
    }
    setBaseYear(y);
    setBaseMonth(m);
  }

  function adjustGuest(type: keyof GuestCounts, dir: number) {
    const min = type === 'adult' ? 1 : 0;
    setGuests(prev => ({ ...prev, [type]: Math.max(min, prev[type] + dir) }));
  }

  function toggleRegion(region: string) {
    const regions = tab === 'domestic' ? DOMESTIC_REGIONS : OVERSEAS_REGIONS;
    if (region === '전체') {
      setSelectedRegions(['전체']);
    } else {
      const next = selectedRegions.filter(r => r !== '전체');
      if (next.includes(region)) {
        const after = next.filter(r => r !== region);
        setSelectedRegions(after.length ? after : ['전체']);
      } else {
        setSelectedRegions([...next, region]);
      }
    }
  }

  function reset() {
    setQuery('');
    setCheckin(null);
    setCheckout(null);
    setGuests({ adult: 1, child: 0, infant: 0 });
    setSelectedRegions(['전체']);
    setCalOpen(false);
    setGuestOpen(false);
    setBaseYear(today.getFullYear());
    setBaseMonth(today.getMonth());
  }

  function doSearch() {
    const regionVal = query.trim() || (selectedRegions.includes('전체') ? '' : selectedRegions.join(','));
    const params = new URLSearchParams();
    if (regionVal) params.set('region', regionVal);
    if (checkin && checkout) {
      const nights = Math.round((checkout.getTime() - checkin.getTime()) / 86400000);
      params.set('date', fmtDate(checkin) + '~' + fmtDate(checkout) + '(' + nights + '박)');
    }
    const total = guests.adult + guests.child + guests.infant;
    params.set('guests', total + '명');
    close();
    navigate('/stays?' + params.toString());
  }

  const dateLabel = checkin && checkout
    ? `${fmtDate(checkin)} ~ ${fmtDate(checkout)} (${Math.round((checkout.getTime() - checkin.getTime()) / 86400000)}박)`
    : checkin ? `${fmtDate(checkin)} ~` : '날짜를 선택해주세요';
  const guestTotal = guests.adult + guests.child + guests.infant;
  const regions = tab === 'domestic' ? DOMESTIC_REGIONS : OVERSEAS_REGIONS;

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <h2>어디로 떠날까요?</h2>
          <button className={styles.closeBtn} onClick={close}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* 검색 입력 */}
          <div className={styles.inputWrap}>
            <div className={styles.searchInput}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--light)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="지역 또는 숙소명"
                value={query}
                onChange={e => handleInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
              />
              {query && (
                <button className={styles.clearBtn} onClick={() => { setQuery(''); setShowAutocomplete(false); inputRef.current?.focus(); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </button>
              )}
            </div>
            {showAutocomplete && (
              <div className={styles.autocomplete}>
                {autocomplete.map(item => (
                  <div key={item.name} className={styles.autocompleteItem} onMouseDown={() => selectAutocomplete(item.name)}>
                    <span className={styles.autocompleteIcon}>
                      {item.type === 'region' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      )}
                    </span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 날짜 + 인원 */}
          <div className={styles.modalRow}>
            <div className={`${styles.rowItem} ${calOpen ? styles.rowItemActive : ''}`} onClick={handleDateClick}>
              <svg className={styles.rowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div>
                <div className={styles.rowLabel}>날짜</div>
                <div className={styles.rowVal}>{dateLabel}</div>
              </div>
            </div>
            <div className={styles.rowDivider} />
            <div className={`${styles.rowItem} ${styles.rowItemGuest} ${guestOpen ? styles.rowItemActive : ''}`} onClick={handleGuestClick}>
              <svg className={styles.rowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <div>
                <div className={styles.rowLabel}>인원</div>
                <div className={styles.rowVal}>{guestTotal}명</div>
              </div>
            </div>
          </div>

          {/* 달력 */}
          {calOpen && (
            <div className={styles.calendarPanel}>
              <Calendar
                checkin={checkin}
                checkout={checkout}
                onSelect={handleCalSelect}
                baseYear={baseYear}
                baseMonth={baseMonth}
                onNav={handleCalNav}
              />
            </div>
          )}

          {/* 인원 */}
          {guestOpen && (
            <div className={styles.guestPanel}>
              <div className={styles.guestInner}>
                {([
                  { key: 'adult', label: '성인', desc: '' },
                  { key: 'child', label: '아동', desc: '24개월 ~ 12세' },
                  { key: 'infant', label: '영아', desc: '24개월 미만' },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className={styles.guestRow}>
                    <div>
                      <div className={styles.guestType}>{label}</div>
                      {desc && <div className={styles.guestDesc}>{desc}</div>}
                    </div>
                    <div className={styles.guestCounter}>
                      <button className={styles.guestBtn} onClick={() => adjustGuest(key, -1)} disabled={guests[key] <= (key === 'adult' ? 1 : 0)}>−</button>
                      <span className={styles.guestNum}>{guests[key]}</span>
                      <button className={styles.guestBtn} onClick={() => adjustGuest(key, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 탭 */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'domestic' ? styles.tabActive : ''}`} onClick={() => setTab('domestic')}>국내</button>
            <button className={`${styles.tab} ${tab === 'overseas' ? styles.tabActive : ''}`} onClick={() => setTab('overseas')}>해외</button>
          </div>

          {/* 지역 pill */}
          <div className={styles.regionSection}>
            <div className={styles.regionTitle}>{tab === 'domestic' ? '국내' : '해외'}</div>
            <div className={styles.pills}>
              {regions.map(r => (
                <button
                  key={r}
                  className={`${styles.pill} ${selectedRegions.includes(r) ? styles.pillSelected : ''}`}
                  onClick={() => toggleRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.resetBtn} onClick={reset}>초기화</button>
          <button className={styles.searchBtn} onClick={doSearch}>검색</button>
        </div>
      </div>
    </div>
  );
}
