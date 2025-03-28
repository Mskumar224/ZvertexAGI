// Location: C:\Users\satee\OneDrive\Desktop\ZvertexAGI\ZvertexAGI\client\src\components\ProfileUpload.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function ProfileUpload({ onProfileUploaded, maxProfiles }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [resume, setResume] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [visaDoc, setVisaDoc] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('education', education);
    formData.append('experience', experience);
    if (resume) formData.append('resume', resume);
    if (idDoc) formData.append('idDoc', idDoc);
    if (visaDoc) formData.append('visaDoc', visaDoc);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload-profile`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      onProfileUploaded({ _id: data.profileId, name, phone, education, experience });
      setError('');
      setName('');
      setPhone('');
      setEducation('');
      setExperience('');
      setResume(null);
      setIdDoc(null);
      setVisaDoc(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Profile upload failed');
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #E1E8E9', borderRadius: 2, background: '#FFFFFF' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#1C2526' }}>Upload Profile (Max: {maxProfiles})</Typography>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Education" value={education} onChange={(e) => setEducation(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <TextField label="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} fullWidth sx={{ mb: 2 }} />
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} style={{ display: 'block', marginBottom: '10px', color: '#1C2526' }} />
      <input type="file" accept=".pdf,.jpg" onChange={(e) => setIdDoc(e.target.files[0])} style={{ display: 'block', marginBottom: '10px', color: '#1C2526' }} />
      <input type="file" accept=".pdf,.jpg" onChange={(e) => setVisaDoc(e.target.files[0])} style={{ display: 'block', marginBottom: '10px', color: '#1C2526' }} />
      <Button variant="contained" onClick={handleUpload} sx={{ background: '#1C2526', color: '#FFFFFF', '&:hover': { background: '#2E3839' } }}>
        Upload Profile
      </Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
}

export default ProfileUpload;