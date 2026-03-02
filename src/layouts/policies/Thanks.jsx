import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/Animation/Pages";
import styles from "../../styles/Thanks.module.css";

const Thanks = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProgress(Math.min(Math.round((step / steps) * 100), 100));
      if (step >= steps) {
        clearInterval(timer);
        navigate("/preview");
      }
    }, interval);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <AnimatedPage>
      <div className={styles.thanksContainer}>
        <div className={styles.thanksWrapper}>
          <div className={styles.spinnerRing}>
            <svg viewBox="0 0 56 56" className={styles.spinnerSvg}>
              <circle
                className={styles.spinnerTrack}
                cx="28" cy="28" r="24"
                fill="none" strokeWidth="4"
              />
              <circle
                className={styles.spinnerArc}
                cx="28" cy="28" r="24"
                fill="none" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              />
            </svg>
            <span className={styles.spinnerPercent}>{progress}%</span>
          </div>

          <h2 className={styles.heading}>Preparing your summary&hellip;</h2>
          <p className={styles.subtext}>
            Please wait — we&rsquo;re loading all your information for a final
            review. <strong>Your check-in is not complete yet.</strong>
          </p>

          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressLabel}>
            You&rsquo;ll be able to review and confirm everything on the next screen.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Thanks;
