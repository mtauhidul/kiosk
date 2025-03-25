import React, { useEffect, useState } from "react";
import DriversLicense from "../../assets/images/driversLic.svg";
import PatientsPicture from "../../assets/images/patientsPic.svg";
import Bottom from "../../components/Bottom/Bottom";
import ScanCard from "../../components/cards/ScanCard";
import styles from "../../styles/Documents.module.css";
import useReviewImages from "../../views/useReviewImages";

const Documents = () => {
  // const dispatch = useDispatch();
  // const state = store?.getState()?.data?.demographicsInfo;
  const [isDisabled, setIsDisabled] = useState(true);
  const { addFile, docs } = useReviewImages();

  // useEffect(() => {
  //   const state = store?.getState()?.data?.demographicsInfo;
  //   setDemographics({
  //     patientsPicture: state.patientsPicture || "",
  //     driversLicense: state.driversLicense || "",
  //   });
  // }, [demographics.driversLicense, demographics.patientsPicture]);

  useEffect(() => {
    if (docs.patientsPicture === "" || docs.driversLicense === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [docs.driversLicense, docs.patientsPicture]);

  return (
    <div className={styles.documentsContainer}>
      <div className={styles.cardsContainer}>
        <ScanCard
          id="patientsPicture"
          title="PATIENT’S PICTURE"
          subTitle=""
          img={docs.patientsPicture ? docs.patientsPicture : PatientsPicture}
          alt="card"
          btnText="Take a picture"
        />

        {/* <UploadCard
          id="patientsPicture"
          title="PATIENT’S PICTURE"
          subTitle=""
          img={docs.patientsPicture ? docs.patientsPicture : PatientsPicture}
          alt="card"
          btnText="Upload a picture"
          addFile={addFile}
        /> */}

        <ScanCard
          id="driversLicense"
          title="DRIVER’S LICENSE"
          subTitle=""
          img={docs.driverLicense ? docs.driverLicense : DriversLicense}
          alt="card"
          btnText="Scan card"
        />

        {/* <UploadCard
          id="driversLicense"
          title="DRIVER’S LICENSE"
          subTitle=""
          img={docs.driverLicense ? docs.driverLicense : DriversLicense}
          alt="card"
          btnText="Upload card"
          addFile={addFile}
        /> */}
      </div>
      <Bottom isDisabled={isDisabled} />
    </div>
  );
};

export default Documents;
