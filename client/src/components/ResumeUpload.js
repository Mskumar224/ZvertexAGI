import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Select, MenuItem } from '@mui/material';
import axios from 'axios';

function ResumeUpload({ onResumeParsed }) {
  const [file, setFile] = useState(null);
  const [techs, setTechs] = useState([]);
  const [manualTech, setManualTech] = useState('');
  const [error, setError] = useState(null);
  const techOptions = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'AWS', 'Docker', 'TypeScript', 'Kubernetes'];

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    console.log('Uploading resume:', { fileName: file.name, size: file.size });

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload-resume`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTechs(data.keywords);
      onResumeParsed(data.keywords);
      setError(null);
    } catch (err) {
      console.error('Resume Upload Failed:', err);
      setError(err.response?.data?.error || 'Resume upload failed');
    }
  };

  const handleTechChange = (e) => {
    const selected = e.target.value;
    setTechs(selected);
    onResumeParsed(selected);
  };

  const handleAddManualTech = () => {
    if (manualTech && !techs.includes(manualTech)) {
      const updatedTechs = [...techs, manualTech];
      setTechs(updatedTechs);
      onResumeParsed(updatedTechs);
      setManualTech('');
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fff' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Upload Your Resume</Typography>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: 'block', marginBottom: '16px' }}
      />
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {techs.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>Suggested Technologies:</Typography>
          <Select
            multiple
            value={techs}
            onChange={handleTechChange}
            fullWidth
            sx={{ mt: 1 }}
          >
            {techOptions.map(tech => (
              <MenuItem key={tech} value={tech}>{tech}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Add Technology Manually"
            value={manualTech}
            onChange={(e) => setManualTech(e.target.value)}
            sx={{ mt: 2, mr: 2 }}
          />
          <Button variant="outlined" onClick={handleAddManualTech}>Add</Button>
        </Box>
      )}
    </Box>
  );
}

export default ResumeUpload;