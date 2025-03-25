import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import axios from 'axios';

function Dashboard() {
  const [keywords, setKeywords] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(data);
    };
    fetchUser();
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {user && (
        <Typography>Subscription: {user.subscription} | Resumes: {user.resumes} | Submissions: {user.submissions}</Typography>
      )}
      <ResumeUpload onResumeParsed={setKeywords} />
      {keywords.length > 0 && <JobApply keywords={keywords} />}
    </Container>
  );
}

export default Dashboard;