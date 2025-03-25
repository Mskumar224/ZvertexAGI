import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

function JobTracker() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/tracker`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setJobs(data);
      } catch (error) {
        console.error('Tracker Error:', error.response ? error.response.data : error.message);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Job Application Tracker</Typography>
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
      <Typography sx={{ mt: 2 }}>Total Applied: {jobs.length}</Typography>
    </Container>
  );
}

export default JobTracker;