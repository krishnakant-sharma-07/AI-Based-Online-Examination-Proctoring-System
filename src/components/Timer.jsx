import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

const Timer = ({ totalTime, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Early exit if no time is left
    if (timeLeft <= 0) {
      if (onTimerEnd) onTimerEnd(); // Trigger callback when timer finishes
      return;
    }

    // Set timeout to decrease the timeLeft every second
    const timerId = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timerId);
  }, [timeLeft, onTimerEnd]); // Only re-run effect if timeLeft or onTimerEnd changes

  return (
    <Box
      className="flex items-center justify-center p-2"
      sx={{
        backgroundColor: '#3f51b5',
        color: 'white',
        borderRadius: '8px',
        width: '120px',
        height: '50px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">
        {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default Timer;
