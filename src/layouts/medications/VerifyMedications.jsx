import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Bottom from "../../components/Bottom/Bottom";
import store from "../../state/store";
import styles from "../../styles/VerifyMedications.module.css";

const VerifyMedications = () => {
  const state = store?.getState()?.data?.medications;
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", minHeight: "85vh", position: "relative" }}>
      <div>
        <h3 className="header3">YOUR ACTIVE MEDICATIONS :</h3>
        <br />
        {state.map((medication, index) => {
          return (
            <h5
              style={{ marginBottom: "20px" }}
              key={index}
              className="header5"
            >
              {medication}
            </h5>
          );
        })}
        <TextField
          sx={{ width: "350px", mb: 3 }}
          id="outlined-multiline-static"
          label="Type your review..."
          multiline
          rows={2}
          columns={10}
        />

        <div className={styles.verificationWrapper}>
          <h4 className="header4">Verify all medications added?</h4>
          <Button
            id={styles.verifyBtn}
            onClick={() => navigate("/")}
            variant="contained"
            size="medium"
            className="binaryButton"
          >
            Verify
          </Button>
        </div>
      </div>
      <Bottom />
    </div>
  );
};

export default VerifyMedications;
