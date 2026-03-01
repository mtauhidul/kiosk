import React, { createContext, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom';
import Routings from './utils/Routings';
import ErrorBoundary from './components/ErrorBoundary';
import SessionManager from './components/SessionManager';
import { initSentry } from './monitoring/sentry';

export const PatientsDataContext = createContext();
export const PatientContext = createContext();

const App = () => {
  const [data, setData] = useState([]);
  const [patient, setPatient] = useState({});

  // Initialize Sentry on mount
  useEffect(() => {
    initSentry();
  }, []);

  // Note: Patient data is now fetched via encounter ID verification
  // No need to fetch all patients on mount

  return (
    <ErrorBoundary>
      <PatientsDataContext.Provider value={[data, setData]}>
        <PatientContext.Provider value={[patient, setPatient]}>
          <Router>
            <SessionManager>
              <Routings />
            </SessionManager>
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
    </ErrorBoundary>
  );
};

export default App;
