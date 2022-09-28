import React, { useEffect, useState } from "react";
import InsuranceCardBack from "../../assets/images/insuranceBack.svg";
import InsuranceCardFront from "../../assets/images/insuranceFront.svg";
import Bottom from "../../components/Bottom/Bottom";
// import ScanCard from "../../components/cards/ScanCard";
import styles from "../../styles/InsuranceDocs.module.css";
import UploadCard from "../../components/cards/UploadCard";
import useReviewImages from "../../views/useReviewImages";
import AnimatedPage from "../../components/Animation/Pages";

const SecInsuranceDocs = () => {
  // window.sessionStorage.setItem("insuranceType", "secondary");
  // const state = store?.getState()?.data?.secondaryInsurance;

  const [isDisabled, setIsDisabled] = useState(true);
  const { addFile, docs } = useReviewImages();

  useEffect(() => {
    if (docs.secInsuranceFront === "" || docs.secInsuranceBack === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [docs.secInsuranceFront, docs.secInsuranceBack]);

  return (
    <AnimatedPage>
      <div className={styles.documentsContainer}>
        <div className={styles.cardsContainer}>
          {/* <ScanCard
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
        /> */}

          <UploadCard
            id="secInsuranceFront"
            title="INSURANCE CARD"
            subTitle="Front"
            img={
              docs.secInsuranceFront
                ? docs.secInsuranceFront
                : InsuranceCardFront
            }
            alt="card"
            btnText="Upload insurance card"
            addFile={addFile}
          />
          <UploadCard
            id="secInsuranceBack"
            title="INSURANCE CARD"
            subTitle="Back"
            img={
              docs.secInsuranceBack ? docs.secInsuranceBack : InsuranceCardBack
            }
            alt="card"
            btnText="Upload insurance card"
            addFile={addFile}
          />
        </div>
        <Bottom isDisabled={isDisabled} />
      </div>
    </AnimatedPage>
  );
};

export default SecInsuranceDocs;
