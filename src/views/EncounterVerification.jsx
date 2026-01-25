import { Container, TextField, CircularProgress, Alert, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Logo from "../assets/images/logo.svg";
import AnimatedPage from "../components/Animation/Pages";
import styles from "../styles/welcome.module.css";
import { verifyPatientByNameAndDOB } from "../apis/api";
import * as actionCreators from "../state/actionCreators/index";

const EncounterVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addDemographicData, addPrimaryInsurance, addUserInfo } = bindActionCreators(actionCreators, dispatch);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);

  const handleSubmit = async () => {
    setError("");
    setPatientInfo(null);

    // Validate inputs
    if (!firstName.trim()) {
      setError("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      setError("Please enter your last name");
      return;
    }
    if (!dateOfBirth) {
      setError("Please enter your date of birth");
      return;
    }

    setLoading(true);

    try {
      console.log("Verifying patient:", firstName.trim(), lastName.trim(), dateOfBirth);
      const response = await verifyPatientByNameAndDOB(
        firstName.trim(), 
        lastName.trim(), 
        dateOfBirth
      );
      
      console.log("Verification response:", response);
      
      if (response.status === "success") {
        setPatientInfo(response.data);
        
        // Store patient data for later use
        sessionStorage.setItem("patientId", response.data.id);
        sessionStorage.setItem("encounterId", response.data.encounterId || "");
        
        // Store complete patient data for form prepopulation
        const patientData = {
          id: response.data.id,
          data: response.data,
          date: new Date().toLocaleDateString(),
        };
        sessionStorage.setItem("patient", JSON.stringify(patientData));
        
        // Pre-populate user info in Redux
        const patient = response.data;
        addUserInfo({
          firstName: patient.firstName || "",
          middleName: patient.middleName || "",
          lastName: patient.lastName || "",
          dateOfBirth: patient.dateOfBirth || "",
          gender: patient.gender || "",
          ssn: "", // Don't store SSN in session
        });
        
        // Pre-populate demographics data in Redux
        if (patient.address || patient.phone || patient.email) {
          addDemographicData({
            address: patient.address?.street || "",
            address2: patient.address?.street2 || "",
            city: patient.address?.city || "",
            state: patient.address?.state || "",
            zipcode: patient.address?.zipCode || patient.address?.zip || "",
            phone: patient.phone || "",
            email: patient.email || "",
          });
        }
        
        // Pre-populate insurance data in Redux if available
        if (patient.insurance?.provider || patient.insurance?.policyNumber) {
          addPrimaryInsurance({
            insuranceName: patient.insurance?.provider || "",
            memberId: patient.insurance?.policyNumber || "",
            groupName: patient.insurance?.groupName || "",
            groupNumber: patient.insurance?.groupNumber || "",
            phoneNumber: patient.insurance?.phoneNumber || "",
            activeDate: patient.insurance?.effectiveDate || new Date().toLocaleDateString(),
            copay: patient.insurance?.copay || "40",
            copayForSpecialist: patient.insurance?.specialistCopay || "100",
          });
        }
        
        console.log("✅ Patient verified and data prepopulated");
        
        // Navigate to check-in after showing confirmation
        setTimeout(() => {
          navigate("/kiosk/checkIn_General");
        }, 2000);
      } else {
        setError(response.message || "Unable to verify your information. Please check and try again.");
      }
    } catch (err) {
      console.error("Error during verification:", err);
      setError("Unable to verify your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="xl" className={styles.container}>
        <Container maxWidth="xl" className={styles.wrapper}>
          <div className={styles.heroText}>
            <div>
              <img src={Logo} alt="Logo" />
            </div>
            <div style={{ maxWidth: "600px" }}>
              <h1 className="header1">
                Verify Your Appointment
              </h1>
              <br />
              <h5 className="header4">
                Please enter your name and date of birth to verify your appointment for today
              </h5>
              <br />
              <br />

              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="John"
                disabled={loading}
                sx={{ mb: 2 }}
                autoFocus
                inputProps={{
                  style: { fontSize: "1.1rem", padding: "14px" }
                }}
              />

              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Doe"
                disabled={loading}
                sx={{ mb: 2 }}
                inputProps={{
                  style: { fontSize: "1.1rem", padding: "14px" }
                }}
              />

              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                sx={{ mb: 3 }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0], // Can't be future date
                  style: { fontSize: "1.1rem", padding: "14px" }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {patientInfo && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Welcome, {patientInfo.firstName} {patientInfo.lastName}! 
                  <br />
                  Appointment with {patientInfo.appointmentProviderName || "your provider"}
                  <br />
                  Redirecting to check-in...
                </Alert>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading || !firstName.trim() || !lastName.trim() || !dateOfBirth}
                className="primaryButton"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  height: "56px",
                  fontSize: "1.1rem",
                  "&:disabled": {
                    backgroundColor: "gray !important",
                    color: "white !important",
                    cursor: "not-allowed",
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>

              <br />
              <br />
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.9rem"
                }}
              >
                ← Back to Welcome
              </button>
            </div>
          </div>
        </Container>
      </Container>
    </AnimatedPage>
  );
};

export default EncounterVerification;
