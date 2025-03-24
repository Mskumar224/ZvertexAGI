import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Autocomplete, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CompanySelector from '../Company/CompanySelector';

function ResumeParser({ data }) {
  const [technologies, setTechnologies] = useState(data.keywords || []);
  const [manualTech, setManualTech] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (technologies.length > 0) {
      // Automatically proceed if technologies are present
    }
  }, [technologies]);

  const handleAddTech = () => {
    if (manualTech && !technologies.includes(manualTech)) {
      setTechnologies([...technologies, manualTech]);
      setManualTech('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button onClick={() => navigate('/')} variant="text" color="primary">
          ZvertexAGI
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>
        Select Technologies
      </Typography>
      <Autocomplete
        multiple
        options={technologies}
        value={technologies}
        onChange={(e, newValue) => setTechnologies(newValue)}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Technologies" />}
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Add Technology"
          value={manualTech}
          onChange={(e) => setManualTech(e.target.value)}
          fullWidth
        />
        <Button variant="outlined" onClick={handleAddTech}>
          Add
        </Button>
      </Box>
      {technologies.length > 0 && <CompanySelector technologies={technologies} />}
    </Paper>
  );
}

export default ResumeParser;