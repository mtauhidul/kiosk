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

  // Test encounter ID for flying testers
  const TEST_ENCOUNTER_ID = "TEST123";

  useEffect(() => {
    // Load encounter ID and patient ID from session (set by EncounterVerification page)
    const storedEncounterId = sessionStorage.getItem("encounterId");
    const storedPatientId = sessionStorage.getItem("patientId");
    
    if (storedEncounterId && storedPatientId) {
      console.log("Loading pre-verified encounter:", storedEncounterId);
      setEncounterId(storedEncounterId);
      setVerified(true);
      
      // Load patient data from session
      const storedPatient = sessionStorage.getItem("patient");
      if (storedPatient) {
        try {
          const patientDataWrapper = JSON.parse(storedPatient);
          const patientData = patientDataWrapper.data;
          
          setPatient(patientDataWrapper);
          
          // Auto-populate form with Firestore data
          if (patientData) {
            // Full Name - check multiple possible fields
            const fullName = patientData.firstName && patientData.lastName 
              ? `${patientData.firstName} ${patientData.lastName}`
              : patientData.fullName || 
                patientData.patientName ||
                (patientData.patientFirstName && patientData.patientLastName 
                  ? `${patientData.patientFirstName} ${patientData.patientLastName}`
                  : "");
            
            // Date of Birth - check multiple possible field names
            const dobValue = patientData.dateOfBirth || 
                           patientData.patientDOB || 
                           patientData.patient_dob ||
                           patientData.dob ||
                           "";
            
            const dobInfo = parseDOB(dobValue);
            
            // Location - check multiple possible field names
            const location = patientData.facilityName || 
                           patientData.appointmentFacilityName || 
                           patientData.appointment_facility_name ||
                           patientData.facility ||
                           "";
            
            console.log("Auto-populating form with:", {
              fullName,
              dobValue,
              dobInfo,
              location,
              encounterId: storedEncounterId,
              rawPatientData: patientData
            });
            
            setUser({
              fullName: fullName,
              day: dobInfo.day,
              month: dobInfo.month,
              year: dobInfo.year,
              location: location,
              encounterId: storedEncounterId,
            });
          }
        } catch (e) {
          console.error("Error parsing stored patient data:", e);
        }
      }
    } else {
      // No pre-verified encounter, redirect back to verification
      console.warn("No encounter verification found, redirecting...");
      navigate("/encounter-verification");
    }
  }, [navigate]);

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

  // Helper function to parse date of birth
  const parseDOB = (dobDate) => {
    if (!dobDate) {
      console.log("parseDOB: No DOB provided");
      return { day: "", month: "", year: "" };
    }

    console.log("parseDOB: Parsing date:", dobDate);
    const date = new Date(dobDate);
    
    if (isNaN(date.getTime())) {
      console.log("parseDOB: Invalid date format:", dobDate);
      return { day: "", month: "", year: "" };
    }

    const result = {
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(), // JavaScript months are 0-indexed
      year: date.getFullYear().toString(),
    };
    
    console.log("parseDOB: Parsed result:", result);
    return result;
  };

  const verifyAppointment = async () => {
    if (!encounterId.trim()) {
      toast.error("Please enter your Encounter ID");
      return;
    }

    setLoading(true);

    // Check if it's the test encounter ID
    if (encounterId === TEST_ENCOUNTER_ID) {
      // Simulate test patient data
      const testPatientData = {
        id: TEST_ENCOUNTER_ID,
        data: {
          patientName: "Test Patient",
          patientDOB: "1990-01-01",
          appointmentFacilityName: "Your Total Foot Care Specialist",
        },
        date: new Date().toLocaleDateString(),
      };

      setPatient(testPatientData);
      window.sessionStorage.setItem("patient", JSON.stringify(testPatientData));

      // Set test user data
      setVerified(true);
      setUser({
        fullName: "Test Patient",
        day: "1",
        month: "1",
        year: "1990",
        location: "Your Total Foot Care Specialist",
        encounterId: TEST_ENCOUNTER_ID,
      });

      setLoading(false);
      toast.success(
        "Test appointment verified! Please complete your information."
      );
      return;
    }

    try {
      // Call the checkAppointment API function with the encounter ID
      const response = await checkAppointment(encounterId);

      console.log("API Response:", response); // Debug the actual response structure

      // Check both success formats to be safe (response.success or response.status === "success")
      if (response.success || response.status === "success") {
        // Store appointment data in patient context
        const appointmentData = {
          id: encounterId,
          data: response.data,
          date: new Date().toLocaleDateString(),
        };

        console.log("Appointment data:", appointmentData);

        setPatient(appointmentData);
        window.sessionStorage.setItem(
          "patient",
          JSON.stringify(appointmentData)
        );

        // Extract patient details from the response
        const patientData = response.data;
        const patientName =
          patientData.patientName ||
          patientData.fullName ||
          `${patientData.patientFirstName || ""} ${
            patientData.patientLastName || ""
          }`.trim();

        // Parse DOB from the patientDOB field if available
        const dobInfo = parseDOB(patientData.patientDOB);

        // Set verification status and update user data with all available info
        setVerified(true);
        setUser({
          fullName: patientName || "",
          day: dobInfo.day,
          month: dobInfo.month,
          year: dobInfo.year,
          // Use appointmentFacilityName as default location if available
          location: patientData.appointmentFacilityName || "",
          encounterId: encounterId,
        });

        setLoading(false);
        toast.success(
          "Appointment verified! Please complete your information."
        );
      } else {
        // Handle error response
        setLoading(false);
        // Log the exact error response for debugging
        console.error("Error response structure:", response);

        // Try to extract error message from different possible response formats
        const errorMessage =
          response.message ||
          (response.data && response.data.message) ||
          "No appointment found. Please contact the hospital.";

        toast.error(errorMessage);
      }
    } catch (error) {
      setLoading(false);
      // Log detailed error information
      console.error("Appointment verification error:", error);

      // Try to extract more detailed error information if available
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Error verifying appointment. Please try again.";

      toast.error(errorMessage);
    }
  };

  const handleSubmit = () => {
    // Add encounter ID to user data before submitting
    const userData = {
      ...user,
      encounterId: encounterId,
    };
    addUserInfo(userData);
    navigate("/select-identity");
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

            {/* Test Encounter ID Display */}
            <Box
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: "12px",
                border: "1px dashed #ccc",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                For testing purposes, use: <strong>{TEST_ENCOUNTER_ID}</strong>
              </p>
            </Box>

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
                    value={user?.fullName?.split(", ").reverse().join(" ")}
                    onChange={(e) =>
                      setUser({ ...user, fullName: e.target.value })
                    }
                    id="outlined-required"
                    label="Full Name"
                  />
                </FormControl>
                <h6
                  className="header6"
                  style={{
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  Date of Birth
                </h6>
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
                    <MenuItem value="KATY">
                      KATY
                    </MenuItem>
                    <MenuItem value="CYPRESS">
                      CYPRESS
                    </MenuItem>
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
