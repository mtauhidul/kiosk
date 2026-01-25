import { Button, Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
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
  
  // Get encounter ID from location state or session storage
  const encounterId = locations.state?.encounterId || sessionStorage.getItem("encounterId");

  // Clear session storage after successful check-in
  useEffect(() => {
    const clearTimer = setTimeout(() => {
      sessionStorage.removeItem("patientId");
      sessionStorage.removeItem("encounterId");
      sessionStorage.removeItem("patient");
    }, 60000); // Clear after 1 minute

    return () => clearTimeout(clearTimer);
  }, []);

  return (
    <div className={styles.collectTicketContainer}>
      <div className={styles.collectTicketWrapper}>
        <div>
          <h2 className='header2'>Done! Collect Encounter Ticket</h2>          
          {/* Display Encounter Number */}
          {encounterId && (
            <Box 
              sx={{ 
                my: 3, 
                p: 3, 
                backgroundColor: '#f0f4ff',
                border: '2px solid #4a5fd9',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your Encounter Number
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#4a5fd9',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em'
                }}
              >
                {encounterId}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Please remember this number or take a photo
              </Typography>
            </Box>
          )}
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
            WOULD YOU LIKE TO HELP US IMPROVE?
          </h5>
          <small>Just 1 question survey</small>
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
