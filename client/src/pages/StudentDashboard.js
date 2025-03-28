import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';
import axios from 'axios';

function StudentDashboard() {
  const [keywords, setKeywords] = useState([]);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/export-dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dashboard.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Typography variant="h4" sx={{ color: '#1A3C6D', mb: 3 }}>Student Dashboard</Typography>
        {user && (
          <Box sx={{ mb: 4, p: 2, background: '#F7F9FC', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>Name: {user.name || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>Email: {user.email}</Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>Phone: {user.phone || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>Plan: STUDENT (1 Resume | 45 Submissions/Day)</Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>Technologies: {user.selectedTechnology || 'None'}</Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>Companies: {user.selectedCompanies?.join(', ') || 'None'}</Typography>
            <Typography variant="body1" sx={{ color: '#6B7280' }}>Jobs Applied: {user.jobsApplied?.length || 0}</Typography>
          </Box>
        )}
        <ResumeUpload onResumeParsed={setKeywords} maxResumes={1} />
        {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={1} maxSubmissions={45} />}
        <JobTracker />
        <Button variant="contained" color="secondary" onClick={handleExport} sx={{ mt: 3 }}>Export Dashboard</Button>
      </Paper>
    </Container>
  );
}

export default StudentDashboard;