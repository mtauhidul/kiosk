import React from "react";
import policy from "../../assets/20.pdf";
import AnimatedPage from "../../components/Animation/Pages";
import PdfViewer from "./PdfViewer";

const PracticePolicyTerms = () => {
  return (
    <AnimatedPage>
      <PdfViewer pdf={policy} />
    </AnimatedPage>
  );
};

export default PracticePolicyTerms;
