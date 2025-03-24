import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeParser from './ResumeParser';

function ResumeUpload({ subscription }) {
  const [file, setFile] = React.useState(null);
  const [parsedData, setParsedData] = React.useState(null);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setFile(uploadedFile);
      setParsedData(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume');
      console.error(err);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: subscription?.resumes || 1,
  });

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button onClick={() => navigate('/')} variant="text" color="primary">
          ZvertexAGI
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Upload Your Resume
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box
        {...getRootProps()}
        sx={{ border: '2px dashed #ccc', p: 4, textAlign: 'center', bgcolor: '#fafafa' }}
      >
        <input {...getInputProps()} />
        <Typography>
          Drag & drop your resume here, or click to select (PDF, DOC, DOCX, TXT)
        </Typography>
      </Box>
      {parsedData && <ResumeParser data={parsedData} />}
    </Paper>
  );
}

export default ResumeUpload;