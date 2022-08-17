import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PrimaryButton = ({
  handleSubmit,
  data,
  text,
  url,
  disabled,
  saveAsJson,
}) => {
  const navigate = useNavigate();

  const handleSaveAndContinue = (e) => {
    e.preventDefault();

    if (saveAsJson) {
      saveAsJson();
      navigate(url);
    } else {
      if (handleSubmit) {
        handleSubmit(data);
      }
      navigate(url);
    }
  };

  return (
    <Button
      disabled={disabled}
      onClick={(e) => handleSaveAndContinue(e)}
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
      {disabled ? "Please fill out all fields" : text}
    </Button>
  );
};

export default PrimaryButton;
