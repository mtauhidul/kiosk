import React from 'react';
import Bottom from '../../components/Bottom/Bottom';
import Selected from '../../components/history/Selected';
import store from '../../state/store';

const surgeryList = ['Surgery'];

const PastSurgical = () => {
  const state = store?.getState()?.data?.surgicalHistory;
  return (
    <div style={{ width: '100%', minHeight: '85vh', position: 'relative' }}>
      <Selected headerText='PAST SURGICAL HISTORY :' items={state} />
      <Bottom />
    </div>
  );
};

export default PastSurgical;
