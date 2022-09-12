import React from "react";
import policy from "../../assets/policy.pdf";
import PdfViewer from "./PdfViewer";

const HippaPolicyTerms = () => {
  return <PdfViewer pdf={policy} />;
};

export default HippaPolicyTerms;
