import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";

// Icons
import CalendarIcon from "../assets/icons/calender.svg";
import FamilyIcon from "../assets/icons/family.svg";
import EditIcon from "../assets/icons/icons8-edit.svg";
import InsuranceIcon from "../assets/icons/insurance.svg";
import MedicalIcon from "../assets/icons/medical.svg";
import MedicationsIcon from "../assets/icons/medications.svg";
import ShoeIcon from "../assets/icons/shoe.svg";
import SocialIcon from "../assets/icons/social.svg";
import SurgicalIcon from "../assets/icons/surgical.svg";
import Logo from "../assets/images/logo.svg";

// Components
import AnimatedPage from "../components/Animation/Pages";
import ScanCard from "../components/cards/ScanCard";
import PreviewCard from "../components/previewCard/PreviewCard";

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
        const encounterId = sessionStorage.getItem("encounterId");
        toast.success("Your appointment was checked in successfully!");

        setTimeout(() => {
          // Navigate to collect ticket page with encounter ID
          navigate("/collect-ticket", { state: { encounterId } });
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
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block" }}
      >
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {value || "—"}
      </Typography>
    </Box>
  );

  const renderInsuranceCard = (insurance, title, editPath) => {
    if (
      !insurance ||
      (!title.includes("Secondary") && !insurance.insuranceName)
    )
      return null;

    return (
      <Box
        sx={{
          mt: title.includes("Secondary") ? 2 : 0,
          pt: title.includes("Secondary") ? 2 : 0,
          borderTop: title.includes("Secondary")
            ? "1px solid rgba(0, 0, 0, 0.12)"
            : "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Link to={editPath} state={{ edit: true }}>
            <img src={EditIcon} alt="Edit" style={{ width: 18, height: 18 }} />
          </Link>
        </Box>

        {insurance.insuranceName && (
          <>
            <Typography variant="body1" fontWeight="500" gutterBottom>
              {insurance.insuranceName}
            </Typography>
            {renderInfoItem("Member ID", insurance.memberId)}
            {renderInfoItem("Group Number", insurance.groupNumber)}
            {renderInfoItem("Group Name", insurance.groupName)}
            {renderInfoItem("Phone Number", insurance.phoneNumber)}
            {renderInfoItem("Copay", "$110.00")}
          </>
        )}
      </Box>
    );
  };

  return (
    <AnimatedPage>
      <Container maxWidth="xl" sx={{ pb: 6, bgcolor: "#f3f3fc", minHeight: "100vh" }}>
        {/* Header with Logo and Approve Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: { xs: 2, md: 3 },
            mb: { xs: 2, md: 3 },
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <img src={Logo} alt="Logo" style={{ maxHeight: 45, flexShrink: 0 }} />
          <Button
            disabled={loading}
            onClick={() => postData()}
            className="primaryButton"
            variant="contained"
            size="medium"
            sx={{
              fontWeight: 600,
              minWidth: { xs: 100, sm: 120 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              "&:disabled": {
                backgroundColor: "rgba(0, 0, 0, 0.38) !important",
                color: "white !important",
              },
            }}
          >
            {loading ? "Approving..." : "Approve"}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={5}>
            {/* Patient Profile Card */}
            <Paper
              elevation={0}
              sx={{ mb: 3, overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
                <Avatar
                  src={demographicsInfo?.patientsPicture}
                  alt={demographicsInfo?.user?.fullName}
                  sx={{ width: 80, height: 80 }}
                />
                <Typography
                  variant="h5"
                  fontWeight="500"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {demographicsInfo?.user?.fullName}
                </Typography>
              </Box>
            </Paper>

            {/* Appointment Card */}
            <Paper
              elevation={0}
              sx={{ mb: 3, borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                }}
              >
                <img
                  src={CalendarIcon}
                  alt="Calendar"
                  style={{ width: 20, height: 20 }}
                />
                <Typography variant="subtitle1" fontWeight="500">
                  Last doctor's visit
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" fontWeight="600">
                  {appointmentTimeAndDate}
                </Typography>
              </Box>
            </Paper>

            {/* Insurance Card */}
            <Paper elevation={0} sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0, 0, 0, 0.12)" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                }}
              >
                <img
                  src={InsuranceIcon}
                  alt="Insurance"
                  style={{ width: 20, height: 20 }}
                />
                <Typography variant="subtitle1" fontWeight="500">
                  Insurance
                </Typography>
              </Box>

              <Box sx={{ display: "flex", p: 2 }}>
                <Box sx={{ width: "30%", pr: 2 }}>
                  {renderInfoItem("Active Date", "Sep 30, 2014")}
                  {renderInfoItem("Copay for Specialist", "$40.00")}
                </Box>

                <Box
                  sx={{
                    width: "70%",
                    pl: 1,
                    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                >
                  {renderInsuranceCard(
                    primaryInsurance,
                    "Primary Insurance",
                    "/kiosk/insurance_information"
                  )}

                  {renderInsuranceCard(
                    secondaryInsurance,
                    "Secondary Insurance",
                    "/kiosk/insurance_info_secondary"
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={7}>
            {/* Personal Information */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: "12px", border: "1px solid rgba(0, 0, 0, 0.12)" }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" fontWeight="500">
                  Personal Information
                </Typography>
                <Link
                  to="/kiosk/demographics_Information"
                  state={{ edit: true }}
                >
                  <img
                    src={EditIcon}
                    alt="Edit"
                    style={{ width: 20, height: 20 }}
                  />
                </Link>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Date of birth", formatBirthday(userInfo))}
                  {renderInfoItem("Primary Phone", demographicsInfo?.phone)}
                  {renderInfoItem(
                    "Email Address",
                    demographicsInfo?.email?.toLowerCase()
                  )}
                  {renderInfoItem("Address", demographicsInfo?.address)}
                  {renderInfoItem(
                    "Apartment, suite, etc (optional)",
                    demographicsInfo?.address2
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Zipcode", demographicsInfo?.zipcode)}
                  {renderInfoItem("State", demographicsInfo?.state)}
                  {renderInfoItem("City", demographicsInfo?.city)}
                </Grid>
              </Grid>
            </Paper>

            {/* Medical Information Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <PreviewCard
                  url="/kiosk/allergies_add"
                  icon={InsuranceIcon}
                  title="Allergies"
                  text="Active allergies:"
                  info={allergies}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PreviewCard
                  url="/kiosk/medications_add"
                  icon={MedicationsIcon}
                  title="Medications"
                  text=""
                  info={medications}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PreviewCard
                  url="/kiosk/family_history"
                  icon={FamilyIcon}
                  title="Family History"
                  text="Does (Did) your mother or father have diabetes?"
                  info={[familyHistory?.diabetes?.toUpperCase()]}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PreviewCard
                  url="/kiosk/medical_add"
                  icon={MedicalIcon}
                  title="Medical History"
                  text="Past medical history:"
                  info={medicalHistory}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PreviewCard
                  url="/kiosk/social_history"
                  icon={SocialIcon}
                  title="Social History"
                  text={socialHistory?.smoke?.toUpperCase()}
                  info={[]}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PreviewCard
                  url="/kiosk/surgical_add"
                  icon={SurgicalIcon}
                  title="Surgical History"
                  text=""
                  info={surgicalHistory}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PreviewCard
                  url="/kiosk/shoe_size"
                  icon={ShoeIcon}
                  title="Shoe Size"
                  text="Choose your shoe size"
                  info={[shoeSize?.shoeSize]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Document Scans Section */}
        <Typography variant="h6" fontWeight="500" sx={{ mt: 4, mb: 2 }}>
          Uploaded Documents
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <ScanCard
              id="insuranceCardFront"
              title="PRI INSURANCE CARD"
              subTitle="Front"
              img={primaryInsurance?.insuranceCardFront}
              alt="Insurance Card"
              btnText="Review"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ScanCard
              id="insuranceCardBack"
              title="PRI INSURANCE CARD"
              subTitle="Back"
              img={primaryInsurance?.insuranceCardBack}
              alt="Insurance Card"
              btnText="Review"
            />
          </Grid>

          {secondaryInsurance?.insuranceName && (
            <Grid item xs={12} sm={6} md={3}>
              <ScanCard
                id="secInsuranceFront"
                title="SEC INSURANCE CARD"
                subTitle="Front"
                img={secondaryInsurance?.insuranceCardFront}
                alt="Insurance Card"
                btnText="Review"
              />
            </Grid>
          )}

          {secondaryInsurance?.insuranceName && (
            <Grid item xs={12} sm={6} md={3}>
              <ScanCard
                id="secInsuranceBack"
                title="SEC INSURANCE CARD"
                subTitle="Back"
                img={secondaryInsurance?.insuranceCardBack}
                alt="Insurance Card"
                btnText="Review"
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default Preview;
