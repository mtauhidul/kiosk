import React from "react";
import policy from "../../assets/policy.pdf";
import AnimatedPage from "../../components/Animation/Pages";
import Print from "../../components/print/Print";

const PrintPractice = () => {
  return (
    <AnimatedPage>
      <Print title="Practice" policyFile={policy} />
    </AnimatedPage>
  );
};

export default PrintPractice;
