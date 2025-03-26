import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/tracker`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setJobs(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tracker');
      }
    };
    fetchJobs();
  }, []);

  return (
    <Container sx={{ mt: 5, background: '#fff', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Job Tracker</Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Date Applied</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.jobId}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell><a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a></TableCell>
                <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Typography sx={{ mt: 2 }}>Total Applied: {jobs.length}</Typography>
    </Container>
  );
}

export default JobTracker;