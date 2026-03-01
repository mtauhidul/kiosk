import { Container, TextField, CircularProgress, Alert, Button, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
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
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);

  // Generate years (from 1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  
  // Generate days based on selected month and year
  const getDaysInMonth = () => {
    if (!dobMonth) return 31;
    if (!dobYear) return 31;
    
    const monthIndex = parseInt(dobMonth) - 1;
    const year = parseInt(dobYear);
    
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  
  const days = Array.from({ length: getDaysInMonth() }, (_, i) => {
    const day = i + 1;
    return String(day).padStart(2, "0");
  });

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
    if (!dobMonth || !dobDay || !dobYear) {
      setError("Please enter your complete date of birth");
      return;
    }

    // Format date as YYYY-MM-DD
    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`;

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

              <Box sx={{ mb: 3 }}>
                <h5 className="header4" style={{ marginBottom: "12px", marginTop: "8px" }}>
                  Date of Birth
                </h5>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={dobMonth}
                      onChange={(e) => {
                        setDobMonth(e.target.value);
                        // Reset day if it's invalid for the new month
                        if (dobDay && dobYear) {
                          const maxDays = new Date(parseInt(dobYear), parseInt(e.target.value), 0).getDate();
                          if (parseInt(dobDay) > maxDays) {
                            setDobDay("");
                          }
                        }
                      }}
                      label="Month"
                      disabled={loading}
                      sx={{
                        "& .MuiSelect-select": {
                          fontSize: "1.1rem",
                          padding: "14px"
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400,
                          }
                        }
                      }}
                    >
                      {months.map((month) => (
                        <MenuItem 
                          key={month.value}
                          value={month.value}
                          sx={{ fontSize: "1.1rem", padding: "12px 16px" }}
                        >
                          {month.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Day</InputLabel>
                    <Select
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                      label="Day"
                      disabled={loading}
                      sx={{
                        "& .MuiSelect-select": {
                          fontSize: "1.1rem",
                          padding: "14px"
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400,
                          }
                        }
                      }}
                    >
                      {days.map((day) => (
                        <MenuItem 
                          key={day} 
                          value={day}
                          sx={{ fontSize: "1.1rem", padding: "12px 16px" }}
                        >
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={dobYear}
                      onChange={(e) => {
                        setDobYear(e.target.value);
                        // Reset day if it's invalid for the new year (leap year handling)
                        if (dobDay && dobMonth) {
                          const maxDays = new Date(parseInt(e.target.value), parseInt(dobMonth), 0).getDate();
                          if (parseInt(dobDay) > maxDays) {
                            setDobDay("");
                          }
                        }
                      }}
                      label="Year"
                      disabled={loading}
                      sx={{
                        "& .MuiSelect-select": {
                          fontSize: "1.1rem",
                          padding: "14px"
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400,
                          }
                        }
                      }}
                    >
                      {years.map((year) => (
                        <MenuItem 
                          key={year} 
                          value={year}
                          sx={{ fontSize: "1.1rem", padding: "12px 16px" }}
                        >
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

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
                disabled={loading || !firstName.trim() || !lastName.trim() || !dobMonth || !dobDay || !dobYear}
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
