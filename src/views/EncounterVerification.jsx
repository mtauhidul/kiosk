import { Container, TextField, CircularProgress, Alert, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Logo from "../assets/images/logo.svg";
import AnimatedPage from "../components/Animation/Pages";
import styles from "../styles/welcome.module.css";
import { verifyEncounterId } from "../apis/api";
import * as actionCreators from "../state/actionCreators/index";

const EncounterVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addDemographicData, addPrimaryInsurance } = bindActionCreators(actionCreators, dispatch);
  const [encounterId, setEncounterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);

  const handleSubmit = async () => {
    setError("");
    setPatientInfo(null);

    if (!encounterId.trim()) {
      setError("Please enter your Encounter ID");
      return;
    }

    setLoading(true);

    try {
      console.log("Verifying encounter ID:", encounterId.trim());
      const response = await verifyEncounterId(encounterId.trim());
      
      console.log("Verification response:", response);
      
      if (response.status === "success") {
        setPatientInfo(response.data);
        
        // Store encounter data for later use
        sessionStorage.setItem("encounterId", encounterId.trim());
        sessionStorage.setItem("patientId", response.data.id);
        
        // Store complete patient data for General page
        const patientData = {
          id: response.data.id,
          data: response.data,
          date: new Date().toLocaleDateString(),
        };
        sessionStorage.setItem("patient", JSON.stringify(patientData));
        
        // Pre-populate demographics data in Redux
        const patient = response.data;
        if (patient.address || patient.phone || patient.email) {
          addDemographicData({
            address: patient.address?.street || "",
            address2: "",
            city: patient.address?.city || "",
            state: patient.address?.state || "",
            zipcode: patient.address?.zipCode || "",
            phone: patient.phone || "",
            email: patient.email || "",
          });
        }
        
        // Pre-populate insurance data in Redux
        if (patient.insurance?.provider || patient.insurance?.policyNumber) {
          addPrimaryInsurance({
            insuranceName: patient.insurance?.provider || "",
            memberId: patient.insurance?.policyNumber || "",
            groupName: "",
            groupNumber: "",
            phoneNumber: "",
            activeDate: new Date().toLocaleDateString(),
            copay: "40",
            copayForSpecialist: "100",
          });
        }
        
        console.log("Stored in session:", {
          encounterId: encounterId.trim(),
          patientId: response.data.id,
          patientData
        });
        
        // Navigate to check-in after showing confirmation
        setTimeout(() => {
          navigate("/kiosk/checkIn_General");
        }, 2000);
      } else {
        setError(response.message || "Encounter ID not found. Please check and try again.");
      }
    } catch (err) {
      console.error("Error during verification:", err);
      setError("Unable to verify Encounter ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && encounterId.trim()) {
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
            <div style={{ maxWidth: "500px" }}>
              <h1 className="header1">
                Enter Your Encounter ID
              </h1>
              <br />
              <h5 className="header4">
                Please enter the Encounter ID provided in your appointment confirmation
              </h5>
              <br />
              <br />

              <TextField
                fullWidth
                label="Encounter ID"
                variant="outlined"
                value={encounterId}
                onChange={(e) => setEncounterId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 888470"
                disabled={loading}
                sx={{ mb: 3 }}
                autoFocus
                inputProps={{
                  style: { fontSize: "1.2rem", padding: "16px" }
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
                  Appointment with {patientInfo.appointmentProviderName}
                  <br />
                  Redirecting to check-in...
                </Alert>
              )}

              <Button
                onClick={handleSubmit}
                disabled={loading || !encounterId.trim()}
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
