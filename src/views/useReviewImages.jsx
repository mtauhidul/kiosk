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
  const { addPrimaryInsurance, addSecondaryInsurance, addDemographicData } =
    bindActionCreators(actionCreators, dispatch);

  const addFile = React.useCallback(
    (id, file) => {
      var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;

      if (!allowedExtensions.exec(file.name))
        return toast.error("Invalid file type. Please select an image file.");

      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
      }

      const demographicState = store?.getState()?.data?.demographicsInfo;
      const primaryInsuranceState = store?.getState()?.data?.primaryInsurance;
      const secondaryInsuranceState =
        store?.getState()?.data?.secondaryInsurance;

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
    [addDemographicData, addPrimaryInsurance, addSecondaryInsurance, docs]
  );

  React.useEffect(() => {
    const demographicInfo = store?.getState()?.data?.demographicsInfo;
    const primaryInsurance = store?.getState()?.data?.primaryInsurance;
    const secondaryInsurance = store?.getState()?.data?.secondaryInsurance;

    setDocs({
      insuranceCardFront: primaryInsurance.insuranceCardFront || "",
      insuranceCardBack: primaryInsurance.insuranceCardBack || "",
      secInsuranceFront: secondaryInsurance.insuranceCardFront || "",
      secInsuranceBack: secondaryInsurance.insuranceCardBack || "",
      driverLicense: demographicInfo.driversLicense || "",
      patientsPicture: demographicInfo.patientsPicture || "",
    });
  }, []);

  return {
    docs,
    addFile,
  };
};

export default useReviewImages;
