import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../../styles/Bottom.module.css";
import { modules } from "../../utils/Modules";
import BackButton from "../buttons/BackButton";
import PrimaryButton from "../buttons/PrimaryButton";

const Bottom = ({ handleSubmit, isDisabled, data }) => {
  const locations = useLocation();
  const currentPath = locations.pathname;
  const index = modules.findIndex((module) => module.path === currentPath);
  const nextPath = modules[index + 1].path;

  return (
    <div className={styles.btnContainer}>
      <BackButton text={`${index === 0 ? "Cancel" : "Back"}`} url="/" />
      <PrimaryButton
        disabled={isDisabled}
        handleSubmit={handleSubmit}
        data={data}
        text="Save & Continue"
        url={nextPath}
      />
    </div>
  );
};

export default Bottom;
