// File Location: C:\Users\satee\OneDrive\Desktop\ZvertexAGI\ZvertexAGI\client\src\components\BackButton.js
import React from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

function BackButton() {
  const history = useHistory();

  return (
    <Button
      variant="outlined"
      onClick={() => history.goBack()}
      sx={{ mb: 3, color: '#fff', borderColor: '#007bff', '&:hover': { background: '#007bff', color: '#fff', borderColor: '#007bff' } }}
    >
      Back
    </Button>
  );
}

export default BackButton;