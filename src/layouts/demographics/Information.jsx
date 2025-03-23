import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import DOB from "../../components/DOB/DOB";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/Information.module.css";

// US States array with abbreviations and full names
const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
  { value: "AS", label: "American Samoa" },
  { value: "GU", label: "Guam" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "PR", label: "Puerto Rico" },
  { value: "VI", label: "U.S. Virgin Islands" },
];

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
    <AnimatedPage>
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
                    setDemographics({
                      ...demographics,
                      address: e.target.value,
                    })
                  }
                />
              </FormControl>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "50%", md: "100%" },
                  }}
                >
                  <h6 className="header6">City</h6>
                  <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
                    <TextField
                      required
                      value={demographics?.city}
                      id="outlined-required"
                      label={demographics.city !== "" ? "" : "City"}
                      onChange={(e) =>
                        setDemographics({
                          ...demographics,
                          city: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    width: { xs: "50%", md: "100%" },
                  }}
                >
                  <h6 className="header6">Zipcode</h6>
                  <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
                    <TextField
                      required
                      value={demographics?.zipcode}
                      id="outlined-required"
                      label={demographics.zipcode !== "" ? "" : "Zipcode"}
                      onChange={(e) =>
                        setDemographics({
                          ...demographics,
                          zipcode: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Box>
              </Box>

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
              <h6 className="header6" style={{ marginBottom: "10px" }}>
                Date of Birth
              </h6>
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
                    setDemographics({
                      ...demographics,
                      address2: e.target.value,
                    })
                  }
                />
              </FormControl>
              <h6 className="header6">State</h6>
              <FormControl sx={{ mt: 1, mb: 2, width: "100%" }}>
                {demographics.state === "" ? (
                  <InputLabel id="state-select-label">State</InputLabel>
                ) : (
                  <></>
                )}

                <Select
                  labelId="state-select-label"
                  id="state-select"
                  value={demographics?.state}
                  label={demographics.state !== "" ? "" : "State"}
                  onChange={(e) =>
                    setDemographics({ ...demographics, state: e.target.value })
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {usStates.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
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
    </AnimatedPage>
  );
};

export default Information;
