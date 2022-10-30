import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LineWave } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { PatientContext, PatientsDataContext } from '../../App';
import AnimatedPage from '../../components/Animation/Pages';
import Bottom from '../../components/Bottom/Bottom';
import DOB from '../../components/DOB/DOB';
import * as actionCreators from '../../state/actionCreators/index';
import store from '../../state/store';
import styles from '../../styles/General.module.css';

const General = () => {
  const [data, setData] = useContext(PatientsDataContext);
  const [patient, setPatient] = useContext(PatientContext);
  const dispatch = useDispatch();
  const { removeUserData } = bindActionCreators(actionCreators, dispatch);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    fullName: '',
    day: '',
    month: '',
    year: '',
    location: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const state = store?.getState()?.data?.userInfo;
    setUser({
      fullName: state.fullName || '',
      day: state.day || '',
      month: state.month || '',
      year: state.year || '',
      location: state.location || '',
    });
  }, []);

  useEffect(() => {
    if (
      user.fullName === '' ||
      user.day === '' ||
      user.month === '' ||
      user.year === '' ||
      user.location === ''
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [user]);

  const { addUserInfo } = bindActionCreators(actionCreators, dispatch);

  const onAppointmentCheck = () => {
    setLoading(true);
    const targetPatient = data.find((d) => {
      const firstName = d.data[14];
      const lastName = d.data[15];
      const appointmentDate = d.date.split(', ')[0];
      const currentDate = new Date().toLocaleDateString();

      // ***Have to uncomment below line ***

      return (
        user.fullName
          .toLowerCase()
          .includes(firstName.toLowerCase() || lastName.toLowerCase()) &&
        appointmentDate === currentDate &&
        d.duration === ''
      );
    });

    console.log(data);

    if (targetPatient && targetPatient.id) {
      setPatient(targetPatient);
      window.sessionStorage.setItem('patient', JSON.stringify(targetPatient));
      setIsChecked(true);
      setTimeout(() => {
        setLoading(false);
        toast.success('Appointment successfully checked!');
      }, 1000);
    } else {
      toast.error('Please contact with the hospital for appointment.');

      setTimeout(() => {
        removeUserData();
        navigate('/');
      }, 2000);
    }
  };

  return (
    <AnimatedPage>
      <form className={styles.GeneralContainer}>
        <div>
          <div className={styles.form}>
            <h3 className='header3'>General Info</h3>
            <FormControl sx={{ mb: 3, mt: 5, minWidth: 120, width: '100%' }}>
              <TextField
                required
                value={user?.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                id='outlined-required'
                label='Full Name'
              />
            </FormControl>
            <h6 className='header6'>Date of Birth</h6>
            <DOB setData={setUser} data={user} />
          </div>
          <div id={styles.locationSelector} className={styles.form}>
            <h6 className='header6'>
              Which location is your appointment scheduled?
            </h6>
            <FormControl sx={{ mr: 2, mt: 1, minWidth: { xs: 250, md: 390 } }}>
              <InputLabel id='demo-simple-select-helper-label'>
                Location
              </InputLabel>
              <Select
                labelId='demo-simple-select-helper-label'
                id='demo-simple-select-helper'
                value={user?.location}
                label='Location'
                onChange={(e) =>
                  setUser({ ...user, location: e.target.value })
                }>
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                <MenuItem value='A'>A</MenuItem>
                <MenuItem value='B'>B</MenuItem>
                <MenuItem value='C'>C</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {!isChecked && !loading && (
          <Button
            onClick={() => onAppointmentCheck()}
            sx={{ marginTop: '20px' }}
            variant='contained'>
            Submit to check appointment
          </Button>
        )}
        {loading && (
          <Box sx={{ marginTop: '-10%', marginLeft: '10%' }}>
            <LineWave
              height='300'
              width='300'
              color='#212155'
              ariaLabel='line-wave'
              wrapperStyle={{}}
              wrapperClass=''
              visible={true}
              firstLineColor=''
              middleLineColor=''
              lastLineColor=''
            />
          </Box>
        )}
        {isChecked && (
          <Bottom
            isDisabled={isDisabled}
            handleSubmit={addUserInfo}
            data={user}
          />
        )}
      </form>
    </AnimatedPage>
  );
};

export default General;
