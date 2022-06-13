import React from 'react';
import NonSmokerBg from '../../assets/images/non-smoke.svg';
import SmokerBg from '../../assets/images/smoke.svg';
import styles from '../../styles/SocialCard.module.css';

const SocialCard = ({ data, setData }) => {
  return (
    <div className={styles.socialCardContainer}>
      {data.smoke === 'non-smoker' ? (
        <label className={styles.socialCard}>
          <input
            value='non-smoker'
            name='plan'
            className={styles.cardRadio}
            type='radio'
            onClick={(e) => setData({ smoke: e.target.value })}
            checked
          />
          <div className={styles.cardBody}>
            <img src={NonSmokerBg} alt='Non Smoker' />
            <br />
            <h3 className='header3'>NON-SMOKER</h3>
          </div>
        </label>
      ) : (
        <label className={styles.socialCard}>
          <input
            value='non-smoker'
            name='plan'
            className={styles.cardRadio}
            type='radio'
            onClick={(e) => setData({ smoke: e.target.value })}
          />
          <div className={styles.cardBody}>
            <img src={NonSmokerBg} alt='Non Smoker' />
            <br />
            <h3 className='header3'>NON-SMOKER</h3>
          </div>
        </label>
      )}
      {data.smoke === 'smoker' ? (
        <label className={styles.socialCard}>
          <input
            value='smoker'
            name='plan'
            className={styles.cardRadio}
            type='radio'
            onClick={(e) => setData({ smoke: e.target.value })}
            checked
          />
          <div className={styles.cardBody}>
            <img src={SmokerBg} alt='Smoker' />
            <br />
            <h3 className='header3'>SMOKER</h3>
          </div>
        </label>
      ) : (
        <label className={styles.socialCard}>
          <input
            value='smoker'
            name='plan'
            className={styles.cardRadio}
            type='radio'
            onClick={(e) => setData({ smoke: e.target.value })}
          />
          <div className={styles.cardBody}>
            <img src={SmokerBg} alt='Smoker' />
            <br />
            <h3 className='header3'>SMOKER</h3>
          </div>
        </label>
      )}
    </div>
  );
};

export default SocialCard;
