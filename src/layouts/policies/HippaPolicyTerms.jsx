import React from 'react';
import policy from '../../assets/hippa.pdf';
import AnimatedPage from '../../components/Animation/Pages';
import PdfViewer from './PdfViewer';

const HippaPolicyTerms = () => {
  return (
    <AnimatedPage>
      <PdfViewer pdf={policy} />
    </AnimatedPage>
  );
};

export default HippaPolicyTerms;
