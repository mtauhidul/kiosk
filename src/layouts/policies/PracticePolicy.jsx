import React from "react";
import policy from "../../assets/policy.pdf";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import ESignature from "../../components/eSignature/ESignature";
import * as actionCreators from "../../state/actionCreators/index";
import AnimatedPage from "../../components/Animation/Pages";

const PracticePolicy = () => {
  const dispatch = useDispatch();
  const { addPracticePolicies } = bindActionCreators(actionCreators, dispatch);
  return (
    <AnimatedPage>
      <ESignature
        handleSubmit={addPracticePolicies}
        policyFile={policy}
        title="Practice"
        url="/"
      />
    </AnimatedPage>
  );
};

export default PracticePolicy;
