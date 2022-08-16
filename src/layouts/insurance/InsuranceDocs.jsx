import React, { useEffect, useState } from "react";
import InsuranceCardBack from "../../assets/images/insuranceBack.svg";
import InsuranceCardFront from "../../assets/images/insuranceFront.svg";
import Bottom from "../../components/Bottom/Bottom";
import UploadCard from "../../components/cards/UploadCard";
import useReviewImages from "../../views/useReviewImages";
import styles from "../../styles/InsuranceDocs.module.css";
// import ScanCard from "../../components/cards/ScanCard";

const InsuranceDocs = () => {
  // window.sessionStorage.setItem("insuranceType", "primary");
  // const state = store?.getState()?.data?.primaryInsurance;
  const [isDisabled, setIsDisabled] = useState(true);
  const { addFile, docs } = useReviewImages();

  // useEffect(() => {
  //   const state = store?.getState()?.data?.primaryInsurance;
  //   setPrimaryDocs({
  //     insuranceCardFront: state.insuranceCardFront || "",
  //     insuranceCardBack: state.insuranceCardBack || "",
  //   });
  // }, [primaryDocs.insuranceCardFront, primaryDocs.insuranceCardBack]);

  useEffect(() => {
    if (docs.insuranceCardFront === "" || docs.insuranceCardBack === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [docs.insuranceCardFront, docs.insuranceCardBack]);

  return (
    <div className={styles.documentsContainer}>
      <div className={styles.cardsContainer}>
        {/* <ScanCard
          id='insuranceCardFront'
          title='INSURANCE CARD'
          subTitle='Front'
          img={
            state.insuranceCardFront
              ? state.insuranceCardFront
              : InsuranceCardFront
          }
          alt='card'
          btnText='Scan insurance card'
        />
        <ScanCard
          id='insuranceCardBack'
          title='INSURANCE CARD'
          subTitle='Back'
          img={
            state.insuranceCardBack
              ? state.insuranceCardBack
              : InsuranceCardBack
          }
          alt='card'
          btnText='Scan insurance card'
        /> */}

        <UploadCard
          id="insuranceCardFront"
          title="INSURANCE CARD"
          subTitle="Front"
          img={
            docs.insuranceCardFront
              ? docs.insuranceCardFront
              : InsuranceCardFront
          }
          alt="card"
          addFile={addFile}
          btnText="Upload insurance card"
        />
        <UploadCard
          id="insuranceCardBack"
          title="INSURANCE CARD"
          subTitle="Back"
          img={
            docs.insuranceCardBack ? docs.insuranceCardBack : InsuranceCardBack
          }
          alt="card"
          btnText="Upload insurance card"
          addFile={addFile}
        />
      </div>
      <Bottom isDisabled={isDisabled} />
    </div>
  );
};

export default InsuranceDocs;
