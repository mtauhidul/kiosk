import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrimaryButton = ({ handleSubmit, data, text, url }) => {
  const navigate = useNavigate();

  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    if (handleSubmit) {
      handleSubmit(data);
    }
    navigate(url);
  };
  return (
    <Button
      onClick={(e) => handleSaveAndContinue(e)}
      className='primaryButton'
      variant='contained'
      size='medium'>
      {text}
    </Button>
  );
};

export default PrimaryButton;
