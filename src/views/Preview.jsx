import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";

// Icons
import EditIcon from "../assets/icons/icons8-edit.svg";
import Logo from "../assets/images/logo.svg";

// Components
import AnimatedPage from "../components/Animation/Pages";

// State and API
import { submitKioskData } from "../apis/api";
import { PatientContext } from "../App";
import * as actionCreators from "../state/actionCreators/index";
import store from "../state/store";
import { date, formatAMPM, getDayName } from "../utils/formatAMPM";

const Preview = () => {
  const state = store?.getState()?.data;
  const [, setPatient] = useContext(PatientContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { removeUserData } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    setPatient(JSON.parse(window.sessionStorage.getItem("patient")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthsLong = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const {
    allergies,
    demographicsInfo,
    familyHistory,
    // hippaPolicy,
    medicalHistory,
    medications,
    // practicePolicies,
    primaryInsurance,
    secondaryInsurance,
    shoeSize,
    socialHistory,
    surgicalHistory,
    // survey,
    userInfo,
  } = state;

  const postData = async () => {
    try {
      setLoading(true);

      // Get patient ID and encounter ID from session storage
      const patientId = sessionStorage.getItem("patientId");
      const encounterId = sessionStorage.getItem("encounterId");

      if (!patientId || !encounterId) {
        toast.error("Session expired. Please start over.");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      // Format data for V2 API (removed userInfo section)
      const kioskData = {
        patientId: patientId,
        encounterId: encounterId,
        demographicsInfo: {
          address: demographicsInfo?.address || "",
          city: demographicsInfo?.city || "",
          zipcode: demographicsInfo?.zipcode || "",
          email: demographicsInfo?.email || "",
          address2: demographicsInfo?.address2 || "",
          state: demographicsInfo?.state || "",
          phone: demographicsInfo?.phone || "",
        },
        allergies: allergies || [],
        medications: medications || [],
        familyHistory: familyHistory || {
          diabetes: false,
          heartDisease: false,
          hypertension: false,
          stroke: false,
          kidneyDisease: false,
        },
        medicalHistory: medicalHistory || [],
        surgicalHistory: surgicalHistory || [],
        socialHistory: socialHistory || {
          smoke: false,
          alcohol: false,
          drugUse: false,
        },
        shoeSize: {
          shoeSize: shoeSize?.size || "",
        },
        hippaPolicy: {
          signature: state.hippaPolicy?.signature || "",
          agreedAt: new Date().toISOString(),
        },
        practicePolicies: {
          signature: state.practicePolicies?.signature || "",
          agreedAt: new Date().toISOString(),
        },
        survey: {
          question: state.survey?.question || "",
          answer: state.survey?.answer || "",
        },
        checkInTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await submitKioskData(patientId, kioskData);

      setLoading(false);

      if (res.status === "error") {
        toast.error(res.message || "Failed to check in");
        
        if (res.details && Array.isArray(res.details)) {
          console.error("Validation errors:", res.details);
        }
      } else if (res.status === "success") {
        removeUserData();
        toast.success("Your appointment was checked in successfully!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during check-in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  let appointmentTimeAndDate = `${getDayName(
    new Date().getDay()
  )}, ${formatAMPM(new Date())}, ${date}`;

  // Format birth date to handle different month formats
  const formatBirthday = (userInfo) => {
    if (!userInfo?.day || !userInfo?.year) {
      return "Not provided";
    }

    let month;
    if (!userInfo?.month) {
      month = "";
    } else if (monthsLong[userInfo.month]) {
      month = monthsLong[userInfo.month];
    } else {
      // Make sure numeric months are formatted with leading zero if needed
      const numMonth = parseInt(userInfo.month, 10);
      month =
        numMonth > 0 && numMonth < 10 ? `0${numMonth}` : `${userInfo.month}`;
    }

    return month
      ? `${userInfo?.day}/${month}/${userInfo?.year}`
      : `${userInfo?.day}/${userInfo?.year}`;
  };

  const renderInfoItem = (label, value) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          display: "block",
          color: "var(--grey)",
          fontWeight: 600,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          mb: 0.4,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ color: "var(--secondary)", fontWeight: 600, fontSize: "14px" }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );

  const renderYesNoBadge = (value) => {
    if (value === "yes") {
      return (
        <Box
          component="span"
          sx={{
            display: "inline-block",
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "5px",
            px: 1.25,
            py: 0.3,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.4px",
          }}
        >
          Yes
        </Box>
      );
    }
    if (value === "no") {
      return (
        <Box
          component="span"
          sx={{
            display: "inline-block",
            bgcolor: "#f5f5f5",
            color: "var(--grey)",
            borderRadius: "5px",
            px: 1.25,
            py: 0.3,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.4px",
          }}
        >
          No
        </Box>
      );
    }
    return (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          bgcolor: "#f5f5f5",
          color: "var(--grey)",
          borderRadius: "5px",
          px: 1.25,
          py: 0.3,
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        Not answered
      </Box>
    );
  };

  return (
    <AnimatedPage>
      <Container maxWidth="xl" sx={{ py: 3, minHeight: "100vh", backgroundColor: "var(--bg)" }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <img src={Logo} alt="Logo" style={{ maxHeight: 42 }} />
        </Box>

        {/* Review instruction banner */}
        <Box
          sx={{
            mb: 3,
            px: 2.5,
            py: 1.5,
            borderRadius: "10px",
            backgroundColor: "var(--checked)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "var(--primary)",
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: "13px",
              color: "var(--secondary)",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            Please review your information carefully. If anything is incorrect, tap{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "var(--primary)" }}>
              Edit
            </Box>{" "}
            next to that section before submitting.
          </Typography>
        </Box>

        {/* Page Section Heading */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--secondary)",
              lineHeight: 1.2,
            }}
          >
            Your Check-In Summary
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "var(--grey)", mt: 0.5 }}>
            Review each section and tap Edit if anything needs updating.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={5}>
            {/* Patient Profile */}
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: "14px",
                border: "1px solid #d3d4e7",
                boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.12)",
                overflow: "hidden",
              }}
            >
              {/* Colored header band */}
              <Box
                sx={{
                  backgroundColor: "var(--primary)",
                  pt: 3.5,
                  pb: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  position: "relative",
                }}
              >
                <Avatar
                  src={demographicsInfo?.patientsPicture}
                  alt={demographicsInfo?.user?.fullName}
                  sx={{
                    width: 80,
                    height: 80,
                    border: "3px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                  }}
                />
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.25,
                      letterSpacing: "0.2px",
                    }}
                  >
                    {demographicsInfo?.user?.fullName || "Patient Name"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.75)",
                      mt: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    Date of Birth: {formatBirthday(userInfo)}
                  </Typography>
                </Box>
              </Box>
              {/* Info strip below the band */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  px: 2.5,
                  py: 1.5,
                  backgroundColor: "#fff",
                  borderTop: "1px solid #d3d4e7",
                }}
              >
                <Typography sx={{ fontSize: "11px", color: "var(--grey)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Check-In:
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "var(--secondary)", fontWeight: 600 }}>
                  {appointmentTimeAndDate}
                </Typography>
              </Box>
            </Paper>

            {/* Personal Information */}
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: "12px",
                border: "1px solid #d3d4e7",
                boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  borderBottom: "1px solid #d3d4e7",
                  backgroundColor: "#f9f9ff",
                  borderRadius: "12px 12px 0 0",
                }}
              >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                      color: "var(--secondary)",
                    }}
                  >
                    Personal Information
                  </Typography>
                <Link
                  to="/kiosk/demographics_Information"
                  state={{ edit: true }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                    <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                  </Box>
                </Link>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {renderInfoItem("Primary Phone", demographicsInfo?.phone)}
                    {renderInfoItem("Email Address", demographicsInfo?.email)}
                    {renderInfoItem("Address", demographicsInfo?.address)}
                    {demographicsInfo?.address2 &&
                      renderInfoItem("Apartment/Suite", demographicsInfo?.address2)}
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        {renderInfoItem("City", demographicsInfo?.city)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {renderInfoItem("State", demographicsInfo?.state)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {renderInfoItem("Zipcode", demographicsInfo?.zipcode)}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Insurance Information */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid #d3d4e7",
                boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  borderBottom: "1px solid #d3d4e7",
                  backgroundColor: "#f9f9ff",
                  borderRadius: "12px 12px 0 0",
                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    color: "var(--secondary)",
                  }}
                >
                  Insurance Information
                </Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                {/* Primary Insurance */}
                {primaryInsurance?.insuranceName ? (
                  <Box sx={{ mb: secondaryInsurance?.insuranceName ? 3 : 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                          color: "var(--primary)",
                        }}
                      >
                        Primary Insurance
                      </Typography>
                      <Link
                        to="/kiosk/insurance_information"
                        state={{ edit: true }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                      </Link>
                    </Box>
                    <Typography variant="body1" fontWeight="600" gutterBottom>
                      {primaryInsurance.insuranceName}
                    </Typography>
                    {renderInfoItem("Member ID", primaryInsurance.memberId)}
                    {renderInfoItem("Group Number", primaryInsurance.groupNumber)}
                    {renderInfoItem("Group Name", primaryInsurance.groupName)}
                    {renderInfoItem("Phone", primaryInsurance.phoneNumber)}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No primary insurance information
                  </Typography>
                )}

                {/* Secondary Insurance */}
                {secondaryInsurance?.insuranceName && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                            color: "var(--primary)",
                          }}
                        >
                          Secondary Insurance
                        </Typography>
                        <Link
                          to="/kiosk/insurance_info_secondary"
                          state={{ edit: true }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                        </Link>
                      </Box>
                      <Typography variant="body1" fontWeight="600" gutterBottom>
                        {secondaryInsurance.insuranceName}
                      </Typography>
                      {renderInfoItem("Member ID", secondaryInsurance.memberId)}
                      {renderInfoItem("Group Number", secondaryInsurance.groupNumber)}
                      {renderInfoItem("Group Name", secondaryInsurance.groupName)}
                      {renderInfoItem("Phone", secondaryInsurance.phoneNumber)}
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              {/* Allergies */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.7px",
                          color: "var(--secondary)",
                        }}
                      >
                        Allergies
                      </Typography>
                    <Link to="/kiosk/allergies_add" state={{ edit: true }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                    </Link>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {allergies && allergies.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {allergies.map((allergy, index) => (
                          <Box
                            key={index}
                            sx={{
                              bgcolor: "var(--checked)",
                              color: "var(--secondary)",
                              borderRadius: "6px",
                              px: 1.25,
                              py: 0.5,
                              fontSize: "12px",
                              fontWeight: 600,
                              lineHeight: 1.5,
                            }}
                          >
                            {allergy}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: "13px", color: "var(--grey)", fontStyle: "italic" }}>
                        None reported
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Medications */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.7px",
                          color: "var(--secondary)",
                        }}
                      >
                        Medications
                      </Typography>
                    <Link to="/kiosk/medications_add" state={{ edit: true }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                    </Link>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {medications && medications.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {medications.map((medication, index) => (
                          <Box
                            key={index}
                            sx={{
                              bgcolor: "var(--checked)",
                              color: "var(--secondary)",
                              borderRadius: "6px",
                              px: 1.25,
                              py: 0.5,
                              fontSize: "12px",
                              fontWeight: 600,
                              lineHeight: 1.5,
                            }}
                          >
                            {medication}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: "13px", color: "var(--grey)", fontStyle: "italic" }}>
                        None reported
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Family History */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.7px",
                          color: "var(--secondary)",
                        }}
                      >
                        Family History
                      </Typography>
                    <Link to="/kiosk/family_history" state={{ edit: true }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                    </Link>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: "13px", color: "var(--secondary)", fontWeight: 500 }}>
                        Diabetes (parental)
                      </Typography>
                      {renderYesNoBadge(familyHistory?.diabetes)}
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Medical History */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.7px",
                          color: "var(--secondary)",
                        }}
                      >
                        Medical History
                      </Typography>
                    <Link to="/kiosk/medical_add" state={{ edit: true }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                    </Link>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {medicalHistory && medicalHistory.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {medicalHistory.map((condition, index) => (
                          <Box
                            key={index}
                            sx={{
                              bgcolor: "var(--checked)",
                              color: "var(--secondary)",
                              borderRadius: "6px",
                              px: 1.25,
                              py: 0.5,
                              fontSize: "12px",
                              fontWeight: 600,
                              lineHeight: 1.5,
                            }}
                          >
                            {condition}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: "13px", color: "var(--grey)", fontStyle: "italic" }}>
                        None reported
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Social History */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.7px",
                          color: "var(--secondary)",
                        }}
                      >
                        Social History
                      </Typography>
                    <Link to="/kiosk/social_history" state={{ edit: true }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                    </Link>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: "13px", color: "var(--secondary)", fontWeight: 500 }}>
                        Smoking / Tobacco
                      </Typography>
                      {socialHistory?.smoke === "smoker" ? (
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            bgcolor: "#fff3e0",
                            color: "#e65100",
                            borderRadius: "5px",
                            px: 1.25,
                            py: 0.3,
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.4px",
                          }}
                        >
                          Smoker
                        </Box>
                      ) : socialHistory?.smoke === "non-smoker" ? (
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                            borderRadius: "5px",
                            px: 1.25,
                            py: 0.3,
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.4px",
                          }}
                        >
                          Non-Smoker
                        </Box>
                      ) : (
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            bgcolor: "#f5f5f5",
                            color: "var(--grey)",
                            borderRadius: "5px",
                            px: 1.25,
                            py: 0.3,
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Not answered
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Surgical History */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.7px",
                          color: "var(--secondary)",
                        }}
                      >
                        Surgical History
                      </Typography>
                    <Link to="/kiosk/surgical_add" state={{ edit: true }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                    </Link>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    {surgicalHistory && surgicalHistory.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {surgicalHistory.map((surgery, index) => (
                          <Box
                            key={index}
                            sx={{
                              bgcolor: "var(--checked)",
                              color: "var(--secondary)",
                              borderRadius: "6px",
                              px: 1.25,
                              py: 0.5,
                              fontSize: "12px",
                              fontWeight: 600,
                              lineHeight: 1.5,
                            }}
                          >
                            {surgery}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: "13px", color: "var(--grey)", fontStyle: "italic" }}>
                        None reported
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Shoe Size */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.7px",
                          color: "var(--secondary)",
                        }}
                      >
                        Shoe Size
                      </Typography>
                    <Link to="/kiosk/shoe_size" state={{ edit: true }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                      <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                    </Box>
                    </Link>
                  </Box>
                  <Box sx={{ p: 2, display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography
                      sx={{ fontSize: "36px", fontWeight: 700, color: "var(--secondary)", lineHeight: 1 }}
                    >
                      {shoeSize?.shoeSize || "\u2014"}
                    </Typography>
                    {shoeSize?.shoeSize && (
                      <Typography sx={{ fontSize: "12px", color: "var(--grey)", fontWeight: 600 }}>
                        US
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Appointment Info */}
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #d3d4e7",
                    boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      borderBottom: "1px solid #d3d4e7",
                      backgroundColor: "#f9f9ff",
                      borderRadius: "12px 12px 0 0",
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.7px",
                        color: "var(--secondary)",
                      }}
                    >
                      Last Visit
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "var(--secondary)" }}>
                      {appointmentTimeAndDate || "\u2014"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Documents Section */}
        <Box sx={{ mt: 4 }}>
          {/* Section label */}
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--secondary)",
              mb: 2,
            }}
          >
            Documents &amp; Scans
          </Typography>
          <Grid container spacing={2.5}>
            {/* Identity Documents */}
            <Grid item xs={12} sm={6} lg={4}>
            <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px solid #d3d4e7",
              boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2.5,
                py: 1.5,
                borderBottom: "1px solid #d3d4e7",
                backgroundColor: "#f9f9ff",
              }}
            >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    color: "var(--secondary)",
                  }}
                >
                  Identity Documents
                </Typography>
              <Link to="/kiosk/demographics_documents" state={{ edit: true }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                  <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                </Box>
              </Link>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2} alignItems="flex-start">
                {/* Patient Photo */}
                <Grid item xs={5}>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: "var(--grey)",
                      mb: 1,
                    }}
                  >
                    Photo
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "3 / 4",
                      bgcolor: demographicsInfo?.patientsPicture ? "transparent" : "#f0f0f8",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #d3d4e7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {demographicsInfo?.patientsPicture ? (
                      <img
                        src={demographicsInfo.patientsPicture}
                        alt="Patient"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "11px", color: "var(--grey)", textAlign: "center", p: 1 }}>
                        Not uploaded
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Driver's License */}
                <Grid item xs={7}>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: "var(--grey)",
                      mb: 1,
                    }}
                  >
                    ID / License
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "85.6 / 54",
                      bgcolor: demographicsInfo?.driversLicense ? "transparent" : "#f0f0f8",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #d3d4e7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {demographicsInfo?.driversLicense ? (
                      <img
                        src={demographicsInfo.driversLicense}
                        alt="License"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "11px", color: "var(--grey)", textAlign: "center", p: 1 }}>
                        Not uploaded
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          </Grid>

            {/* Primary Insurance Card */}
            <Grid item xs={12} sm={6} lg={4}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px solid #d3d4e7",
              boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2.5,
                py: 1.5,
                borderBottom: "1px solid #d3d4e7",
                backgroundColor: "#f9f9ff",
              }}
            >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.7px",
                    color: "var(--secondary)",
                  }}
                >
                  Primary Insurance Card
                </Typography>
              <Link to="/kiosk/insurance_documents" state={{ edit: true }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                  <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                </Box>
              </Link>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: "var(--grey)",
                      mb: 1,
                    }}
                  >
                    Front
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "85.6 / 54",
                      bgcolor: primaryInsurance?.insuranceCardFront ? "transparent" : "#f0f0f8",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #d3d4e7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {primaryInsurance?.insuranceCardFront ? (
                      <img
                        src={primaryInsurance.insuranceCardFront}
                        alt="Insurance Front"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "11px", color: "var(--grey)", textAlign: "center", p: 1 }}>
                        Not uploaded
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: "var(--grey)",
                      mb: 1,
                    }}
                  >
                    Back
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "85.6 / 54",
                      bgcolor: primaryInsurance?.insuranceCardBack ? "transparent" : "#f0f0f8",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #d3d4e7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {primaryInsurance?.insuranceCardBack ? (
                      <img
                        src={primaryInsurance.insuranceCardBack}
                        alt="Insurance Back"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "11px", color: "var(--grey)", textAlign: "center", p: 1 }}>
                        Not uploaded
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          </Grid>

            {/* Secondary Insurance Card */}
            {secondaryInsurance?.insuranceName && (
              <Grid item xs={12} sm={6} lg={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid #d3d4e7",
                boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  borderBottom: "1px solid #d3d4e7",
                  backgroundColor: "#f9f9ff",
                }}
              >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                      color: "var(--secondary)",
                    }}
                  >
                    Secondary Insurance Card
                  </Typography>
                <Link to="/kiosk/insurance_documents_secondary" state={{ edit: true }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "6px", bgcolor: "var(--checked)" }}>
                  <img src={EditIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                </Box>
                </Link>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        color: "var(--grey)",
                        mb: 1,
                      }}
                    >
                      Front
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "85.6 / 54",
                        bgcolor: secondaryInsurance?.insuranceCardFront ? "transparent" : "#f0f0f8",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #d3d4e7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {secondaryInsurance?.insuranceCardFront ? (
                        <img
                          src={secondaryInsurance.insuranceCardFront}
                          alt="Secondary Insurance Front"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: "11px", color: "var(--grey)", textAlign: "center", p: 1 }}>
                          Not uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        color: "var(--grey)",
                        mb: 1,
                      }}
                    >
                      Back
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "85.6 / 54",
                        bgcolor: secondaryInsurance?.insuranceCardBack ? "transparent" : "#f0f0f8",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #d3d4e7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {secondaryInsurance?.insuranceCardBack ? (
                        <img
                          src={secondaryInsurance.insuranceCardBack}
                          alt="Secondary Insurance Back"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: "11px", color: "var(--grey)", textAlign: "center", p: 1 }}>
                          Not uploaded
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            </Grid>
            )}
          </Grid>
        </Box>

        {/* Bottom Submit CTA */}
        <Paper
          elevation={0}
          sx={{
            mt: 5,
            mb: 3,
            borderRadius: "16px",
            border: "1px solid #d3d4e7",
            overflow: "hidden",
            boxShadow: "0px 4px 40px rgba(108, 109, 138, 0.1)",
          }}
        >
          {/* Top confirmation message strip */}
          <Box
            sx={{
              px: 3,
              py: 2,
              backgroundColor: "#f9f9ff",
              borderBottom: "1px solid #d3d4e7",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "var(--primary)",
                flexShrink: 0,
                mt: "5px",
              }}
            />
            <Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "var(--secondary)", mb: 0.3 }}>
                Ready to check in?
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "var(--grey)", lineHeight: 1.5 }}>
                By tapping <Box component="span" sx={{ fontWeight: 700, color: "var(--secondary)" }}>Confirm &amp; Submit</Box> you confirm all the information above is accurate. If anything needs updating, scroll up and tap the{" "}
                <Box component="span" sx={{ fontWeight: 700, color: "var(--secondary)" }}>edit</Box> button on that section.
              </Typography>
            </Box>
          </Box>

          {/* Button row */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              disabled={loading}
              onClick={() => postData()}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "0.3px",
                borderRadius: "12px",
                height: 54,
                minWidth: 280,
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(106,110,244,0.35)",
                "&:hover": { backgroundColor: "#5558e0", boxShadow: "0 8px 24px rgba(106,110,244,0.45)" },
                "&:disabled": {
                  backgroundColor: "rgba(0,0,0,0.12) !important",
                  color: "rgba(0,0,0,0.38) !important",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? "Processing..." : "Confirm & Submit Check-In"}
            </Button>
          </Box>
        </Paper>


      </Container>
    </AnimatedPage>
  );
};

export default Preview;
