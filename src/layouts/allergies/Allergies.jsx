import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Bottom from '../../components/Bottom/Bottom';
import History from '../../components/history/History';
import * as actionCreators from '../../state/actionCreators/index';
import store from '../../state/store';
import styles from '../../styles/Allergies.module.css';

const allergyList = [
  'No known allergies',
  'Local Anesthetics',
  'Aspirin',
  'Penicillin',
  'Food Allergies',
  'Iodine/Shellfish',
  'Demerol',
  'Codeine',
];

const Allergies = () => {
  const dispatch = useDispatch();
  const { addAllergiesData } = bindActionCreators(actionCreators, dispatch);

  const [data, setData] = useState([]);
  const addItemToList = (item) => {
    console.log(item);
    const repeatDataCheck = data.find((d) => d === item);
    if (!repeatDataCheck) {
      const newArray = [...data];
      newArray.push(item);
      setData(newArray);
    } else {
      const newArray = [...data];
      newArray.pop(item);
      setData(newArray);
    }
  };

  useEffect(() => {
    const state = store?.getState()?.data?.allergies;
    setData(state);
  }, []);

  return (
    <div className={styles.allergiesContainer}>
      <History
        addedItems={data}
        addToList={addItemToList}
        items={allergyList}
        headerText='PLEASE ADD ANY ALLERGIES :'
        btnText='Add Other Allergies'
      />
      <Bottom handleSubmit={addAllergiesData} data={data} />
    </div>
  );
};

export default Allergies;
