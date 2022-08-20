import React from "react";
import policy from "../../assets/policy.pdf";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import ESignature from "../../components/eSignature/ESignature";
import * as actionCreators from "../../state/actionCreators/index";

const HippaPolicy = () => {
  const dispatch = useDispatch();
  const { addHippaPolicy } = bindActionCreators(actionCreators, dispatch);
  return (
    <ESignature
      handleSubmit={addHippaPolicy}
      policyFile={policy}
      title="HIPPA"
      url="/"
    />
  );
};

export default HippaPolicy;
