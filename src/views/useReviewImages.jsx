import * as React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import store from "../state/store";
import * as actionCreators from "../state/actionCreators";

const useReviewImages = () => {
  const [docs, setDocs] = React.useState({
    insuranceCardFront: "",
    insuranceCardBack: "",
    secInsuranceFront: "",
    secInsuranceBack: "",
    driverLicense: "",
    patientsPicture: "",
  });
  const dispatch = useDispatch();

  // actions
  const { addPrimaryInsurance, addSecondaryInsurance, addDemographicData } =
    bindActionCreators(actionCreators, dispatch);

  // states
  const demographicState = store?.getState()?.data?.demographicsInfo;
  const primaryInsuranceState = store?.getState()?.data?.primaryInsurance;
  const secondaryInsuranceState = store?.getState()?.data?.secondaryInsurance;

  const addFile = React.useCallback(
    (id, file) => {
      // check file types
      var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
      if (!allowedExtensions.exec(file.name))
        return toast.error("Invalid file type. Please select an image file.");

      // render image preview
      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
      }

      // add file to state and store
      if (id === "driversLicense") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...demographicState,
            driversLicense: readerEvent.target.result,
          };

          addDemographicData(newState);
          setDocs({
            ...docs,
            driverLicense: readerEvent.target.result,
          });
        };
      } else if (id === "patientsPicture") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...demographicState,
            patientsPicture: readerEvent.target.result,
          };
          addDemographicData(newState);
          setDocs({
            ...docs,
            patientsPicture: readerEvent.target.result,
          });
        };
      } else if (id === "insuranceCardFront") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...primaryInsuranceState,
            insuranceCardFront: readerEvent.target.result,
          };

          addPrimaryInsurance(newState);
          setDocs({
            ...docs,
            insuranceCardFront: readerEvent.target.result,
          });
        };
      } else if (id === "insuranceCardBack") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...primaryInsuranceState,
            insuranceCardBack: readerEvent.target.result,
          };
          addPrimaryInsurance(newState);
          setDocs({
            ...docs,
            insuranceCardBack: readerEvent.target.result,
          });
        };
      } else if (id === "secInsuranceFront") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...secondaryInsuranceState,
            insuranceCardFront: readerEvent.target.result,
          };
          addSecondaryInsurance(newState);
          setDocs({
            ...docs,
            secInsuranceFront: readerEvent.target.result,
          });
        };
      } else if (id === "secInsuranceBack") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...secondaryInsuranceState,
            insuranceCardBack: readerEvent.target.result,
          };
          addSecondaryInsurance(newState);
          setDocs({
            ...docs,
            secInsuranceBack: readerEvent.target.result,
          });
        };
      }
    },
    [
      addDemographicData,
      addPrimaryInsurance,
      addSecondaryInsurance,
      demographicState,
      docs,
      primaryInsuranceState,
      secondaryInsuranceState,
    ]
  );

  React.useEffect(() => {
    setDocs({
      driverLicense: demographicState.driversLicense || "",
      patientsPicture: demographicState.patientsPicture || "",
      insuranceCardFront: primaryInsuranceState.insuranceCardFront || "",
      insuranceCardBack: primaryInsuranceState.insuranceCardBack || "",
      secInsuranceFront: secondaryInsuranceState.insuranceCardFront || "",
      secInsuranceBack: secondaryInsuranceState.insuranceCardBack || "",
    });
  }, [
    demographicState.driversLicense,
    demographicState.patientsPicture,
    primaryInsuranceState.insuranceCardBack,
    primaryInsuranceState.insuranceCardFront,
    secondaryInsuranceState.insuranceCardBack,
    secondaryInsuranceState.insuranceCardFront,
  ]);

  return {
    docs,
    addFile,
  };
};

export default useReviewImages;
