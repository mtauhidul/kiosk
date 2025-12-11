/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import History from "../../components/history/History";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/Medications.module.css";
import { arrangeListOfItems } from "../../utils/arrangeListOfItems";

const medicationList = [
  "Aspirin",
  "Ibuprofen",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Levothyroxine",
  "Amlodipine",
  "Metoprolol",
  "Omeprazole",
  "Losartan",
];

const Medications = () => {
  const dispatch = useDispatch();
  const { addMedicationsData } = bindActionCreators(actionCreators, dispatch);
  const location = useLocation();

  const state = store?.getState()?.data?.medications;
  const newMedicationDataList = arrangeListOfItems(medicationList, state);

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
    <AnimatedPage>
      <div className={styles.medicationsContainer}>
        <History
          addedItems={data}
          addToList={addItemToList}
          items={newMedicationDataList}
          headerText="PLEASE ADD ANY MEDICATIONS :"
          btnText="Add Other Medications"
        />
        <Bottom
          isEdit={location.state}
          handleSubmit={addMedicationsData}
          data={data}
        />
      </div>
    </AnimatedPage>
  );
};

export default Medications;
