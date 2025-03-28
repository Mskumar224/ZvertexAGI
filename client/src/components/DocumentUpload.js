import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
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

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('userId', userId);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setError('');
      onUploadSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      console.error('Upload error:', err);
    }
  };

  return (
    <Box sx={{ p: 2, width: '100%', maxWidth: 400 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Upload Resume</Typography>
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
      <Button variant="contained" color="primary" onClick={handleUpload} fullWidth>
        Upload
      </Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
}

export default DocumentUpload;