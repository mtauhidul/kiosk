import React from 'react';
import policy from '../../assets/practice.pdf';
import AnimatedPage from '../../components/Animation/Pages';
import PdfViewer from './PdfViewer';

const PracticePolicyTerms = () => {
  return (
    <AnimatedPage>
      <PdfViewer pdf={policy} />
    </AnimatedPage>
  );
};

export default PracticePolicyTerms;
