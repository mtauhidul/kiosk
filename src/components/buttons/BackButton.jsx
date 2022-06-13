import { Button } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { modules } from '../../utils/Modules';

const BackButton = ({ text, url }) => {
  const locations = useLocation();
  const navigate = useNavigate();
  const currentPath = locations.pathname;

  const changePath = () => {
    if (currentPath === '/kiosk/checkIn_General') {
      navigate('/');
    } else {
      const index = modules.findIndex((module) => module.path === currentPath);
      const previousPath = modules[index - 1].path;
      navigate(previousPath);
    }
  };

  return (
    <Button className='backButton' onClick={() => changePath()} variant='text'>
      {text}
    </Button>
  );
};

export default BackButton;
