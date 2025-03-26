import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function StudentDashboard() {
  const [keywords, setKeywords] = useState([]);
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        history.push('/login');
        return;
      }

      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data);
        setName(data.name || '');
        setPhone(data.phone || '');
      } catch (error) {
        console.error('Fetch user data failed:', error.response?.data || error.message);
        if (error.response?.status === 500 || error.response?.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
          alert('Session expired or invalid. Please log in again.');
        }
      }
    };
    fetchUserData();
  }, [history]);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/update-profile`,
        { name, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData({ ...userData, name: data.name, phone: data.phone });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error.response?.data || error.message);
      alert('Failed to update profile');
    }
  };

  return (
    <Container sx={{ py: 5, background: '#f5f5f5' }}>
      <Button
        onClick={() => history.push('/subscription')}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, background: '#1976d2', color: '#fff', '&:hover': { background: '#115293', transform: 'scale(1.05)' }, transition: 'all 0.3s' }}
      >
        Back to Subscription
      </Button>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 3 }}>Student Dashboard</Typography>
      <Typography sx={{ mb: 3 }}>Free Plan: 1 Resume | 45 Submissions/Day</Typography>
      <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fff' }}>
        <Typography variant="h6">User Profile</Typography>
        {editMode ? (
          <>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2, width: '100%' }} />
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ mb: 2, width: '100%' }} />
            <Button variant="contained" onClick={handleUpdateProfile} sx={{ mr: 2, background: '#1976d2' }}>Save</Button>
            <Button variant="outlined" onClick={() => setEditMode(false)} sx={{ borderColor: '#1976d2', color: '#1976d2' }}>Cancel</Button>
          </>
        ) : (
          <>
            <Typography>Name: {userData.name || 'Not Set'}</Typography>
            <Typography>Email: {userData.email || 'Loading...'}</Typography>
            <Typography>Phone: {userData.phone || 'Not Set'}</Typography>
            <Typography>Selected Companies: {userData.selectedCompanies?.join(', ') || 'None'}</Typography>
            <Typography>Selected Technology: {userData.selectedTechnology || 'None'}</Typography>
            <Typography>Jobs Applied: {userData.jobsApplied?.length || 0}</Typography>
            <Button variant="outlined" onClick={() => setEditMode(true)} sx={{ mt: 2, borderColor: '#1976d2', color: '#1976d2' }}>Edit Profile</Button>
          </>
        )}
      </Box>
      <ResumeUpload onResumeParsed={setKeywords} maxResumes={1} />
      {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={1} maxSubmissions={45} />}
      <JobTracker />
    </Container>
  );
}

export default StudentDashboard;