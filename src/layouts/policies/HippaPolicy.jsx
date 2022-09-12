import React from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import ESignature from "../../components/eSignature/ESignature";
import * as actionCreators from "../../state/actionCreators/index";

const HippaPolicy = () => {
  const dispatch = useDispatch();
  const { addHippaPolicy } = bindActionCreators(actionCreators, dispatch);

  return <ESignature handleSubmit={addHippaPolicy} title="HIPPA" url="/" />;
};

export default HippaPolicy;
