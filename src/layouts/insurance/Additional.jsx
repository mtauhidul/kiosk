import { Button } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/buttons/BackButton';
import styles from '../../styles/Additional.module.css';
import { modules } from '../../utils/Modules';

const Additional = () => {
  window.sessionStorage.removeItem('insuranceType');
  const navigate = useNavigate();
  const locations = useLocation();
  const currentPath = locations.pathname;
  const index = modules.findIndex((module) => module.path === currentPath);
  const nextPath = modules[index + 1].path;
  const jumpPath = modules[index + 3].path;
  return (
    <div className={styles.additionalContainer}>
      <div className={styles.additionalWrapper}>
        <h5 className='header5'>Do you have any additional insurance?</h5>
        <div className={styles.binaryBtnContainer}>
          <Button
            onClick={() => navigate(nextPath)}
            variant='contained'
            size='medium'
            className='binaryButton'>
            Yes
          </Button>
          <Button
            onClick={() => navigate(jumpPath)}
            variant='contained'
            size='medium'
            className='binaryButton'>
            No
          </Button>
        </div>
      </div>
      <div className={styles.bottomBtnContainer}>
        <BackButton text='Back' url='/' />
      </div>
    </div>
  );
};

export default Additional;
