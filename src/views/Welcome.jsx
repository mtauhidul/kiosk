import { Container } from '@mui/material';
import React from 'react';
import HeroBg from '../assets/images/heroBg.svg';
import Logo from '../assets/images/logo.svg';
import PrimaryButton from '../components/buttons/PrimaryButton';
import styles from '../styles/welcome.module.css';

const Welcome = () => {
  return (
    <Container maxWidth='xl' className={styles.container}>
      <Container maxWidth='xl' className={styles.wrapper}>
        <div className={styles.heroText}>
          <div>
            <img src={Logo} alt='Logo' />
          </div>
          <div>
            <h1 className='header1'>
              Welcome to Dr. James M. <br /> Jacobs & Associates
            </h1>
            <br />
            <h5 className='header4'>
              Serving Katy TX and Surrounding Communities
            </h5>
            <br />
            <br />
            <PrimaryButton text='Start Here' url='/kiosk/checkIn_General' />
          </div>
        </div>
        <div className={styles.heroBg}>
          <img src={HeroBg} alt='Hero Background' />
        </div>
      </Container>
    </Container>
  );
};

export default Welcome;
