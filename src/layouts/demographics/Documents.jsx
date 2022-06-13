import React from 'react';
import DriversLicense from '../../assets/images/driversLic.svg';
import PatientsPicture from '../../assets/images/patientsPic.svg';
import Bottom from '../../components/Bottom/Bottom';
import ScanCard from '../../components/cards/ScanCard';
import store from '../../state/store';
import styles from '../../styles/Documents.module.css';

const Documents = () => {
  const state = store?.getState()?.data?.demographicsInfo;
  return (
    <div className={styles.documentsContainer}>
      <div className={styles.cardsContainer}>
        <ScanCard
          id='patientsPicture'
          title='PATIENT’S PICTURE'
          subTitle=''
          img={state.patientsPicture ? state.patientsPicture : PatientsPicture}
          alt='card'
          btnText='Take a picture'
        />
        <ScanCard
          id='driversLicense'
          title='DRIVER’S LICENSE'
          subTitle=''
          img={state.driversLicense ? state.driversLicense : DriversLicense}
          alt='card'
          btnText='Scan card'
        />
      </div>
      <Bottom />
    </div>
  );
};

export default Documents;
