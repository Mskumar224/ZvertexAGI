import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard({ subscription }) {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

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
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button onClick={() => navigate('/')} variant="text" color="primary">
          ZvertexAGI
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Your Job Applications
      </Typography>
      <Typography>
        Total Submissions: {applications.length} / {subscription?.submissions || 0} daily limit
      </Typography>
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
            <TableRow key={app._id}>
              <TableCell>{app.jobId}</TableCell>
              <TableCell>
                <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
                  {app.position}
                </a>
              </TableCell>
              <TableCell>{app.company}</TableCell>
              <TableCell>{app.status}</TableCell>
              <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default UserDashboard;