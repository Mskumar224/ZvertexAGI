import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';

function ResumeUpload({ onResumeParsed, maxResumes }) {
  const [file, setFile] = useState(null);
  const [techs, setTechs] = useState([]);
  const [manualTech, setManualTech] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return setError('Please select a file');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload-resume`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      setTechs(data.keywords);
      onResumeParsed(data.keywords);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  const addManualTech = () => {
    if (manualTech) {
      setTechs([...techs, manualTech]);
      onResumeParsed([...techs, manualTech]);
      setManualTech('');
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fff' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Upload Resume (Max: {maxResumes})</Typography>
      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} style={{ mb: 2 }} />
      <Button variant="contained" onClick={handleUpload} sx={{ background: '#1976d2', mb: 2 }}>Upload</Button>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {techs.length > 0 && <Typography sx={{ mb: 1 }}>Detected Tech: {techs.join(', ')}</Typography>}
      <TextField label="Add Tech Manually" value={manualTech} onChange={(e) => setManualTech(e.target.value)} sx={{ mr: 2 }} />
      <Button variant="outlined" onClick={addManualTech} sx={{ borderColor: '#1976d2', color: '#1976d2' }}>Add</Button>
    </Box>
  );
}

export default ResumeUpload;