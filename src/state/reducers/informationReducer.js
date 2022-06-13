import * as actions from '../constants';

const initialState = {
  userInfo: {},
  demographicsInfo: {},
  primaryInsurance: {},
  secondaryInsurance: {},
  allergies: [],
  medications: [],
  familyHistory: {},
  medicalHistory: [],
  surgicalHistory: [],
  socialHistory: {},
  shoeSize: {},
  hippaPolicy: {},
  practicePolicies: {},
  survey: {
    question: 'LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPICING?',
    answer: '',
  },
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.ADD_USER_DATA:
      return (state = {
        ...state,
        userInfo: action.payload,
      });
    case actions.ADD_DEMOGRAPHIC_DATA:
      return (state = {
        ...state,
        demographicsInfo: action.payload,
      });
    case actions.ADD_PRIMARY_INSURANCE_DATA:
      return (state = {
        ...state,
        primaryInsurance: action.payload,
      });
    case actions.ADD_SECONDARY_INSURANCE_DATA:
      return (state = {
        ...state,
        secondaryInsurance: action.payload,
      });
    case actions.ADD_ALLERGIES_DATA:
      return (state = {
        ...state,
        allergies: action.payload,
      });
    case actions.ADD_MEDICATIONS_DATA:
      return (state = {
        ...state,
        medications: action.payload,
      });
    case actions.ADD_FAMILY_HISTORY:
      return (state = {
        ...state,
        familyHistory: action.payload,
      });
    case actions.ADD_MEDICAL_HISTORY:
      return (state = {
        ...state,
        medicalHistory: action.payload,
      });
    case actions.ADD_SURGICAL_HISTORY:
      return (state = {
        ...state,
        surgicalHistory: action.payload,
      });
    case actions.ADD_SOCIAL_HISTORY:
      return (state = {
        ...state,
        socialHistory: action.payload,
      });
    case actions.ADD_SHOE_SIZE:
      return (state = {
        ...state,
        shoeSize: action.payload,
      });
    case actions.ADD_HIPPA_POLICY_DATA:
      return (state = {
        ...state,
        hippaPolicy: action.payload,
      });
    case actions.ADD_PRACTICE_POLICIES_DATA:
      return (state = {
        ...state,
        practicePolicies: action.payload,
      });
    default:
      return state;
  }
}

export default reducer;
