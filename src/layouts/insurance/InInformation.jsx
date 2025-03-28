import { FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/InsuranceInfo.module.css";
import { date } from "../../utils/formatAMPM";

const InInformation = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(true);

  const [primaryInsurance, setPrimaryInsurance] = useState({
    activeDate: "",
    copayForSpecialist: "100",
    insuranceName: "",
    copay: "40",
    memberId: "",
    groupName: "",
    groupNumber: "",
    phoneNumber: "",
    // Add these fields to preserve the card images
    insuranceCardFront: null,
    insuranceCardBack: null,
  });

  useEffect(() => {
    const state = store?.getState()?.data?.primaryInsurance;
    setPrimaryInsurance({
      insuranceName: state?.insuranceName || "",
      copayForSpecialist: state?.copayForSpecialist || "100",
      activeDate: state?.activeDate || date || "",
      copay: state?.copay || "40",
      memberId: state?.memberId || "",
      groupName: state?.groupName || "",
      groupNumber: state?.groupNumber || "",
      phoneNumber: state?.phoneNumber || "",
      // Preserve the insurance card images
      insuranceCardFront: state?.insuranceCardFront || null,
      insuranceCardBack: state?.insuranceCardBack || null,
    });
  }, []);

  useEffect(() => {
    if (
      primaryInsurance.insuranceName === "" ||
      primaryInsurance.memberId === "" ||
      primaryInsurance.copay === "" ||
      primaryInsurance.copayForSpecialist === "" ||
      primaryInsurance.activeDate === ""
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [
    primaryInsurance.activeDate,
    primaryInsurance.copay,
    primaryInsurance.copayForSpecialist,
    primaryInsurance.groupName,
    primaryInsurance.groupNumber,
    primaryInsurance.insuranceName,
    primaryInsurance.memberId,
    primaryInsurance.phoneNumber,
  ]);

  const { addPrimaryInsurance } = bindActionCreators(actionCreators, dispatch);

  // Custom submit handler to preserve card images
  const handleSubmit = (data) => {
    // Make sure we're keeping the insurance card images when updating
    addPrimaryInsurance({
      ...data,
      // Keep the card images even if they're not part of the form
      insuranceCardFront: primaryInsurance.insuranceCardFront,
      insuranceCardBack: primaryInsurance.insuranceCardBack,
    });
  };

  return (
    <AnimatedPage>
      <form className={styles.informationContainer}>
        <div className={styles.eligibilityFormWrapper}>
          <h3 className="header3">Eligibility</h3>
          <br />
          <div className={styles.eligibilityForm}>
            <div className={styles.inputWrapper}>
              <h6 className="header6">Active Date</h6>
              <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
                <TextField
                  required
                  value={primaryInsurance.activeDate}
                  id="outlined-required"
                  disabled
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
                    disabled
                    required
                    id="outlined-required"
                    value={primaryInsurance.copayForSpecialist}
                    onChange={(e) => {
                      setPrimaryInsurance({
                        ...primaryInsurance,
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
                  value={primaryInsurance.insuranceName}
                  onChange={(e) =>
                    setPrimaryInsurance({
                      ...primaryInsurance,
                      insuranceName: e.target.value,
                    })
                  }
                  id="outlined-required"
                  label={
                    primaryInsurance.insuranceName !== ""
                      ? ""
                      : "Insurance name"
                  }
                />
              </FormControl>
              <h6 className="header6">Member ID</h6>
              <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
                <TextField
                  required
                  value={primaryInsurance.memberId}
                  onChange={(e) =>
                    setPrimaryInsurance({
                      ...primaryInsurance,
                      memberId: e.target.value,
                    })
                  }
                  id="outlined-required"
                  label={
                    primaryInsurance.memberId !== "" ? "" : "Enter member ID"
                  }
                />
              </FormControl>
              <h6 className="header6">Group Number</h6>
              <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
                <TextField
                  value={primaryInsurance.groupNumber}
                  onChange={(e) =>
                    setPrimaryInsurance({
                      ...primaryInsurance,
                      groupNumber: e.target.value,
                    })
                  }
                  id="outlined-required"
                  label={
                    primaryInsurance.groupNumber !== ""
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
                    sx={{
                      flex: "1",
                    }}
                    disabled
                    required
                    id="outlined-required"
                    value={primaryInsurance.copay}
                    onChange={(e) => {
                      setPrimaryInsurance({
                        ...primaryInsurance,
                        copay: e.target.value,
                      });
                    }}
                  />
                </div>
              </FormControl>
              <h6 className="header6">Group Name</h6>
              <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
                <TextField
                  value={primaryInsurance.groupName}
                  onChange={(e) =>
                    setPrimaryInsurance({
                      ...primaryInsurance,
                      groupName: e.target.value,
                    })
                  }
                  id="outlined-required"
                  label={
                    primaryInsurance.groupName !== "" ? "" : "Enter group name"
                  }
                />
              </FormControl>
              <h6 className="header6">Phone Number</h6>
              <FormControl sx={{ mb: 3, mt: 1, width: "100%" }}>
                <TextField
                  value={primaryInsurance.phoneNumber}
                  onChange={(e) =>
                    setPrimaryInsurance({
                      ...primaryInsurance,
                      phoneNumber: e.target.value,
                    })
                  }
                  id="outlined-required"
                  label={
                    primaryInsurance.phoneNumber !== ""
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
          handleSubmit={handleSubmit}
          data={primaryInsurance}
        />
      </form>
    </AnimatedPage>
  );
};

export default InInformation;
