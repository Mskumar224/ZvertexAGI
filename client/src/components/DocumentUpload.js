import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';

function DocumentUpload({ job, onClose }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('jobId', job.id);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/job/apply-with-docs`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      alert('Application submitted with documents!');
      onClose();
    } catch (error) {
      console.error('Upload Error:', error.response ? error.response.data : error.message);
      alert('Application failed!');
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Upload Additional Documents for {job.title}</DialogTitle>
      <DialogContent>
        <Typography>Upload required documents or apply manually:</Typography>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: '16px' }} />
        <Typography sx={{ mt: 2 }}>
          Alternatively, <a href={job.link} target="_blank" rel="noopener noreferrer">apply manually here</a>.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpload} disabled={!file}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DocumentUpload;