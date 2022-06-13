import * as actions from '../constants';

export const addUserInfo = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_USER_DATA,
      payload: data,
    });
  };
};

export const addDemographicData = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_DEMOGRAPHIC_DATA,
      payload: data,
    });
  };
};

export const addPrimaryInsurance = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_PRIMARY_INSURANCE_DATA,
      payload: data,
    });
  };
};

export const addSecondaryInsurance = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_SECONDARY_INSURANCE_DATA,
      payload: data,
    });
  };
};

export const addAllergiesData = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_ALLERGIES_DATA,
      payload: data,
    });
  };
};

export const addMedicationsData = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_MEDICATIONS_DATA,
      payload: data,
    });
  };
};

export const addFamilyHistory = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_FAMILY_HISTORY,
      payload: data,
    });
  };
};

export const addMedicalHistory = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_MEDICAL_HISTORY,
      payload: data,
    });
  };
};

export const addSurgicalHistory = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_SURGICAL_HISTORY,
      payload: data,
    });
  };
};

export const addSocialHistory = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_SOCIAL_HISTORY,
      payload: data,
    });
  };
};

export const addShoeSize = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_SHOE_SIZE,
      payload: data,
    });
  };
};

export const addHippaPolicy = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_HIPPA_POLICY_DATA,
      payload: data,
    });
  };
};

export const addPracticePolicies = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_PRACTICE_POLICIES_DATA,
      payload: data,
    });
  };
};

export const addSurveyData = (data) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_SURVEY_DATA,
      payload: data,
    });
  };
};
