import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/tracker`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Tracker Jobs:', data);
        setJobs(data);
        setError(null);
      } catch (err) {
        console.error('Tracker Error:', err.response?.data || err.message);
        setError('Failed to load job tracker');
      }
    };
    fetchJobs();
  }, []);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" gutterBottom>Job Application Tracker</Typography>
      {error && <Typography color="error">{error}</Typography>}
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
          {jobs.map(job => (
            <TableRow key={job.jobId}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell><a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a></TableCell>
              <TableCell>{job.applied ? new Date(job.updatedAt).toLocaleDateString() : 'Pending'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography sx={{ mt: 2 }}>Total Applied: {jobs.filter(job => job.applied).length}</Typography>
    </Box>
  );
}

export default JobTracker;