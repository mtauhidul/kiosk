import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InsuranceCardBack from "../../assets/images/insuranceBack.svg";
import InsuranceCardFront from "../../assets/images/insuranceFront.svg";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import ScanCard from "../../components/cards/ScanCard";
import styles from "../../styles/InsuranceDocs.module.css";

const InsuranceDocs = () => {
  // Use Redux hooks instead of direct store access
  const primaryInsurance = useSelector((state) => state.data.primaryInsurance);
  const [isDisabled, setIsDisabled] = useState(true);

  // Set insurance type in session storage only once on component mount
  useEffect(() => {
    window.sessionStorage.setItem("insuranceType", "primary");
  }, []);

  // Check if both front and back images exist to enable the next button
  useEffect(() => {
    if (
      primaryInsurance.insuranceCardFront &&
      primaryInsurance.insuranceCardBack
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [primaryInsurance.insuranceCardFront, primaryInsurance.insuranceCardBack]);

  return (
    <AnimatedPage>
      <div className={styles.documentsContainer}>
        <div className={styles.cardsContainer}>
          <ScanCard
            id="insuranceCardFront"
            title="INSURANCE CARD"
            subTitle="Front"
            img={
              primaryInsurance.insuranceCardFront
                ? primaryInsurance.insuranceCardFront
                : InsuranceCardFront
            }
            alt="card"
            btnText="Scan insurance card"
          />
          <ScanCard
            id="insuranceCardBack"
            title="INSURANCE CARD"
            subTitle="Back"
            img={
              primaryInsurance.insuranceCardBack
                ? primaryInsurance.insuranceCardBack
                : InsuranceCardBack
            }
            alt="card"
            btnText="Scan insurance card"
          />
        </div>
        <Bottom isDisabled={isDisabled} />
      </div>
    </AnimatedPage>
  );
};

export default InsuranceDocs;
