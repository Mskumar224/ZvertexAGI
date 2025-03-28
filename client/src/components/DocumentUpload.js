import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material'; // Added Box import
import axios from 'axios';

function DocumentUpload({ userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('userId', userId);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('');
      onUploadSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
      </Box>
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload Document
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Box>
  );
}

export default DocumentUpload;