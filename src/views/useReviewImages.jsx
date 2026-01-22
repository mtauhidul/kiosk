import * as React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
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

  const demographicsInfo = useSelector((state) => state.data?.demographicsInfo);
  const primaryInsurance = useSelector((state) => state.data?.primaryInsurance);
  const secondaryInsurance = useSelector(
    (state) => state.data?.secondaryInsurance,
  );

  const { addPrimaryInsurance, addSecondaryInsurance, addDemographicData } =
    bindActionCreators(actionCreators, dispatch);

  const addFile = React.useCallback(
    (id, file) => {
      if (!file) return toast.error("⚠ File doesn't exist!");

      // check file types
      const types = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!types.includes(file.type)) {
        return toast.error(
          "File type is not supported. Enter a valid format of image.",
        );
      }

      // check file size
      if (file.size >= 1024 * 150) {
        return toast.error(
          "File size is too big. Size must be 150kb or less than 150kb.",
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
              ...demographicsInfo,
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
              ...demographicsInfo,
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
              ...primaryInsurance,
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
              ...primaryInsurance,
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
              ...secondaryInsurance,
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
              ...secondaryInsurance,
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
    [
      addDemographicData,
      addPrimaryInsurance,
      addSecondaryInsurance,
      docs,
      demographicsInfo,
      primaryInsurance,
      secondaryInsurance,
    ],
  );

  React.useEffect(() => {
    setDocs({
      driverLicense: demographicsInfo?.driversLicense || "",
      patientsPicture: demographicsInfo?.patientsPicture || "",
      insuranceCardFront: primaryInsurance?.insuranceCardFront || "",
      insuranceCardBack: primaryInsurance?.insuranceCardBack || "",
      secInsuranceFront: secondaryInsurance?.insuranceCardFront || "",
      secInsuranceBack: secondaryInsurance?.insuranceCardBack || "",
    });
  }, [demographicsInfo, primaryInsurance, secondaryInsurance]);

  return {
    docs,
    addFile,
  };
};

export default useReviewImages;
