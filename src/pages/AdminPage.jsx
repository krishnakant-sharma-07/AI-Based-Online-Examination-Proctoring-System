import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, examsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/users'),
          axios.get('http://127.0.0.1:5000/api/exams'),
        ]);
        setUsers(usersRes.data.users);
        setExams(examsRes.data.exams);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Grid container spacing={3}>
        {/* User Management Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>User Management</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    {user.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => approveUser(user.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>

        {/* Exam Management Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Exam Management</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exam</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.status}</TableCell>
                  <TableCell>
                    {exam.status === 'scheduled' && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => startExam(exam.id)}
                      >
                        Start Exam
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );
};

// Approve User Function
const approveUser = async (userId) => {
  try {
    await axios.post(`http://127.0.0.1:5000/api/users/${userId}/approve`);
    alert('User approved successfully!');
    window.location.reload(); // Reload the page to update data
  } catch (error) {
    console.error('Failed to approve user:', error);
    alert('Error approving user');
  }
};

// Start Exam Function
const startExam = async (examId) => {
  try {
    await axios.post(`http://127.0.0.1:5000/api/exams/${examId}/start`);
    alert('Exam started successfully!');
    window.location.reload(); // Reload the page to update data
  } catch (error) {
    console.error('Failed to start exam:', error);
    alert('Error starting exam');
  }
};

export default AdminPage;
