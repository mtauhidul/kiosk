import { Box, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    // Handle name formatting - safely check if fullName exists
    if (userInfo?.fullName) {
      const nameParts = userInfo.fullName.split(",").map((part) => part.trim());
      const formattedName =
        nameParts.length > 1 ? `${nameParts[1]} ${nameParts[0]}` : nameParts[0];
      setName(formattedName);
      const [firstName] = formattedName.split(" ");
      setName(firstName);
    }

    // Set appointment time
    setAppointmentTime(
      appointmentInfo?.appointmentStartTime || formatAMPM(new Date())
    );

    // Set up Google Maps URL with API key from environment
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Default location coordinates for "Your Total Foot Care Specialist"
    const locationName =
      appointmentInfo?.facility || "Your Total Foot Care Specialist";
    const lat = 29.77163952890273;
    const lng = -95.77496240244778;

    // Create map URL with markers
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${lat},${lng}&zoom=22`;
    setMapUrl(mapUrl);
  }, [userInfo, appointmentInfo]);

  const greeting = `Hello ${name || ""}`;
  const appointmentTimeAndDate = `${getDayName(
    new Date().getDay()
  )}, ${appointmentTime}, ${date}`;

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
                  {appointmentInfo?.facility ||
                    "Your Total Foot Care Specialist"}
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
                borderRadius: "4px",
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
