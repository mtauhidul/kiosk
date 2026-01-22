import { FormControl, TextField } from "@mui/material";
import { useState } from "react";
import InfoIcon from "../../assets/icons/infoIcon.svg";
import Bottom from "../../components/Bottom/Bottom";
import styles from "../../styles/ChangeInfo.module.css";

const ChangeInfo = () => {
  const [code, setCode] = useState("");
  window.sessionStorage.removeItem("insuranceType");
  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardWrapper}>
        <div className={styles.textWrapper}>
          <img src={InfoIcon} alt="info" />
          <h4 className="header4">
            PLEASE SEE ONE OF OUR FRONT DESK ASSOCIATES
          </h4>
        </div>
        <br />
        <h6 className="header6">Enter a code to proceed</h6>
        <FormControl sx={{ mb: 2, mt: 1, width: "50%", minWidth: "240px" }}>
          <TextField
            onChange={(e) => setCode(e.target.value)}
            id="outlined-required"
            label="Enter code"
          />
        </FormControl>
      </div>
      <Bottom />
    </div>
  );
};

export default ChangeInfo;
