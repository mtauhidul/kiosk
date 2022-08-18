import { FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
import Bottom from "../../components/Bottom/Bottom";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/InsuranceInfo.module.css";
import { date } from "../../utils/formatAMPM";

const SecInInformation = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(true);
  const [secInsurance, setSecInsurance] = useState({
    activeDate: "",
    copayForSpecialist: "",
    insuranceName: "",
    copay: "",
    memberId: "",
    groupName: "",
    groupNumber: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const state = store?.getState()?.data?.secondaryInsurance;
    setSecInsurance({
      insuranceName: state?.insuranceName || "",
      copayForSpecialist: state?.copayForSpecialist || "",
      activeDate: state?.activeDate || date || "",
      copay: state?.copay || "",
      memberId: state?.memberId || "",
      groupName: state?.groupName || "",
      groupNumber: state?.groupNumber || "",
      phoneNumber: state?.phoneNumber || "",
    });
  }, []);

  useEffect(() => {
    if (
      secInsurance.insuranceName === "" ||
      secInsurance.memberId === "" ||
      secInsurance.groupName === "" ||
      secInsurance.groupNumber === "" ||
      secInsurance.phoneNumber === "" ||
      secInsurance.copay === "" ||
      secInsurance.copayForSpecialist === "" ||
      secInsurance.activeDate === ""
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [
    secInsurance.activeDate,
    secInsurance.copay,
    secInsurance.copayForSpecialist,
    secInsurance.groupName,
    secInsurance.groupNumber,
    secInsurance.insuranceName,
    secInsurance.memberId,
    secInsurance.phoneNumber,
  ]);

  const { addSecondaryInsurance } = bindActionCreators(
    actionCreators,
    dispatch
  );

  return (
    <form className={styles.informationContainer}>
      <div className={styles.eligibilityFormWrapper}>
        <h3 className="header3">Eligibility</h3>
        <br />
        <div className={styles.eligibilityForm}>
          <div className={styles.inputWrapper}>
            <h6 className="header6">Active Date</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <TextField
                value={secInsurance.activeDate}
                id="outlined-required"
              />
            </FormControl>
          </div>
          <div className={styles.inputWrapper}>
            <h6 className="header6">Copay for Specialist</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "stretch",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    marginRight: "5px",
                    height: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  $
                </div>

                <TextField
                  style={{
                    flex: "1",
                  }}
                  required
                  id="outlined-required"
                  value={secInsurance.copayForSpecialist}
                  onChange={(e) => {
                    setSecInsurance({
                      ...secInsurance,
                      copayForSpecialist: e.target.value,
                    });
                  }}
                />
              </div>
            </FormControl>
          </div>
        </div>
      </div>
      <br />
      <div className={styles.eligibilityFormWrapper}>
        <h3 className="header3">GENERAL INFO</h3>
        <br />
        <div className={styles.eligibilityForm}>
          <div className={styles.inputWrapper}>
            <h6 className="header6">Primary Insurance</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <TextField
                required
                value={secInsurance.insuranceName}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    insuranceName: e.target.value,
                  })
                }
                id="outlined-required"
                label={
                  secInsurance.insuranceName !== "" ? "" : "Insurance name"
                }
              />
            </FormControl>
            <h6 className="header6">Member ID</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <TextField
                value={secInsurance.memberId}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    memberId: e.target.value,
                  })
                }
                id="outlined-required"
                label={secInsurance.memberId !== "" ? "" : "Enter member ID"}
              />
            </FormControl>
            <h6 className="header6">Group Number</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <TextField
                value={secInsurance.groupNumber}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    groupNumber: e.target.value,
                  })
                }
                id="outlined-required"
                label={
                  secInsurance.groupNumber !== ""
                    ? ""
                    : "Enter your group number"
                }
              />
            </FormControl>
          </div>
          <div className={styles.inputWrapper}>
            <h6 className="header6">Copay</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "stretch",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    marginRight: "5px",
                    height: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  $
                </div>

                <TextField
                  style={{
                    flex: "1",
                  }}
                  required
                  id="outlined-required"
                  value={secInsurance.copay}
                  onChange={(e) => {
                    setSecInsurance({
                      ...secInsurance,
                      copay: e.target.value,
                    });
                  }}
                />
              </div>
            </FormControl>
            <h6 className="header6">Group Name</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <TextField
                value={secInsurance.groupName}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    groupName: e.target.value,
                  })
                }
                id="outlined-required"
                label={secInsurance.groupName !== "" ? "" : "Enter group name"}
              />
            </FormControl>
            <h6 className="header6">Phone Number</h6>
            <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
              <TextField
                value={secInsurance.phoneNumber}
                onChange={(e) =>
                  setSecInsurance({
                    ...secInsurance,
                    phoneNumber: e.target.value,
                  })
                }
                id="outlined-required"
                label={
                  secInsurance.phoneNumber !== ""
                    ? ""
                    : "Enter your phone number"
                }
              />
            </FormControl>
          </div>
        </div>
      </div>
      <Bottom
        isEdit={location.state}
        isDisabled={isDisabled}
        handleSubmit={addSecondaryInsurance}
        data={secInsurance}
      />
    </form>
  );
};

export default SecInInformation;
