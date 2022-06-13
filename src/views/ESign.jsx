import { Container } from '@mui/material';
import React from 'react';
import styles from '../styles/ESign.module.css';

const ESign = (props) => {
  return (
    <Container className={styles.ESginContainer} maxWidth='xl'>
      {props.children}
    </Container>
  );
};

export default ESign;
