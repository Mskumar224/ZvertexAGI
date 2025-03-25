import React, { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';

function DocumentUpload({ job, onClose }) {
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(true);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', job.id);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } }
      );
      alert(`Applied to ${job.title} at ${job.company} with document!`);
      setOpen(false);
      onClose();
    } catch (error) {
      console.error('Upload Error:', error.response ? error.response.data : error.message);
      alert('Application failed!');
    }
  };

  return (
    <Modal open={open} onClose={() => { setOpen(false); onClose(); }}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 300 }}>
        <Typography variant="h6" gutterBottom>Upload Document for {job.title}</Typography>
        <input type="file" onChange={handleFileChange} accept=".pdf,.docx" style={{ marginBottom: '16px' }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleUpload}>Upload & Apply</Button>
          <Button variant="outlined" onClick={() => { setOpen(false); onClose(); }}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DocumentUpload;