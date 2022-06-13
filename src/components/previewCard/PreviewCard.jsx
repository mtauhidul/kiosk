import React from 'react';
import styles from '../../styles/PreviewCard.module.css';

const PreviewCard = ({ icon, title, text, info }) => {
  return (
    <div className={styles.PreviewCardWrapper}>
      <div className={styles.PreviewCardHeader}>
        <img src={icon} alt='icon' />
        <h6 className='header6'>{title}</h6>
      </div>
      <div className={styles.PreviewCardBody}>
        <small>{text}</small>
        <div className={styles.list}>
          {info.map((i, index) => {
            return <strong key={index}>{i}</strong>;
          })}
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
