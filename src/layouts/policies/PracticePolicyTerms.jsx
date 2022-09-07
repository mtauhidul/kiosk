import React from "react";
import policy from "../../assets/20.pdf";
import PdfViewer from "./PdfViewer";

const PracticePolicyTerms = () => {
  return <PdfViewer pdf={policy} />;
};

export default PracticePolicyTerms;
