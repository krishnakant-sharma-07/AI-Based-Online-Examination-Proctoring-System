// ResultPage.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ResultPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            We will e-mail you the results shortly.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResultPage;
