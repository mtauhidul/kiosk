import React from "react";
import policy from "../../assets/policy.pdf";
import Print from "../../components/print/Print";

const PrintPractice = () => {
  return <Print title="Practice" policyFile={policy} />;
};

export default PrintPractice;
