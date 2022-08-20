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
      if (!file) return toast.error("⚠ File doesn't exist!");

      // check file types
      const types = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!types.includes(file.type)) {
        return toast.error(
          "File type is not supported. Enter a valid format of image."
        );
      }

      // check file size
      if (file.size > 1024 * 150) {
        return toast.error(
          "File size is too big. Size must be 150kb or less than 150kb."
        );
      }

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

          setDocs({
            ...docs,
            driverLicense: readerEvent.target.result,
          });
          addDemographicData(newState);
        };
      } else if (id === "patientsPicture") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...demographicState,
            patientsPicture: readerEvent.target.result,
          };
          setDocs({
            ...docs,
            patientsPicture: readerEvent.target.result,
          });
          addDemographicData(newState);
        };
      } else if (id === "insuranceCardFront") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...primaryInsuranceState,
            insuranceCardFront: readerEvent.target.result,
          };

          setDocs({
            ...docs,
            insuranceCardFront: readerEvent.target.result,
          });
          addPrimaryInsurance(newState);
        };
      } else if (id === "insuranceCardBack") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...primaryInsuranceState,
            insuranceCardBack: readerEvent.target.result,
          };
          setDocs({
            ...docs,
            insuranceCardBack: readerEvent.target.result,
          });
          addPrimaryInsurance(newState);
        };
      } else if (id === "secInsuranceFront") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...secondaryInsuranceState,
            insuranceCardFront: readerEvent.target.result,
          };
          setDocs({
            ...docs,
            secInsuranceFront: readerEvent.target.result,
          });
          addSecondaryInsurance(newState);
        };
      } else if (id === "secInsuranceBack") {
        reader.onload = (readerEvent) => {
          const newState = {
            ...secondaryInsuranceState,
            insuranceCardBack: readerEvent.target.result,
          };
          setDocs({
            ...docs,
            secInsuranceBack: readerEvent.target.result,
          });
          addSecondaryInsurance(newState);
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
