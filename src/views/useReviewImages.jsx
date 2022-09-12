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
      if (file.size >= 1024 * 150) {
        return toast.error(
          "File size is too big. Size must be 150kb or less than 150kb."
        );
      }

      // render image preview
      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
      }

      switch (id) {
        case "patientsPicture":
          return (reader.onload = (readerEvent) => {
            addDemographicData({
              ...demographicState,
              patientsPicture: readerEvent.target.result,
            });
            setDocs({
              ...docs,
              patientsPicture: readerEvent.target.result,
            });
          });
        case "driversLicense":
          return (reader.onload = (readerEvent) => {
            addDemographicData({
              ...demographicState,
              driversLicense: readerEvent.target.result,
            });
            setDocs({
              ...docs,
              driverLicense: readerEvent.target.result,
            });
          });
        case "insuranceCardFront":
          return (reader.onload = (readerEvent) => {
            addPrimaryInsurance({
              ...primaryInsuranceState,
              insuranceCardFront: readerEvent.target.result,
            });
            setDocs({
              ...docs,
              insuranceCardFront: readerEvent.target.result,
            });
          });
        case "insuranceCardBack":
          return (reader.onload = (readerEvent) => {
            addPrimaryInsurance({
              ...primaryInsuranceState,
              insuranceCardBack: readerEvent.target.result,
            });

            setDocs({
              ...docs,
              insuranceCardBack: readerEvent.target.result,
            });
          });
        case "secInsuranceFront":
          return (reader.onload = (readerEvent) => {
            addSecondaryInsurance({
              ...secondaryInsuranceState,
              insuranceCardFront: readerEvent.target.result,
            });
            setDocs({
              ...docs,
              secInsuranceFront: readerEvent.target.result,
            });
          });
        case "secInsuranceBack":
          return (reader.onload = (readerEvent) => {
            addSecondaryInsurance({
              ...secondaryInsuranceState,
              insuranceCardBack: readerEvent.target.result,
            });
            setDocs({
              ...docs,
              secInsuranceBack: readerEvent.target.result,
            });
          });

        default:
          break;
      }
    },
    [addDemographicData, addPrimaryInsurance, addSecondaryInsurance, docs]
  );

  React.useEffect(() => {
    const demographicState = store?.getState()?.data?.demographicsInfo;
    const primaryInsuranceState = store?.getState()?.data?.primaryInsurance;
    const secondaryInsuranceState = store?.getState()?.data?.secondaryInsurance;

    setDocs({
      driverLicense: demographicState.driversLicense || "",
      patientsPicture: demographicState.patientsPicture || "",
      insuranceCardFront: primaryInsuranceState.insuranceCardFront || "",
      insuranceCardBack: primaryInsuranceState.insuranceCardBack || "",
      secInsuranceFront: secondaryInsuranceState.insuranceCardFront || "",
      secInsuranceBack: secondaryInsuranceState.insuranceCardBack || "",
    });
  }, []);

  return {
    docs,
    addFile,
  };
};

export default useReviewImages;
