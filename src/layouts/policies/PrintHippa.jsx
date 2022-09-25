import React from "react";
import policy from "../../assets/policy.pdf";
import AnimatedPage from "../../components/Animation/Pages";
import Print from "../../components/print/Print";

const PrintHippa = () => {
  return (
    <AnimatedPage>
      <Print title="HIPPA" policyFile={policy} />
    </AnimatedPage>
  );
};

export default PrintHippa;
