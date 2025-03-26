import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InsuranceCardBack from "../../assets/images/insuranceBack.svg";
import InsuranceCardFront from "../../assets/images/insuranceFront.svg";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import ScanCard from "../../components/cards/ScanCard";
import styles from "../../styles/InsuranceDocs.module.css";

const SecInsuranceDocs = () => {
  // Use Redux hooks instead of direct store access
  const secondaryInsurance = useSelector(
    (state) => state.data.secondaryInsurance
  );
  const [isDisabled, setIsDisabled] = useState(true);

  // Set insurance type in session storage only once on component mount
  useEffect(() => {
    window.sessionStorage.setItem("insuranceType", "secondary");
    console.log("Insurance type set to: secondary");
  }, []);

  // Check if both front and back images exist to enable the next button
  useEffect(() => {
    console.log(
      "Secondary Insurance Front:",
      secondaryInsurance.insuranceCardFront ? "Exists" : "Missing"
    );
    console.log(
      "Secondary Insurance Back:",
      secondaryInsurance.insuranceCardBack ? "Exists" : "Missing"
    );

    if (
      secondaryInsurance.insuranceCardFront &&
      secondaryInsurance.insuranceCardBack
    ) {
      console.log(
        "Both secondary insurance images exist, enabling Next button"
      );
      setIsDisabled(false);
    } else {
      console.log("Missing secondary insurance images, disabling Next button");
      setIsDisabled(true);
    }
  }, [
    secondaryInsurance.insuranceCardFront,
    secondaryInsurance.insuranceCardBack,
  ]);

  // Function to verify image is valid
  const verifyImage = (imageUrl) => {
    if (!imageUrl) return false;
    if (typeof imageUrl !== "string") return false;
    if (imageUrl.startsWith("data:image")) return true;
    return false;
  };

  return (
    <AnimatedPage>
      <div className={styles.documentsContainer}>
        <div className={styles.cardsContainer}>
          <ScanCard
            id="insuranceCardFront"
            title="SECONDARY INSURANCE"
            subTitle="Front"
            img={
              verifyImage(secondaryInsurance.insuranceCardFront)
                ? secondaryInsurance.insuranceCardFront
                : InsuranceCardFront
            }
            alt="secondary insurance card front"
            btnText="Scan insurance card"
          />
          <ScanCard
            id="insuranceCardBack"
            title="SECONDARY INSURANCE"
            subTitle="Back"
            img={
              verifyImage(secondaryInsurance.insuranceCardBack)
                ? secondaryInsurance.insuranceCardBack
                : InsuranceCardBack
            }
            alt="secondary insurance card back"
            btnText="Scan insurance card"
          />
        </div>

        <Bottom isDisabled={isDisabled} />
      </div>
    </AnimatedPage>
  );
};

export default SecInsuranceDocs;
