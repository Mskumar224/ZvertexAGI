import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTechs(data.keywords);
      onResumeParsed(data.keywords);
    } catch (error) {
      alert('Resume upload failed!');
    }
  };

  return (
    <div>
      <Typography variant="h6">Upload Resume</Typography>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>Upload</Button>
      {techs.length > 0 && (
        <>
          <Typography>Suggested Technologies: {techs.join(', ')}</Typography>
          <TextField
            label="Add Technology Manually"
            value={manualTech}
            onChange={(e) => setManualTech(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button onClick={() => setTechs([...techs, manualTech])}>Add</Button>
        </>
      )}
    </div>
  );
}

export default ResumeUpload;