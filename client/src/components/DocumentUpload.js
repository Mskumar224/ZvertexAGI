import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';

function DocumentUpload({ job, onClose }) {
  const [idFile, setIdFile] = useState(null);
  const [visaFile, setVisaFile] = useState(null);

  const handleUpload = async () => {
    if (!idFile || !visaFile) return alert('Please upload both ID and Visa documents.');

    const formData = new FormData();
    formData.append('jobId', job.id);
    formData.append('company', job.company);
    formData.append('title', job.title);
    formData.append('link', job.link);
    formData.append('requiresDocs', job.requiresDocs);
    formData.append('id', idFile);
    formData.append('visa', visaFile);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/apply`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      alert(data.message);

      const token = localStorage.getItem('token');
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post(`${process.env.REACT_APP_API_URL}/api/job/send-confirmation`, {
        email: userResponse.data.email,
        title: job.title,
        company: job.company,
        jobId: job.id,
        link: job.link,
      });

      onClose();
    } catch (error) {
      alert('Document upload failed');
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Upload Documents for {job.title}</DialogTitle>
      <DialogContent>
        <Typography>Please upload the following required documents:</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>ID (e.g., Passport, Driver’s License):</Typography>
          <input type="file" onChange={(e) => setIdFile(e.target.files[0])} style={{ marginTop: '8px' }} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>Visa Copy:</Typography>
          <input type="file" onChange={(e) => setVisaFile(e.target.files[0])} style={{ marginTop: '8px' }} />
        </Box>
        <Typography sx={{ mt: 2 }}>
          Alternatively, <a href={job.link} target="_blank" rel="noopener noreferrer">apply manually here</a>.
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