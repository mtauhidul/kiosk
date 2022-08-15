import React, { useCallback, useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import InsuranceCardBack from "../../assets/images/insuranceBack.svg";
import InsuranceCardFront from "../../assets/images/insuranceFront.svg";
import Bottom from "../../components/Bottom/Bottom";
// import ScanCard from "../../components/cards/ScanCard";
import UploadCard from "../../components/cards/UploadCard";
import store from "../../state/store";
import styles from "../../styles/InsuranceDocs.module.css";
import * as actionCreators from "../../state/actionCreators";
import { useDispatch } from "react-redux";

const InsuranceDocs = () => {
  const [primaryDocs, setPrimaryDocs] = useState({
    insuranceCardFront: "",
    insuranceCardBack: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);

  // window.sessionStorage.setItem("insuranceType", "primary");
  const dispatch = useDispatch();
  const { addPrimaryInsurance } = bindActionCreators(actionCreators, dispatch);

  const addFile = useCallback(
    (id, file) => {
      if (id === "insuranceCardFront") {
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
        }

        reader.onload = (readerEvent) => {
          const state = store?.getState()?.data?.primaryInsurance;
          const newState = {
            ...state,
            insuranceCardFront: readerEvent.target.result,
          };

          addPrimaryInsurance(newState);
          setPrimaryDocs({
            ...primaryDocs,
            insuranceCardFront: readerEvent.target.result,
          });
        };
      } else if (id === "insuranceCardBack") {
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
        }

        reader.onload = (readerEvent) => {
          const state = store?.getState()?.data?.primaryInsurance;
          const newState = {
            ...state,
            insuranceCardBack: readerEvent.target.result,
          };
          addPrimaryInsurance(newState);
          setPrimaryDocs({
            ...primaryDocs,
            insuranceCardBack: readerEvent.target.result,
          });
        };
      }
    },
    [addPrimaryInsurance, primaryDocs]
  );

  useEffect(() => {
    const state = store?.getState()?.data?.primaryInsurance;
    setPrimaryDocs({
      insuranceCardFront: state.insuranceCardFront || "",
      insuranceCardBack: state.insuranceCardBack || "",
    });
  }, [primaryDocs.insuranceCardFront, primaryDocs.insuranceCardBack]);

  useEffect(() => {
    if (
      primaryDocs.insuranceCardFront === "" ||
      primaryDocs.insuranceCardBack === ""
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [primaryDocs.insuranceCardFront, primaryDocs.insuranceCardBack]);

  // const state = store?.getState()?.data?.primaryInsurance;

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
            primaryDocs.insuranceCardFront
              ? primaryDocs.insuranceCardFront
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
            primaryDocs.insuranceCardBack
              ? primaryDocs.insuranceCardBack
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

export default InsuranceDocs;
