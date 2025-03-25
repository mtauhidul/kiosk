import { Button, Card, CardHeader } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/ScanCard.module.css";

const ScanCard = ({ id, title, subTitle, img, alt, btnText }) => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(`/kiosk/camera/${id}`);
  };

  return (
    <Card sx={{ width: 240, height: "auto", pb: "16px", textAlign: "center" }}>
      <CardHeader subheader={title} />
      <h6 style={{ marginTop: "-15px" }} className="header6">
        {subTitle}
      </h6>
      <div className={styles.cardImg}>
        <img src={img} alt={alt} />
      </div>
      <Button
        onClick={() => {
          clickHandler();
        }}
        id={styles.violateText}
        variant="contained"
        size="medium"
        className="backHomeButton"
      >
        {btnText}
      </Button>
    </Card>
  );
};

export default ScanCard;
