import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Tooltip, Fade } from '@mui/material';
import axios from 'axios';

function UserDashboard({ subscription }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/applications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, []);

  return (
    <Fade in timeout={500}>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>Your Job Applications</Typography>
        <Typography>Total Submissions: {applications.length} / {subscription?.submissions || 0} daily limit</Typography>
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Job ID</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <TableCell>{app.jobId}</TableCell>
                <TableCell>
                  <Tooltip title="View Job" arrow>
                    <a href={app.jobLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1976d2' }}>{app.position}</a>
                  </Tooltip>
                </TableCell>
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Fade>
  );
}

export default UserDashboard;