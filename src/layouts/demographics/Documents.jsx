import React, { useEffect, useState, useCallback } from "react";
import { bindActionCreators } from "redux";
import DriversLicense from "../../assets/images/driversLic.svg";
import PatientsPicture from "../../assets/images/patientsPic.svg";
import Bottom from "../../components/Bottom/Bottom";
import UploadCard from "../../components/cards/UploadCard";
import store from "../../state/store";
import styles from "../../styles/Documents.module.css";
import * as actionCreators from "../../state/actionCreators";
import { useDispatch } from "react-redux";

const Documents = () => {
  const dispatch = useDispatch();
  const { addDemographicData } = bindActionCreators(actionCreators, dispatch);
  const [isDisabled, setIsDisabled] = useState(true);
  const [demographics, setDemographics] = useState({
    patientsPicture: "",
    driversLicense: "",
  });

  const addFile = useCallback(
    (id, file) => {
      if (id === "patientsPicture") {
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
        }

        reader.onload = (readerEvent) => {
          const state = store?.getState()?.data?.demographicsInfo;
          const newState = {
            ...state,
            patientsPicture: readerEvent.target.result,
          };
          addDemographicData(newState);
          setDemographics({
            ...demographics,
            patientsPicture: readerEvent.target.result,
          });
        };
      } else if (id === "driversLicense") {
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
        }

        reader.onload = (readerEvent) => {
          const state = store?.getState()?.data?.demographicsInfo;
          const newState = {
            ...state,
            driversLicense: readerEvent.target.result,
          };
          addDemographicData(newState);
          setDemographics({
            ...demographics,
            driversLicense: readerEvent.target.result,
          });
        };
      }
    },
    [addDemographicData, demographics]
  );

  useEffect(() => {
    const state = store?.getState()?.data?.demographicsInfo;
    setDemographics({
      patientsPicture: state.patientsPicture || "",
      driversLicense: state.driversLicense || "",
    });
  }, [demographics.driversLicense, demographics.patientsPicture]);

  useEffect(() => {
    if (
      demographics.patientsPicture === "" ||
      demographics.driversLicense === ""
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [demographics.driversLicense, demographics.patientsPicture]);

  // const state = store?.getState()?.data?.demographicsInfo;

  return (
    <div className={styles.documentsContainer}>
      <div className={styles.cardsContainer}>
        {/* <ScanCard
          id="patientsPicture"
          title="PATIENT’S PICTURE"
          subTitle=""
          img={state.patientsPicture ? state.patientsPicture : PatientsPicture}
          alt="card"
          btnText="Take a picture"
        /> */}

        <UploadCard
          id="patientsPicture"
          title="PATIENT’S PICTURE"
          subTitle=""
          img={
            demographics.patientsPicture
              ? demographics.patientsPicture
              : PatientsPicture
          }
          alt="card"
          btnText="Upload a picture"
          addFile={addFile}
        />

        {/* <ScanCard
          id="driversLicense"
          title="DRIVER’S LICENSE"
          subTitle=""
          img={state.driversLicense ? state.driversLicense : DriversLicense}
          alt="card"
          btnText="Scan card"
        /> */}

        <UploadCard
          id="driversLicense"
          title="DRIVER’S LICENSE"
          subTitle=""
          img={
            demographics.driversLicense
              ? demographics.driversLicense
              : DriversLicense
          }
          alt="card"
          btnText="Upload card"
          addFile={addFile}
        />
      </div>
      <Bottom isDisabled={isDisabled} />
    </div>
  );
};

export default Documents;
