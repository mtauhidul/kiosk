import { FormControl, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Bottom from '../../components/Bottom/Bottom';
import * as actionCreators from '../../state/actionCreators/index';
import store from '../../state/store';
import styles from '../../styles/InsuranceInfo.module.css';

const InInformation = () => {
  const dispatch = useDispatch();
  const [primaryInsurance, setPrimaryInsurance] = useState({
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
    const state = store?.getState()?.data?.primaryInsurance;
    setPrimaryInsurance(state);
  }, []);

  const { addPrimaryInsurance } = bindActionCreators(actionCreators, dispatch);

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
                value={primaryInsurance.activeDate}
                id='outlined-required'
              />
            </FormControl>
          </div>
          <div className={styles.inputWrapper}>
            <h6 className='header6'>Copay for Specialist</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: '100%' }}>
              <TextField
                id='outlined-required'
                value={primaryInsurance.copayForSpecialist}
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
                value={primaryInsurance.insuranceName}
                onChange={(e) =>
                  setPrimaryInsurance({
                    ...primaryInsurance,
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
                value={primaryInsurance.memberId}
                onChange={(e) =>
                  setPrimaryInsurance({
                    ...primaryInsurance,
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
                value={primaryInsurance.groupNumber}
                onChange={(e) =>
                  setPrimaryInsurance({
                    ...primaryInsurance,
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
                value={primaryInsurance.groupName}
                onChange={(e) =>
                  setPrimaryInsurance({
                    ...primaryInsurance,
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
                value={primaryInsurance.phoneNumber}
                onChange={(e) =>
                  setPrimaryInsurance({
                    ...primaryInsurance,
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
      <Bottom handleSubmit={addPrimaryInsurance} data={primaryInsurance} />
    </div>
  );
};

export default InInformation;
