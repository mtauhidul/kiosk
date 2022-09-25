import { Box, Card, CardContent, CardMedia } from "@mui/material";
import React, { useEffect, useState } from "react";
import CalendarIcon from "../../assets/icons/calender.svg";
import AppointmentBg from "../../assets/images/appointmentBg.jpg";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import store from "../../state/store";
import styles from "../../styles/Appointment.module.css";
import { date, formatAMPM, getDayName } from "../../utils/formatAMPM";

const Appointment = () => {
  const [name, setName] = useState("");
  useEffect(() => {
    const state = store?.getState()?.data?.userInfo?.fullName;
    setName(state);
  }, []);

  let greeting = `Hello ${name}`;
  let appointmentTimeAndDate = `${getDayName(
    new Date().getDay()
  )}, ${formatAMPM(new Date())}, ${date}`;

  return (
    <AnimatedPage>
      <div className={styles.appointmentContainer}>
        <div>
          <Card
            sx={{
              maxWidth: 800,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <h3 className="header3">{greeting}</h3>
                <br />
                <h6 className="header6">Your appointment </h6>
                <div className={styles.dateWrapper}>
                  <img src={CalendarIcon} alt="Calender Icon" />
                  {/* <h4 className="header4">{dayName}, 8:45, 03 Nov 2021</h4> */}
                  <h6 className="header4">{appointmentTimeAndDate}</h6>
                </div>
              </CardContent>
            </Box>
            <CardMedia
              component="img"
              sx={{ width: 400, padding: "16px" }}
              image={AppointmentBg}
              alt="Live from space album cover"
            />
          </Card>
        </div>
        <Bottom />
      </div>
    </AnimatedPage>
  );
};

export default Appointment;
