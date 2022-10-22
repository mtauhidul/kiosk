import React, { createContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';
import { getPatientsData } from './apis/api';
import Routings from './utils/Routings';

export const PatientsDataContext = createContext();
export const PatientContext = createContext();

const App = () => {
  const [data, setData] = useState([]);
  const [patient, setPatient] = useState({});

  const getAllPatientsData = async () => {
    const response = await getPatientsData();
    if (response) {
      setData(response);
    }
  };

  useEffect(() => {
    getAllPatientsData();
  }, []);

  return (
    <PatientsDataContext.Provider value={[data, setData]}>
      <PatientContext.Provider value={[patient, setPatient]}>
        <Router>
          <Routings />
          <Toaster
            position='top-right'
            reverseOrder={false}
            gutter={8}
            containerClassName=''
            containerStyle={{}}
            toastOptions={{
              className: '',
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },

              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },

              error: {
                duration: 3000,
                theme: {
                  primary: 'red',
                  secondary: 'black',
                },
              },
            }}
          />
        </Router>
      </PatientContext.Provider>
    </PatientsDataContext.Provider>
  );
};

export default App;
