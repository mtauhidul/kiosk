import React from "react";
import InsuranceCardBack from "../../assets/images/insuranceBack.svg";
import InsuranceCardFront from "../../assets/images/insuranceFront.svg";
import Bottom from "../../components/Bottom/Bottom";
import ScanCard from "../../components/cards/ScanCard";
import store from "../../state/store";
import styles from "../../styles/InsuranceDocs.module.css";

const SecInsuranceDocs = () => {
  window.sessionStorage.setItem("insuranceType", "secondary");
  const state = store?.getState()?.data?.secondaryInsurance;
  return (
    <div className={styles.documentsContainer}>
      <div className={styles.cardsContainer}>
        <ScanCard
          id="insuranceCardFront"
          title="INSURANCE CARD"
          subTitle="Front"
          img={
            state.insuranceCardFront
              ? state.insuranceCardFront
              : InsuranceCardFront
          }
          alt="card"
          btnText="Upload insurance card"
        />
        <ScanCard
          id="insuranceCardBack"
          title="INSURANCE CARD"
          subTitle="Back"
          img={
            state.insuranceCardBack
              ? state.insuranceCardBack
              : InsuranceCardBack
          }
          alt="card"
          btnText="Upload insurance card"
        />
      </div>
      <Bottom />
    </div>
  );
};

export default SecInsuranceDocs;
