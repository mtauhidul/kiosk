import { useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Card, CardHeader } from "@mui/material";
import styles from "../../styles/ScanCard.module.css";

const UploadCard = ({
  id,
  title,
  subTitle,
  img,
  alt,
  btnText,
  addFile,
  url,
  state,
}) => {
  const location = useLocation();
  const filePickerRef = useRef(null);

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
        id={styles.violateText}
        variant="contained"
        size="medium"
        className="backHomeButton"
        onClick={() => filePickerRef.current.click()}
      >
        {btnText}
        <input
          ref={filePickerRef}
          type="file"
          hidden
          onChange={() => addFile(id, filePickerRef.current.files[0])}
        />
      </Button>
    </Card>
  );
};

export default UploadCard;
