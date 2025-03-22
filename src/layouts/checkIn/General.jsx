import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LineWave } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { checkAppointment } from "../../apis/api";
import { PatientContext, PatientsDataContext } from "../../App";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import DOB from "../../components/DOB/DOB";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/General.module.css";

const General = () => {
  const [data, setData] = useContext(PatientsDataContext);
  const [patient, setPatient] = useContext(PatientContext);
  const dispatch = useDispatch();
  const { removeUserData } = bindActionCreators(actionCreators, dispatch);
  const [isDisabled, setIsDisabled] = useState(false);
  const [verified, setVerified] = useState(false); // Track if encounter ID is verified
  const [loading, setLoading] = useState(false);
  const [encounterId, setEncounterId] = useState(""); // Just for initial verification
  const [user, setUser] = useState({
    fullName: "",
    day: "",
    month: "",
    year: "",
    location: "",
    encounterId: "", // Will be populated after verification
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Only load saved state if we're already verified (e.g., on page refresh)
    const state = store?.getState()?.data?.userInfo;
    if (state && state.encounterId) {
      setEncounterId(state.encounterId);
      setUser({
        fullName: state.fullName || "",
        day: state.day || "",
        month: state.month || "",
        year: state.year || "",
        location: state.location || "",
        encounterId: state.encounterId || "",
      });
      setVerified(true);
    }
  }, []);

  useEffect(() => {
    // Only check form completion if already verified
    if (verified) {
      if (
        user.fullName === "" ||
        user.day === "" ||
        user.month === "" ||
        user.year === "" ||
        user.location === ""
      ) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [user, verified]);

  const { addUserInfo } = bindActionCreators(actionCreators, dispatch);

  const verifyAppointment = async () => {
    if (!encounterId.trim()) {
      toast.error("Please enter your Encounter ID");
      return;
    }

    setLoading(true);

    try {
      // Call the checkAppointment API function with the encounter ID
      const response = await checkAppointment(encounterId);

      if (response.status === "success") {
        // Store appointment data in patient context
        const appointmentData = {
          id: encounterId,
          data: response.data,
          // Add any other necessary fields from the response
          date: new Date().toLocaleDateString(),
        };

        setPatient(appointmentData);
        window.sessionStorage.setItem(
          "patient",
          JSON.stringify(appointmentData)
        );

        // Set verification status and update user data with encounterId
        setVerified(true);
        setUser({
          ...user,
          encounterId: encounterId,
          // If API returns patient name, you can pre-fill it here
          fullName: response.data?.fullName || user.fullName,
        });

        setLoading(false);
        toast.success(
          "Appointment verified! Please complete your information."
        );
      } else {
        // Handle error response
        setLoading(false);
        toast.error(
          response.message ||
            "No appointment found. Please contact the hospital."
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error verifying appointment. Please try again.");
      console.error("Appointment verification error:", error);
    }
  };

  const handleSubmit = () => {
    // Add encounter ID to user data before submitting
    const userData = {
      ...user,
      encounterId: encounterId,
    };
    addUserInfo(userData);
  };

  return (
    <AnimatedPage>
      <form className={styles.GeneralContainer}>
        {!verified ? (
          // Step 1: Encounter ID verification
          <div className={styles.form}>
            <h3 className="header3">Appointment Verification</h3>
            <p>Please enter your Encounter ID to begin the check-in process</p>

            <FormControl sx={{ mb: 3, mt: 2, minWidth: 120, width: "100%" }}>
              <TextField
                required
                value={encounterId}
                onChange={(e) => setEncounterId(e.target.value)}
                id="encounter-id"
                label="Encounter ID"
                placeholder="Enter the ID provided with your appointment"
              />
            </FormControl>

            {!loading ? (
              <Button
                onClick={verifyAppointment}
                sx={{ marginTop: "20px" }}
                variant="contained"
                disabled={!encounterId.trim()}
              >
                Verify Appointment
              </Button>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <LineWave
                  height="100"
                  width="100"
                  color="#212155"
                  ariaLabel="line-wave"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </Box>
            )}
          </div>
        ) : (
          // Step 2: Fill out personal information after verification
          <>
            <div>
              <div className={styles.form}>
                <h3 className="header3">General Info</h3>
                <FormControl
                  sx={{ mb: 3, mt: 5, minWidth: 120, width: "100%" }}
                >
                  <TextField
                    required
                    value={user?.fullName}
                    onChange={(e) =>
                      setUser({ ...user, fullName: e.target.value })
                    }
                    id="outlined-required"
                    label="Full Name"
                  />
                </FormControl>
                <h6 className="header6">Date of Birth</h6>
                <DOB setData={setUser} data={user} />
              </div>
              <div id={styles.locationSelector} className={styles.form}>
                <h6 className="header6">
                  Which location is your appointment scheduled?
                </h6>
                <FormControl
                  sx={{ mr: 2, mt: 1, minWidth: { xs: 250, md: 390 } }}
                >
                  <InputLabel id="demo-simple-select-helper-label">
                    Location
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={user?.location}
                    label="Location"
                    onChange={(e) =>
                      setUser({ ...user, location: e.target.value })
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Your Total Foot Care Specialist">
                      Your Total Foot Care Specialist
                    </MenuItem>
                    <MenuItem value="Location B">Location B</MenuItem>
                    <MenuItem value="Location C">Location C</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <Bottom
              isDisabled={isDisabled}
              handleSubmit={handleSubmit}
              data={user}
            />
          </>
        )}
      </form>
    </AnimatedPage>
  );
};

export default General;
