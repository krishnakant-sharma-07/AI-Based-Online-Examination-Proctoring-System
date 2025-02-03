import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const QuestionNavigation = ({ totalQuestions, currentQuestion, setCurrentQuestion, questionStatus }) => {
  const getButtonStyles = (status, isActive) => {
    let backgroundColor;
    switch (status) {
      case 'attempted':
        backgroundColor = '#d4edda'; // Light green for answered
        break;
      case 'notVisited':
        backgroundColor = '#f8f9fa'; // Light gray for not visited
        break;
      case 'marked':
        backgroundColor = '#e2e3ff'; // Light purple for marked
        break;
      default:
        backgroundColor = '#f8d7da'; // Light red for not answered
        break;
    }

    return {
      backgroundColor: isActive ? '#007bff' : backgroundColor, // Darker color for active question
      color: isActive ? '#fff' : '#000', // White text for active question
    };
  };

  return (
    <Box
      className="flex flex-col items-center p-4 justify-between"
      sx={{
        width: '25vw',
        maxHeight: '75vh', // Set height to 75% of viewport height
        overflowY: 'auto', // Add vertical scrollbar when overflow happens
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6" className="mb-6 p-2 rounded bg-blue-600 text-white">
          Question Palette:
        </Typography>
        <Box className="grid grid-cols-5 gap-2 justify-center mt-10">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <Box key={index + 1} className="flex justify-center">
              <Button
                variant={currentQuestion === index + 1 ? 'contained' : 'outlined'}
                onClick={() => setCurrentQuestion(index + 1)}
                className="rounded-full"
                sx={{
                  minWidth: '45px',
                  minHeight: '45px',
                  padding: '10px',
                  margin: '5px',
                  ...getButtonStyles(questionStatus[index], currentQuestion === index + 1), // Apply background color styles
                }}
              >
                {index + 1}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="w-full text-center mt-4 mb-4">
        <Box className="flex flex-col space-y-2">
          <Box className="flex justify-center space-x-4">
            <Typography variant="body2" sx={{ color: 'success.main' }}>
              ● Answered
            </Typography>
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              ● Not Answered
            </Typography>
          </Box>
          <Box className="flex justify-center space-x-4">
            <Typography variant="body2" sx={{ color: 'secondary.main' }}>
              ● Marked
            </Typography>
            <Typography variant="body2">
              ● Not Visited
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionNavigation;
