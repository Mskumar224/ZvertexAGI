import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Autocomplete, Typography, Paper, Fade } from '@mui/material';
import CompanySelector from '../Company/CompanySelector';
import { ModalContext } from '../../App';

function ResumeParser({ data }) {
  const [technologies, setTechnologies] = useState(data.keywords || []);
  const [manualTech, setManualTech] = useState('');
  const { openModal } = useContext(ModalContext);

  const handleAddTech = () => {
    if (manualTech && !technologies.includes(manualTech)) {
      setTechnologies([...technologies, manualTech]);
      setManualTech('');
    }
  };

  const handleProceed = () => {
    openModal(<CompanySelector technologies={technologies} />);
  };

  return (
    <Fade in timeout={500}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Select Technologies</Typography>
        <Autocomplete
          multiple
          options={technologies}
          value={technologies}
          onChange={(e, newValue) => setTechnologies(newValue)}
          freeSolo
          renderInput={(params) => <TextField {...params} label="Technologies" />}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <TextField label="Add Technology" value={manualTech} onChange={(e) => setManualTech(e.target.value)} fullWidth />
          <Button variant="outlined" onClick={handleAddTech}>Add</Button>
        </Box>
        <Button variant="contained" onClick={handleProceed} disabled={!technologies.length} sx={{ mt: 2 }}>Proceed to Company Selection</Button>
      </Paper>
    </Fade>
  );
}

export default ResumeParser;