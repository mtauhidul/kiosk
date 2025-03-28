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
import { addPatient } from "../apis/api";
import { PatientContext } from "../App";
import * as actionCreators from "../state/actionCreators/index";
import store from "../state/store";
import { date, formatAMPM, getDayName } from "../utils/formatAMPM";
import useReviewImages from "./useReviewImages";

const Preview = () => {
  const state = store?.getState()?.data;
  const [patient, setPatient] = useContext(PatientContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { removeUserData } = bindActionCreators(actionCreators, dispatch);
  const { addFile } = useReviewImages();

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

      // Format data to match the API structure from paste-2.txt
      const formattedData = {
        userInfo: userInfo,
        demographicsInfo: demographicsInfo,
        primaryInsurance: primaryInsurance,
        secondaryInsurance: secondaryInsurance,
        medicalInfo: {
          allergies: allergies,
          medications: medications,
          medicalHistory: medicalHistory,
          surgicalHistory: surgicalHistory,
          familyHistory: familyHistory,
          socialHistory: socialHistory,
          shoeSize: shoeSize,
        },
        uploadedPictures: [
          demographicsInfo?.patientsPicture,
          primaryInsurance?.insuranceCardFront,
          primaryInsurance?.insuranceCardBack,
          secondaryInsurance?.insuranceCardFront,
          secondaryInsurance?.insuranceCardBack,
        ].filter(Boolean),
      };

      // Call the API with the formatted data
      const res = await addPatient(formattedData, patient.id);

      setLoading(false);

      if (res.status === "error") {
        toast.error(res.message || "Failed to check in");

        // If there's a specific error about already being checked in
        if (res.message?.includes("already checked in")) {
          removeUserData();
          setTimeout(() => {
            navigate("/");
          }, 4000);
        }
      } else if (res.status === "success") {
        removeUserData();
        toast.success("Your appointment was checked in successfully");

        setTimeout(() => {
          navigate("/");
        }, 3100);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "An unexpected error occurred");
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
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {/* Header with Logo and Approve Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: { xs: 2, md: 3 },
            mb: { xs: 2, md: 3 },
          }}
        >
          <img src={Logo} alt="Logo" style={{ maxHeight: 45 }} />
          <Button
            disabled={loading}
            onClick={() => postData()}
            className="primaryButton"
            variant="contained"
            size="medium"
            sx={{
              fontWeight: 600,
              minWidth: 120,
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
              elevation={1}
              sx={{ mb: 3, overflow: "hidden", borderRadius: 2 }}
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
              elevation={1}
              sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
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
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
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
            <Paper elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
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
                  url="/kiosk/surgical_add"
                  icon={SurgicalIcon}
                  title="Surgical History"
                  text=""
                  info={surgicalHistory}
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
