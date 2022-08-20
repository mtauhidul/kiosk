import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
import Bottom from "../../components/Bottom/Bottom";
import History from "../../components/history/History";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/Surgeries.module.css";
import { arrangeListOfItems } from "../../utils/arrangeListOfItems";

const surgeryList = [
  "Surgery",
  "Some long name of surgeries",
  "Surgery 1",
  "Surgery 2",
  "Surgery 3",
];

const SurgicalHistory = () => {
  const dispatch = useDispatch();
  const { addSurgicalHistory } = bindActionCreators(actionCreators, dispatch);
  const location = useLocation();
  const [data, setData] = useState([]);

  const state = store?.getState()?.data?.surgicalHistory;
  const newSurgeryList = arrangeListOfItems(surgeryList, state);

  const addItemToList = (item) => {
    const repeatDataCheck = data.find((d) => d === item);
    if (!repeatDataCheck) {
      const newArray = [...data];
      newArray.push(item);
      setData(newArray);
    } else {
      const newArray = data.filter((d) => d !== item);
      setData(newArray);
    }
  };

  useEffect(() => {
    const state = store?.getState()?.data?.surgicalHistory;
    setData(state);
  }, []);

  return (
    <div className={styles.surgeriesContainer}>
      <History
        addedItems={data}
        addToList={addItemToList}
        items={newSurgeryList}
        headerText="PLEASE ADD SURGICAL HISTORY :"
        btnText="Add Other Surgeries"
      />
      <Bottom
        isEdit={location.state}
        handleSubmit={addSurgicalHistory}
        data={data}
      />
    </div>
  );
};

export default SurgicalHistory;
