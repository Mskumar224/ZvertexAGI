import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import axios from 'axios';

function ResumeUpload({ onResumeParsed }) {
  const [file, setFile] = useState(null);
  const [techs, setTechs] = useState([]);
  const [manualTech, setManualTech] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload-resume`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      setTechs(data.keywords);
      onResumeParsed(data.keywords);
    } catch (error) {
      console.error('Upload Error:', error.response ? error.response.data : error.message);
      alert('Resume upload failed!');
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
      {techs.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>Suggested Technologies: {techs.join(', ')}</Typography>
          <TextField
            label="Add Technology Manually"
            value={manualTech}
            onChange={(e) => setManualTech(e.target.value)}
            sx={{ mt: 2, mr: 2 }}
          />
          <Button variant="outlined" onClick={() => { setTechs([...techs, manualTech]); setManualTech(''); }}>
            Add
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ResumeUpload;