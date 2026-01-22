import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import BackButton from "../../components/buttons/BackButton";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/Survey.module.css";

const Survey = () => {
  const dispatch = useDispatch();
  const [ans, setAns] = useState("");
  const state = store?.getState()?.data?.survey;

  const { addSurveyData } = bindActionCreators(actionCreators, dispatch);

  const submitSurveyData = (answer) => {
    const newState = { ...state, answer: answer };
    addSurveyData(newState);
  };

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.surveyWrapper}>
        <small>Question 1 from 1</small>
        <h5 className="header5">{state?.question}</h5>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="Friend or Family Referral"
              control={<Radio />}
              label="Friend or Family Referral"
              onClick={(e) => setAns(e.target.value)}
            />
            <FormControlLabel
              value="Doctor Referral"
              control={<Radio />}
              label="Doctor Referral"
              onClick={(e) => setAns(e.target.value)}
            />
            <FormControlLabel
              value="Online Search (Google, Bing, etc.)"
              control={<Radio />}
              label="Online Search (Google, Bing, etc.)"
              onClick={(e) => setAns(e.target.value)}
            />
            <FormControlLabel
              value="Insurance Provider Directory"
              control={<Radio />}
              label="Insurance Provider Directory"
              onClick={(e) => setAns(e.target.value)}
            />
            <FormControlLabel
              value="Social Media"
              control={<Radio />}
              label="Social Media"
              onClick={(e) => setAns(e.target.value)}
            />
            <FormControlLabel
              value="Advertisement (Print, Radio, TV)"
              control={<Radio />}
              label="Advertisement (Print, Radio, TV)"
              onClick={(e) => setAns(e.target.value)}
            />
          </RadioGroup>
        </FormControl>
        <div className={styles.pBtnContainer}>
          <PrimaryButton
            handleSubmit={submitSurveyData}
            data={ans}
            text="Next"
            url="/kiosk/thanks"
          />
        </div>
      </div>
      <div className={styles.backBtnContainer}>
        <BackButton text="Back to Home" url="/" />
      </div>
    </div>
  );
};

export default Survey;
