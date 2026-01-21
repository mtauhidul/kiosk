import { Box, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CalendarIcon from "../../assets/icons/calender.svg";
import LocationIcon from "../../assets/icons/location.svg";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import styles from "../../styles/Appointment.module.css";
import { date, formatAMPM, getDayName } from "../../utils/formatAMPM";

const Appointment = () => {
  // Use Redux selector to get user information directly from store
  const userInfo = useSelector((state) => state.data.userInfo);
  const appointmentInfo = useSelector((state) => state.data.appointmentInfo);

  const [name, setName] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilityAddress, setFacilityAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  // Facility locations with accurate coordinates and addresses
  const facilityLocations = {
    "KATY": {
      address: "23230 Red River Drive, Katy, TX 77494",
      lat: 29.77247574215169,
      lng: -95.775051
    },
    "CYPRESS": {
      address: "27700 NW Freeway #310, Cypress, TX 77433",
      lat: 29.987088686955236,
      lng: -95.73331583870174
    },
    // Fallback for old format
    "Your Total Foot Care Specialist, Katy": {
      address: "23230 Red River Drive, Katy, TX 77494",
      lat: 29.77247574215169,
      lng: -95.775051
    },
    "Your Total Foot Care Specialist, Cypress": {
      address: "27700 NW Freeway #310, Cypress, TX 77433",
      lat: 29.987088686955236,
      lng: -95.73331583870174
    },
    // Default fallback
    "Your Total Foot Care Specialist": {
      address: "23230 Red River Drive, Katy, TX 77494",
      lat: 29.77247574215169,
      lng: -95.775051
    }
  };

  useEffect(() => {
    // Load patient data from sessionStorage
    const storedPatient = sessionStorage.getItem("patient");
    let patientData = null;
    
    if (storedPatient) {
      try {
        const patientWrapper = JSON.parse(storedPatient);
        patientData = patientWrapper.data;
      } catch (e) {
        console.error("Error parsing patient data:", e);
      }
    }

    // Handle name formatting
    if (userInfo?.fullName) {
      const nameParts = userInfo.fullName.split(",").map((part) => part.trim());
      const formattedName =
        nameParts.length > 1 ? `${nameParts[1]} ${nameParts[0]}` : nameParts[0];
      const [firstName] = formattedName.split(" ");
      setName(firstName);
    }

    // Set appointment time from Firestore data
    if (patientData?.appointmentStartTime) {
      setAppointmentTime(patientData.appointmentStartTime);
    } else {
      setAppointmentTime(formatAMPM(new Date()));
    }

    // Set appointment date from Firestore data
    if (patientData?.appointmentDate) {
      setAppointmentDate(patientData.appointmentDate);
    } else {
      setAppointmentDate(date);
    }

    // Get facility name from userInfo location (selected in General page)
    const selectedFacility = userInfo?.location || patientData?.facilityName || "KATY";
    setFacilityName(selectedFacility);

    // Get coordinates and address for selected facility
    const location = facilityLocations[selectedFacility] || facilityLocations["KATY"];
    setFacilityAddress(location.address);

    // Set up Google Maps URL with API key from environment
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Create map URL with accurate coordinates
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${location.lat},${location.lng}&zoom=15`;
    setMapUrl(mapUrl);
  }, [userInfo, appointmentInfo]);

  const greeting = `Hello ${name || ""}`;
  
  // Format appointment display with actual data from Firestore
  const appointmentTimeAndDate = appointmentDate 
    ? `${appointmentTime}, ${appointmentDate}`
    : `${getDayName(new Date().getDay())}, ${appointmentTime}, ${date}`;

  return (
    <AnimatedPage>
      <div className={styles.appointmentContainer}>
        <div>
          <Card
            sx={{
              maxWidth: 800,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              borderRadius: "12px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", md: "50%" },
              }}
            >
              <CardContent sx={{ flex: "1 0 auto" }}>
                <h3 className="header3">{greeting}</h3>
                <br />
                <h6 className="header6">Your appointment </h6>
                <div className={styles.dateWrapper}>
                  <img src={CalendarIcon} alt="Calendar Icon" />
                  <h6 className="header4">{appointmentTimeAndDate}</h6>
                </div>
                <h6
                  className="header4"
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    gap: "5px",
                  }}
                >
                  <img
                    src={LocationIcon}
                    alt="Location Icon"
                    style={{
                      marginRight: "5px",
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                  />
                  {facilityAddress}
                </h6>
              </CardContent>
            </Box>

            {/* Google Maps iframe replacing the static background image */}
            <Box
              component="iframe"
              sx={{
                width: { xs: "100%", md: "50%" },
                height: 300,
                border: 0,
                borderRadius: "12px",
                padding: "10px",
              }}
              src={mapUrl}
              title="Your Total Foot Care Specialist Location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Card>
        </div>
        <Bottom />
      </div>
    </AnimatedPage>
  );
};

export default Appointment;
