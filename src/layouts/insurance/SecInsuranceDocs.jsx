import React, { useCallback, useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import InsuranceCardBack from "../../assets/images/insuranceBack.svg";
import InsuranceCardFront from "../../assets/images/insuranceFront.svg";
import Bottom from "../../components/Bottom/Bottom";
// import ScanCard from "../../components/cards/ScanCard";
import store from "../../state/store";
import styles from "../../styles/InsuranceDocs.module.css";
import * as actionCreators from "../../state/actionCreators";
import { useDispatch } from "react-redux";
import UploadCard from "../../components/cards/UploadCard";

const SecInsuranceDocs = () => {
  // window.sessionStorage.setItem("insuranceType", "secondary");
  // const state = store?.getState()?.data?.secondaryInsurance;

  const [secDocs, setSecDocs] = useState({
    insuranceCardFront: "",
    insuranceCardBack: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);

  // window.sessionStorage.setItem("insuranceType", "primary");
  const dispatch = useDispatch();
  const { addSecondaryInsurance } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const addFile = useCallback(
    (id, file) => {
      if (id === "secInsuranceCardFront") {
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
        }

        reader.onload = (readerEvent) => {
          const state = store?.getState()?.data?.secondaryInsurance;
          const newState = {
            ...state,
            insuranceCardFront: readerEvent.target.result,
          };

          addSecondaryInsurance(newState);
          setSecDocs({
            ...secDocs,
            insuranceCardFront: readerEvent.target.result,
          });
        };
      } else if (id === "secInsuranceCardBack") {
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
        }

        reader.onload = (readerEvent) => {
          const state = store?.getState()?.data?.secondaryInsurance;
          const newState = {
            ...state,
            insuranceCardBack: readerEvent.target.result,
          };
          addSecondaryInsurance(newState);
          setSecDocs({
            ...secDocs,
            insuranceCardBack: readerEvent.target.result,
          });
        };
      }
    },
    [addSecondaryInsurance, secDocs]
  );

  useEffect(() => {
    const state = store?.getState()?.data?.secondaryInsurance;
    setSecDocs({
      insuranceCardFront: state.insuranceCardFront || "",
      insuranceCardBack: state.insuranceCardBack || "",
    });
  }, [secDocs.insuranceCardFront, secDocs.insuranceCardBack]);

  useEffect(() => {
    if (secDocs.insuranceCardFront === "" || secDocs.insuranceCardBack === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [secDocs.insuranceCardFront, secDocs.insuranceCardBack]);

  return (
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
          id="secInsuranceCardFront"
          title="INSURANCE CARD"
          subTitle="Front"
          img={
            secDocs.insuranceCardFront
              ? secDocs.insuranceCardFront
              : InsuranceCardFront
          }
          alt="card"
          btnText="Upload insurance card"
          addFile={addFile}
        />
        <UploadCard
          id="secInsuranceCardBack"
          title="INSURANCE CARD"
          subTitle="Back"
          img={
            secDocs.insuranceCardBack
              ? secDocs.insuranceCardBack
              : InsuranceCardBack
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

export default SecInsuranceDocs;
