/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Bottom from '../../components/Bottom/Bottom';
import History from '../../components/history/History';
import * as actionCreators from '../../state/actionCreators/index';
import store from '../../state/store';
import styles from '../../styles/Medications.module.css';

const medicationList = [
  'Medication 1',
  'Medication 2',
  'Medication 3',
  'Medication 4',
  'Medication 5',
  'Medication 6',
];

const Medications = () => {
  const dispatch = useDispatch();
  const { addMedicationsData } = bindActionCreators(actionCreators, dispatch);

  const [data, setData] = useState([]);

  const addItemToList = (item) => {
    const repeatDataCheck = data.find((d) => d === item);
    if (!repeatDataCheck) {
      const newArray = [...data, item];
      setData(newArray);
    } else {
      const newArray = data.filter((d) => d !== item);
      setData(newArray);
    }
  };

  useEffect(() => {
    const state = store?.getState()?.data?.medications;
    setData(state);
  }, []);

  return (
    <div className={styles.medicationsContainer}>
      <History
        addedItems={data}
        addToList={addItemToList}
        items={medicationList}
        headerText='PLEASE ADD ANY MEDICATIONS :
        '
        btnText='Add Other Medications'
      />
      <Bottom handleSubmit={addMedicationsData} data={data} />
    </div>
  );
};

export default Medications;
