import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const STEPS = [
  { path: 'type', label: '숙소 유형' },
  { path: 'concept', label: '컨셉' },
  { path: 'basics', label: '기본 정보' },
  { path: 'description', label: '설명' },
  { path: 'location', label: '위치' },
  { path: 'photos', label: '사진' },
  { path: 'price', label: '가격' },
];

const STEP_PATHS = STEPS.map(s => s.path);

export function RegisterLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStep = STEP_PATHS.findIndex(p => location.pathname.endsWith(p));
  const total = STEP_PATHS.length;
  const progress = currentStep >= 0 ? ((currentStep + 1) / total) * 100 : 0;

  function goPrev() {
    if (currentStep > 0) navigate(`/host/register/${STEP_PATHS[currentStep - 1]}`);
    else navigate('/host/register/select');
  }

  function goNext() {
    if (currentStep >= 0 && currentStep < total - 1) {
      navigate(`/host/register/${STEP_PATHS[currentStep + 1]}`);
    } else if (currentStep === total - 1) {
      navigate('/host/register/success');
    }
  }

  const isSuccess = location.pathname.endsWith('success');

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerHeader}>
        <div className={styles.registerLogo} onClick={() => navigate('/')}>OPEN LETTER <span>HOST</span></div>
        {!isSuccess && currentStep >= 0 && (
          <div className={styles.stepIndicator}>{currentStep + 1} / {total}</div>
        )}
      </div>

      {!isSuccess && currentStep >= 0 && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className={styles.registerContent}>
        <Outlet />
      </div>

      {!isSuccess && currentStep >= 0 && (
        <div className={styles.registerFooter}>
          <button className={styles.prevBtn} onClick={goPrev}>이전</button>
          <button className={styles.nextBtn} onClick={goNext}>
            {currentStep === total - 1 ? '등록 완료' : '다음'}
          </button>
        </div>
      )}
    </div>
  );
}
