import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';

function DocumentUpload({ job, onClose }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('jobId', job.id);
    formData.append('company', job.company);
    formData.append('title', job.title);
    formData.append('link', job.link);
    formData.append('requiresDocs', job.requiresDocs);
    if (file) formData.append('document', file);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/apply`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      alert(data.message);
      onClose();
    } catch (error) {
      alert('Document upload failed');
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Upload Documents for {job.title}</DialogTitle>
      <DialogContent>
        <Typography>Upload required documents or apply manually:</Typography>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: '16px' }} />
        <Typography sx={{ mt: 2 }}>
          Or <a href={job.link} target="_blank" rel="noopener noreferrer">apply manually here</a>.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpload} sx={{ background: '#1976d2' }}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DocumentUpload;