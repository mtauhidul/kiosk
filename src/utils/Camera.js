import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../state/actionCreators/index';
import store from '../state/store';

const Camera = () => {
  const navigate = useNavigate();
  const insuranceType = window.sessionStorage.getItem('insuranceType');
  const [imgSrc, setImgSrc] = useState(null);
  const [data, setData] = useState();
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    if (id === 'patientsPicture') {
      const state = store?.getState()?.data?.demographicsInfo;
      const newState = { ...state, patientsPicture: imgSrc };
      setData(newState);
    } else if (id === 'driversLicense') {
      const state = store?.getState()?.data?.demographicsInfo;
      const newState = { ...state, driversLicense: imgSrc };
      setData(newState);
    } else if (id === 'insuranceCardFront') {
      if (insuranceType.includes('primary')) {
        const state = store?.getState()?.data?.primaryInsurance;
        const newState = { ...state, insuranceCardFront: imgSrc };
        setData(newState);
      } else if (insuranceType.includes('secondary')) {
        const state = store?.getState()?.data?.secondaryInsurance;
        const newState = { ...state, insuranceCardFront: imgSrc };
        setData(newState);
      }
    } else if (id === 'insuranceCardBack') {
      if (insuranceType.includes('primary')) {
        const state = store?.getState()?.data?.primaryInsurance;
        const newState = { ...state, insuranceCardBack: imgSrc };
        setData(newState);
      } else if (insuranceType.includes('secondary')) {
        const state = store?.getState()?.data?.secondaryInsurance;
        const newState = { ...state, insuranceCardBack: imgSrc };
        setData(newState);
      }
    }
  }, [id, imgSrc]);

  const { addDemographicData } = bindActionCreators(actionCreators, dispatch);
  const { addPrimaryInsurance } = bindActionCreators(actionCreators, dispatch);
  const { addSecondaryInsurance } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  const checkImage = () => {
    if (imgSrc && (id === 'patientsPicture' || id === 'driversLicense')) {
      addDemographicData(data);
      navigate('/kiosk/demographics_documents');
    } else if (
      imgSrc &&
      (id === 'insuranceCardFront' || id === 'insuranceCardBack')
    ) {
      if (insuranceType.includes('primary')) {
        addPrimaryInsurance(data);
        navigate('/kiosk/insurance_documents');
      } else if (insuranceType.includes('secondary')) {
        addSecondaryInsurance(data);
        navigate('/kiosk/insurance_docs_secondary');
      }
    }
  };

  return (
    <Webcam
      audio={false}
      height={720}
      screenshotFormat='image/jpeg'
      width={1280}
      videoConstraints={videoConstraints}>
      {({ getScreenshot }) => (
        <button
          onClick={() => {
            const capture = getScreenshot();
            setImgSrc(capture);
            checkImage();
          }}>
          Capture photo
        </button>
      )}
    </Webcam>
  );
};

export default Camera;
