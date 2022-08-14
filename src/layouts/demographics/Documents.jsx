import React, { useEffect, useState } from "react";
import DriversLicense from "../../assets/images/driversLic.svg";
import PatientsPicture from "../../assets/images/patientsPic.svg";
import Bottom from "../../components/Bottom/Bottom";
import ScanCard from "../../components/cards/ScanCard";
import store from "../../state/store";
import styles from "../../styles/Documents.module.css";

const Documents = () => {
  const [isDisabled, setIsDisabled] = useState(true);

  const [demographics, setDemographics] = useState({
    patientsPicture: "",
    driversLicense: "",
  });

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

  useEffect(() => {
    const state = store?.getState()?.data?.demographicsInfo;
    setDemographics({
      patientsPicture: state.patientsPicture || "",
      driversLicense: state.driversLicense || "",
    });
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

        <ScanCard
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
        />

        {/* <ScanCard
          id="driversLicense"
          title="DRIVER’S LICENSE"
          subTitle=""
          img={state.driversLicense ? state.driversLicense : DriversLicense}
          alt="card"
          btnText="Scan card"
        /> */}

        <ScanCard
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
        />
      </div>
      <Bottom isDisabled={isDisabled} />
    </div>
  );
};

export default Documents;
