import { Button } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TicketImg from '../../assets/images/ticket.svg';
// import AnimatedPage from "../../components/Animation/Pages";
import styles from '../../styles/CollectTicket.module.css';
import { modules } from '../../utils/Modules';

const CollectTicket = () => {
  const navigate = useNavigate();
  const locations = useLocation();
  const currentPath = locations.pathname;
  const index = modules.findIndex((module) => module.path === currentPath);
  const nextPath = modules[index + 1]?.path;
  console.log(modules);
  const lastPath = modules[index + 2]?.path;

  return (
    <div className={styles.collectTicketContainer}>
      <div className={styles.collectTicketWrapper}>
        <div>
          <h2 className='header2'>Done! Collect Encounter Ticket</h2>
          <h6 className='header6'>
            Please bring your Encounter Ticket with you when your doctor’s
            assistant calls you for your appointment.
            <br />
            Please take a seat and make yourself comfortable.
          </h6>
        </div>
        <div>
          <img src={TicketImg} alt='Ticket' />
        </div>
        <div>
          <h5 className='header5'>
            WOULD YOU LIKE TO SHARE YOUR LAST VISIT EXPERIENCE WITH US?
          </h5>
          <small>Just 4 questions survey</small>
        </div>
        {nextPath && lastPath && (
          <div className={styles.btnWrapper}>
            <Button
              id={styles.verifyBtn}
              onClick={() => navigate(lastPath)}
              variant='contained'
              size='medium'
              className='binaryButton'>
              No, Thanks
            </Button>
            <Button
              id={styles.verifyBtn}
              onClick={() => navigate(nextPath)}
              variant='contained'
              size='medium'
              className='binaryButton'>
              Yes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectTicket;
