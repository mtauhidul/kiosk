import { FormControl, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Bottom from '../../components/Bottom/Bottom';
import * as actionCreators from '../../state/actionCreators/index';
import store from '../../state/store';
import styles from '../../styles/InsuranceInfo.module.css';

const SecInInformation = () => {
  const dispatch = useDispatch();
  const [secInsurance, setSecInsurance] = useState({
    activeDate: 'Sep 30, 2020',
    copayForSpecialist: '$40.00',
    insuranceName: '',
    copay: '$110.00',
    memberId: '',
    groupName: '',
    groupNumber: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const state = store?.getState()?.data?.secondaryInsurance;
    setSecInsurance(state);
  }, []);

  const { addSecondaryInsurance } = bindActionCreators(
    actionCreators,
    dispatch
  );

  return (
    <div className={styles.informationContainer}>
      <div className={styles.eligibilityFormWrapper}>
        <h3 className='header3'>Eligibility</h3>
        <br />
        <div className={styles.eligibilityForm}>
          <div className={styles.inputWrapper}>
            <h6 className='header6'>Active Date</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                value={secInsurance.activeDate}
                id='outlined-required'
              />
            </FormControl>
          </div>
          <div className={styles.inputWrapper}>
            <h6 className='header6'>Copay for Specialist</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                id='outlined-required'
                value={secInsurance.copayForSpecialist}
              />
            </FormControl>
          </div>
        </div>
      </div>
      <br />
      <div className={styles.eligibilityFormWrapper}>
        <h3 className='header3'>GENERAL INFO</h3>
        <br />
        <div className={styles.eligibilityForm}>
          <div className={styles.inputWrapper}>
            <h6 className='header6'>Primary Insurance</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                value={secInsurance.insuranceName}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    insuranceName: e.target.value,
                  })
                }
                id='outlined-required'
                label='Insurance name'
              />
            </FormControl>
            <h6 className='header6'>Member ID</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                value={secInsurance.memberId}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    memberId: e.target.value,
                  })
                }
                id='outlined-required'
                label='Enter member ID'
              />
            </FormControl>
            <h6 className='header6'>Group Number</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                value={secInsurance.groupNumber}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    groupNumber: e.target.value,
                  })
                }
                id='outlined-required'
                label='Enter your group number'
              />
            </FormControl>
          </div>
          <div className={styles.inputWrapper}>
            <h6 className='header6'>Copay</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField id='outlined-required' value='$110.00' />
            </FormControl>
            <h6 className='header6'>Group Name</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                value={secInsurance.groupName}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    groupName: e.target.value,
                  })
                }
                id='outlined-required'
                label='Enter group name'
              />
            </FormControl>
            <h6 className='header6'>Phone Number</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                value={secInsurance.phoneNumber}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    phoneNumber: e.target.value,
                  })
                }
                id='outlined-required'
                label='Enter your phone number'
              />
            </FormControl>
          </div>
        </div>
      </div>
      <Bottom handleSubmit={addSecondaryInsurance} data={secInsurance} />
    </div>
  );
};

export default SecInInformation;
