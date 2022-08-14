import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Bottom from "../../components/Bottom/Bottom";
import DOB from "../../components/DOB/DOB";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/Information.module.css";

const Information = () => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const location = useLocation();

  const [user, setUser] = useState({
    fullName: "",
    day: "",
    month: "",
    year: "",
    location: "",
  });

  const [demographics, setDemographics] = useState({
    address: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    phone: "",
    email: "",
    patientsPicture: "",
    driversLicense: "",
  });

  useEffect(() => {
    if (
      demographics.address === "" ||
      demographics.city === "" ||
      demographics.state === "" ||
      demographics.zipcode === "" ||
      demographics.phone === "" ||
      demographics.email === ""
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [
    demographics.address,
    demographics.city,
    demographics.state,
    demographics.zipcode,
    demographics.phone,
    demographics.email,
    demographics.patientsPicture,
    demographics.driversLicense,
  ]);

  useEffect(() => {
    const predefinedData = store?.getState()?.data?.userInfo;
    setUser(predefinedData);
    const state = store?.getState()?.data?.demographicsInfo;
    setDemographics({
      address: state?.address || "",
      address2: state?.address2 || "",
      city: state?.city || "",
      state: state?.state || "",
      zipcode: state?.zipcode || "",
      phone: state?.phone || "",
      email: state?.email || "",
      user: predefinedData,
    });
    // setDemographics({ ...state, user: predefinedData });
  }, []);

  const { addDemographicData } = bindActionCreators(actionCreators, dispatch);

  return (
    <form className={styles.informationContainer}>
      <div className={styles.formContainer}>
        <h3 className="header3">GENERAL INFO</h3>
        <br />
        <div className={styles.formWrapper}>
          <div className={styles.formLeft}>
            <h6 className="header6">Patient Name</h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              <TextField
                required
                disabled
                value={user?.fullName}
                id="outlined-required"
                onChange={(e) =>
                  setDemographics({
                    ...demographics,
                    patientName: e.target.value,
                  })
                }
              />
            </FormControl>
            <h6 className="header6">Address</h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              <TextField
                required
                value={demographics?.address}
                id="outlined-required"
                label={demographics.address !== "" ? "" : "Address"}
                onChange={(e) =>
                  setDemographics({ ...demographics, address: e.target.value })
                }
              />
            </FormControl>
            <h6 className="header6">City</h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              <TextField
                required
                value={demographics?.city}
                id="outlined-required"
                label={demographics.city !== "" ? "" : "City"}
                onChange={(e) =>
                  setDemographics({ ...demographics, city: e.target.value })
                }
              />
            </FormControl>
            <h6 className="header6">Zipcode</h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              <TextField
                required
                value={demographics?.zipcode}
                id="outlined-required"
                label={demographics.zipcode !== "" ? "" : "Zipcode"}
                onChange={(e) =>
                  setDemographics({ ...demographics, zipcode: e.target.value })
                }
              />
            </FormControl>
            <h6 className="header6">Email Address</h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              <TextField
                required
                value={demographics?.email}
                id="outlined-required"
                label={demographics.email !== "" ? "" : "Email Address"}
                onChange={(e) =>
                  setDemographics({ ...demographics, email: e.target.value })
                }
              />
            </FormControl>
          </div>
          <div className={styles.formRight}>
            <h6 className="header6">Date of Birth</h6>
            <DOB setData={setUser} data={user} />
            <h6 style={{ marginTop: "17px" }} className="header6">
              Apartment, suite, etc (optional)
            </h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              <TextField
                value={demographics?.address2}
                id="outlined-required"
                label={demographics.address2 !== "" ? "" : "Address"}
                onChange={(e) =>
                  setDemographics({ ...demographics, address2: e.target.value })
                }
              />
            </FormControl>
            <h6 className="header6">State</h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              {demographics.state === "" ? (
                <InputLabel id="demo-simple-select-helper-label">
                  State
                </InputLabel>
              ) : (
                <></>
              )}

              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={demographics?.state}
                label={demographics.state !== "" ? "" : "Location"}
                onChange={(e) =>
                  setDemographics({ ...demographics, state: e.target.value })
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
              </Select>
            </FormControl>
            <h6 className="header6">Primary Phone</h6>
            <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
              <TextField
                required
                value={demographics?.phone}
                id="outlined-required"
                label={
                  demographics.phone !== "" ? "" : "Enter your phone number"
                }
                onChange={(e) =>
                  setDemographics({ ...demographics, phone: e.target.value })
                }
              />
            </FormControl>
          </div>
        </div>
      </div>
      <Bottom
        isDisabled={isDisabled}
        handleSubmit={addDemographicData}
        data={demographics}
        isEdit={location.state}
      />
    </form>
  );
};

export default Information;
