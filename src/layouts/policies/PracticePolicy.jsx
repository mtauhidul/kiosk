import React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import ESignature from '../../components/eSignature/ESignature';
import * as actionCreators from '../../state/actionCreators/index';

const PracticePolicy = () => {
  const dispatch = useDispatch();
  const { addPracticePolicies } = bindActionCreators(actionCreators, dispatch);
  return (
    <ESignature handleSubmit={addPracticePolicies} title='Practice' url='/' />
  );
};

export default PracticePolicy;
