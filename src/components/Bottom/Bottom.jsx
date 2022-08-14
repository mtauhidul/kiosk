import { Button } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/Bottom.module.css";
import { modules } from "../../utils/Modules";
import BackButton from "../buttons/BackButton";
import PrimaryButton from "../buttons/PrimaryButton";

const Bottom = ({ handleSubmit, isDisabled, data, isEdit }) => {
  const locations = useLocation();
  const navigate = useNavigate();
  const currentPath = locations.pathname;
  const index = modules.findIndex((module) => module.path === currentPath);
  const nextPath = modules[index + 1].path;

  return (
    <div className={styles.btnContainer}>
      {isEdit ? (
        <Button
          className="backButton"
          onClick={() => navigate(-1)}
          variant="text"
        >
          Cancel
        </Button>
      ) : (
        <BackButton text={`${index === 0 ? "Cancel" : "Back"}`} url="/" />
      )}

      {isEdit ? (
        <Button
          onClick={() => {
            navigate(-1);
            handleSubmit(data);
          }}
          className="primaryButton"
          variant="contained"
          size="medium"
        >
          {isEdit && "Update info"}
        </Button>
      ) : (
        <PrimaryButton
          disabled={isDisabled}
          handleSubmit={handleSubmit}
          data={data}
          text={`${isEdit ? "Update info" : "Save & Continue"}`}
          url={nextPath}
        />
      )}
    </div>
  );
};

export default Bottom;
