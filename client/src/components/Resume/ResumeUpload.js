import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Typography, Paper, Fade } from '@mui/material';
import axios from 'axios';
import ResumeParser from './ResumeParser';
import { ModalContext } from '../../App';

function ResumeUpload({ subscription }) {
  const [file, setFile] = React.useState(null);
  const [parsedData, setParsedData] = React.useState(null);
  const { openModal } = useContext(ModalContext);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.error('No files accepted');
      return;
    }
    const uploadedFile = acceptedFiles[0];
    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/resume/upload`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } }
      );
      setFile(uploadedFile);
      setParsedData(res.data);
      openModal(<ResumeParser data={res.data} />);
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
    }
  }, [openModal]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    maxFiles: subscription?.resumes || 1,
  });

  return (
    <Fade in timeout={500}>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>Upload Your Resume</Typography>
        <Box {...getRootProps()} sx={{ border: '2px dashed #ccc', p: 4, textAlign: 'center', bgcolor: '#fafafa', transition: 'background-color 0.3s', '&:hover': { bgcolor: '#e0e0e0' } }}>
          <input {...getInputProps()} />
          <Typography>Drag & drop your resume here, or click to select (PDF, DOC, DOCX, TXT)</Typography>
        </Box>
      </Paper>
    </Fade>
  );
}

export default ResumeUpload;