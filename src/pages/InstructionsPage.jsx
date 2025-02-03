import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstructionsPage = ({ isAuthenticated, setExamStarted }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0); // Store number of questions
  const [totalTime, setTotalTime] = useState(0); // Store total exam time in minutes
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch the number of questions and calculate the total time
  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/questions'); // Replace with your API endpoint
        const questions = response.data.questions;
        setNumberOfQuestions(questions.length);
        const totalSeconds = questions.length * 45;
        const totalMinutes = Math.floor(totalSeconds / 60); // Convert seconds to minutes
        setTotalTime(totalMinutes);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestionData();
  }, []);

  const handleConsentChange = (e) => {
    setConsentGiven(e.target.checked);
  };

  const handleStartExam = () => {
    if (consentGiven) {
      alert(
        'Important: Exam will auto-submit if you stop screen sharing or switch tabs more than 3 times. Do not switch tabs or stop screen sharing.'
      );
      setExamStarted(true); // Signal that the exam has started
      navigate('/exam'); // Navigate to the exam page
    }
  };

  return (
    <Box sx={{ maxWidth: '1920px', margin: '0 auto', p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Exam Instructions
      </Typography>
      <Box sx={{ textAlign: 'left', mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Disclaimer
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please read the following instructions carefully before starting the exam.
          You must comply with the rules and regulations of the exam. Any violation
          may lead to disqualification.
        </Typography>

        <Typography variant="h6" gutterBottom>
          Exam Details
        </Typography>
        <Typography variant="body1" gutterBottom>
          - The exam consists of {numberOfQuestions} questions.<br />
          - You have {totalTime} minutes to complete the exam.<br />
          - There will be various types of questions, including:
        </Typography>
        <Box component="ul" sx={{ ml: 4 }}>
          <li>Multiple-choice questions (single or multiple correct answers)</li>
          <li>Integer type questions</li>
          <li>Subjective questions</li>
        </Box>

        <Typography variant="h6" gutterBottom>
          Authorization and Rights
        </Typography>
        <Typography variant="body1" gutterBottom>
          By proceeding, you agree that the exam is conducted under fair rules.
          You also consent to the recording of your webcam and screen during the exam for
          proctoring purposes. Your personal data will be protected in accordance with our
          privacy policy.
        </Typography>
      </Box>

      {/* Align checkbox and button in the same line */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <FormControlLabel
          control={<Checkbox checked={consentGiven} onChange={handleConsentChange} />}
          label="I have read and consent to the exam terms and conditions."
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartExam}
          disabled={!consentGiven}
        >
          Start Exam
        </Button>
      </Box>
    </Box>
  );
};

export default InstructionsPage;
