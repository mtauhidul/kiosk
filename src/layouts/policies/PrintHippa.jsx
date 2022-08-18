import React from "react";
import policy from "../../assets/policy.pdf";
import Print from "../../components/print/Print";

const PrintHippa = () => {
  return <Print title="HIPPA" policyFile={policy} />;
};

export default PrintHippa;
