import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserActions = ({ isAuthenticated, isExamStarted, handleLogout, stopRecording, webcamRecording, screenRecording }) => {

  const submitExam = async () => {
    // Stop the recording
    stopRecording();

    // Extract answers from localStorage
    const answers = JSON.parse(localStorage.getItem('answers'));

    // Retrieve user email from localStorage
    const userEmail = localStorage.getItem('user_email');  

    // Prepare FormData to send the recordings and answers
    const formData = new FormData();

    // Add user's email to FormData
    if (userEmail) {
      formData.append('user_email', userEmail);
    } else {
      console.error('User email not found');
      return;
    }

    // Add answers to FormData
    if (answers) {
      formData.append('answers', JSON.stringify(answers));
    } else {
      console.error('No answers found in localStorage');
    }

    // Add webcam recording (ensure this is a Blob or File object)
    if (webcamRecording instanceof Blob) {
      formData.append('webcamRecording', webcamRecording, 'webcam_recording.mp4');
    } else {
      console.error('Webcam recording is not a valid file');
    }

    // Add screen recording (ensure this is a Blob or File object)
    if (screenRecording instanceof Blob) {
      formData.append('screenRecording', screenRecording, 'screen_recording.mp4');
    } else {
      console.error('Screen recording is not a valid file');
    }

    try {
      // Send the FormData to the backend
      const response = await axios.post('http://127.0.0.1:5000/api/submit-exam', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Exam submitted successfully', response.data);
    } catch (error) {
      console.error('Failed to submit the exam:', error);
    }
  };
  return (
    <div className="flex space-x-2">
      {isAuthenticated ? (
        <>
          {!isExamStarted && ( // Show Logout button only if the exam is not started
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
          {isExamStarted && (
            <Button
              variant="contained"
              color="primary"
              onClick={submitExam}
            >
              Submit Exam
            </Button>
          )}
        </>
      ) : (
        <>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </>
      )}
    </div>
  );
  
};

export default UserActions;
