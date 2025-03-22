import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
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
import UploadCard from "../components/cards/UploadCard";
import PreviewCard from "../components/previewCard/PreviewCard";
import * as actionCreators from "../state/actionCreators/index";
import store from "../state/store";
import styles from "../styles/Preview.module.css";
import { date, formatAMPM, getDayName } from "../utils/formatAMPM";
import useReviewImages from "./useReviewImages";

import { addPatient } from "../apis/api";
import { PatientContext } from "../App";
import AnimatedPage from "../components/Animation/Pages";

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

  return (
    <AnimatedPage>
      <Container maxWidth="xl">
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            padding: "2rem 0",
            marginBottom: "2rem",
          }}
        >
          <img src={Logo} alt="Logo" />
          <Button
            disabled={loading}
            onClick={() => postData()}
            className="primaryButton"
            variant="contained"
            size="medium"
            sx={{
              "&:disabled": {
                backgroundColor: "gray !important",
                color: "white !important",
                cursor: "not-allowed",
              },
            }}
          >
            {loading ? "Approving..." : "Approve"}
          </Button>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                boxShadow: "rgb(4 20 43 / 10%) 0px 5px 20px",
                padding: "1rem 0.5rem",
              }}
            >
              <Box
                sx={{
                  height: "80px",
                  width: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={demographicsInfo?.patientsPicture}
                  alt="Patient"
                />
              </Box>
              <h2
                className="header2"
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "1.5rem",
                }}
              >
                {demographicsInfo?.user?.fullName}
              </h2>
            </Box>

            <Box
              id={styles.item_8}
              style={{
                marginTop: "1rem",
                boxShadow: "rgb(4 20 43 / 5%) 0px 5px 20px",
              }}
            >
              <div className={styles.item_8_header}>
                <img src={CalendarIcon} alt="Calendar" />
                <h6 className="header6">Last doctor's visits</h6>
              </div>
              <div className={styles.item_8_body}>
                <strong>{appointmentTimeAndDate}</strong>
              </div>
            </Box>

            <Box
              sx={{
                marginTop: "1rem",
                boxShadow: "rgb(4 20 43 / 10%) 0px 5px 20px",
              }}
            >
              <div className={styles.insuranceHeader}>
                <img src={InsuranceIcon} alt="Insurance" />
                <h6 className="header6">Insurance</h6>
              </div>
              <div className={styles.insuranceCardBody}>
                <div className={styles.insuranceCardLeft}>
                  <br />
                  <small>Active Date</small>
                  <strong>Sep 30, 2014</strong>
                  <small>Copay for Specialist</small>
                  <strong>$40.00</strong>
                </div>
                <div className={styles.insuranceCardRight}>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <small>Primary Insurance </small>

                    <Link
                      to={{
                        pathname: `/kiosk/insurance_information`,
                      }}
                      state={{ edit: true }}
                      style={{
                        marginLeft: "60px",
                      }}
                    >
                      <img
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                        src={EditIcon}
                        alt="Edit"
                      />
                    </Link>
                  </div>

                  <strong>{primaryInsurance?.insuranceName}</strong>
                  <small>Member ID</small>
                  <strong>{primaryInsurance?.memberId}</strong>
                  <small>Group Number</small>
                  <strong>{primaryInsurance?.groupNumber}</strong>
                  <small>Copay</small>
                  <strong>$110.00</strong>
                  <small>Group Name</small>
                  <strong>{primaryInsurance?.groupName}</strong>
                  <small>Phone Number</small>
                  <strong>{primaryInsurance?.phoneNumber}</strong>

                  {secondaryInsurance?.insuranceName && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        borderTop: "1px solid lightgrey",
                        width: "100%",
                      }}
                    >
                      <br />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <small>Secondary Insurance </small>

                        <Link
                          to={{
                            pathname: `/kiosk/insurance_info_secondary`,
                          }}
                          state={{ edit: true }}
                          style={{
                            marginLeft: "auto",
                          }}
                        >
                          <img
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                            src={EditIcon}
                            alt="Edit"
                          />
                        </Link>
                      </div>
                      <strong>{secondaryInsurance?.insuranceName}</strong>
                      <small>Member ID</small>
                      <strong>{secondaryInsurance?.memberId}</strong>
                      <small>Group Number</small>
                      <strong>{secondaryInsurance?.groupNumber}</strong>
                      <small>Copay</small>
                      <strong>$110.00</strong>
                      <small>Group Name</small>
                      <strong>{secondaryInsurance?.groupName}</strong>
                      <small>Phone Number</small>
                      <strong>{secondaryInsurance?.phoneNumber}</strong>
                    </div>
                  )}
                </div>
              </div>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <div
              id={styles.item_9}
              style={{
                boxShadow: "rgb(4 20 43 / 5%) 0px 5px 20px",
              }}
            >
              <div className={styles.item_9_content}>
                <small>Date of birth</small>
                <strong>
                  {userInfo?.day}/{monthsLong[userInfo?.month]}/{userInfo?.year}
                </strong>
                <small>Primary Phone</small>
                <strong>{demographicsInfo?.phone}</strong>
                <small>Email Address</small>
                <strong
                  style={{
                    textTransform: "lowercase",
                  }}
                >
                  {demographicsInfo?.email}
                </strong>
                <small>Address</small>
                <strong>{demographicsInfo?.address}</strong>
                <small>Apartment, suite, etc (optional)</small>
                <strong>{demographicsInfo?.address2}</strong>
                <small>Zipcode</small>
                <strong>{demographicsInfo?.zipcode}</strong>
              </div>
              <div className={styles.item_9_content}>
                <Link
                  to={{
                    pathname: `/kiosk/demographics_Information`,
                  }}
                  state={{ edit: true }}
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  <img src={EditIcon} alt="Edit" />
                </Link>

                <small>State</small>
                <strong>{demographicsInfo?.state}</strong>
                <small>City</small>
                <strong>{demographicsInfo?.city}</strong>
              </div>
            </div>

            <Box className={styles.patients_info}>
              <PreviewCard
                url="/kiosk/allergies_add"
                icon={InsuranceIcon}
                title="Allergies"
                text="Active allergies:"
                info={allergies}
              />
              <PreviewCard
                url="/kiosk/medications_add"
                icon={MedicationsIcon}
                title="Medications"
                text=""
                info={medications}
              />
              <PreviewCard
                url="/kiosk/family_history"
                icon={FamilyIcon}
                title="Family History"
                text="Does (Did) your mother or father have diabetes?"
                info={[familyHistory?.diabetes?.toUpperCase()]}
              />

              <PreviewCard
                url="/kiosk/medical_add"
                icon={MedicalIcon}
                title="Medical History"
                text="Past medical history:"
                info={medicalHistory}
              />

              {/* Surgical History */}
              <PreviewCard
                url="/kiosk/surgical_add"
                icon={SurgicalIcon}
                title="Surgical History"
                text=""
                info={surgicalHistory}
              />

              {/* Social History */}
              <PreviewCard
                url="/kiosk/social_history"
                icon={SocialIcon}
                title="Social History"
                text={socialHistory?.smoke?.toUpperCase()}
                info={[]}
              />

              {/* Shoe Size */}
              <PreviewCard
                url="/kiosk/shoe_size"
                icon={ShoeIcon}
                title="Shoe Size"
                text="Choose your shoe size"
                info={[shoeSize?.shoeSize]}
              />
            </Box>
          </Grid>
        </Grid>

        <Box
          className={styles.patients_info}
          sx={{
            margin: "1.5rem 0 3rem 0",
          }}
        >
          <UploadCard
            id="insuranceCardFront"
            title="PRI INSURANCE CARD"
            subTitle="Front"
            img={primaryInsurance?.insuranceCardFront}
            alt="Insurance Card"
            btnText="Review"
            addFile={addFile}
          />

          <UploadCard
            id="insuranceCardBack"
            title="PRI INSURANCE CARD"
            subTitle="Back"
            img={primaryInsurance?.insuranceCardBack}
            alt="Insurance Card"
            btnText="Review"
            addFile={addFile}
          />

          {secondaryInsurance?.insuranceName && (
            <UploadCard
              id="secInsuranceFront"
              title="SEC INSURANCE CARD"
              subTitle="Front"
              img={secondaryInsurance?.insuranceCardFront}
              alt="Insurance Card"
              btnText="Review"
              addFile={addFile}
            />
          )}

          {secondaryInsurance?.insuranceName && (
            <UploadCard
              id="secInsuranceBack"
              title=" SEC INSURANCE CARD"
              subTitle="Back"
              img={secondaryInsurance?.insuranceCardBack}
              alt="Insurance Card"
              btnText="Review"
              addFile={addFile}
            />
          )}
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default Preview;
