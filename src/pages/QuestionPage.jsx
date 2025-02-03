import React, { useState, useEffect, useRef } from 'react';
import QuestionNavigation from '../components/QuestionNavigation';
import QuestionContent from '../components/QuestionContent';
import { Box, Grid, Button, Typography } from '@mui/material';
import axios from 'axios';

const QuestionPage = ({ setExamOver }) => { // Add setExamOver as a prop
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [answers, setAnswers] = useState(() => {
    // Load the saved answers from localStorage on component mount
    const savedAnswers = localStorage.getItem('answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    // Fetch questions from the backend API
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/questions');
        setQuestions(response.data.questions);
        setQuestionStatus(Array(response.data.questions.length).fill('notVisited')); // Initialize status for all questions
        setLoading(false);
        console.log('Fetched questions:', response.data.questions);  // Log fetched questions
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle marking the question as attempted
  const markAsAttempted = (questionNumber) => {
    setQuestionStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[questionNumber - 1] = 'attempted';
      console.log(`Question ${questionNumber} marked as attempted`);  // Log attempted question
      return newStatus;
    });
  };

  const saveAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = {
        ...prevAnswers,
        [questionId]: answer,  
      };
    
      localStorage.setItem('answers', JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
    console.log(`Answer saved for question ${questionId}:`, answer);  // Log saved answer
  };

  // Handle marking the question for review
  const markForReview = () => {
    setQuestionStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[currentQuestion - 1] = 'marked';
      console.log(`Question ${currentQuestion} marked for review`);  // Log marked question
      return newStatus;
    });
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Handle clearing the response
  const clearResponse = () => {
    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers };
      delete newAnswers[questions[currentQuestion - 1]?.id];  // Remove the current question's answer
      // Save updated answers to localStorage
      localStorage.setItem('answers', JSON.stringify(newAnswers));
      console.log(`Response cleared for question ${currentQuestion}`);  // Log cleared response
      return newAnswers;
    });
    alert('Response cleared');
  };

  // Handle moving to the next question
  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
    console.log('Current answers:', answers);  // Log current answers on moving to next question
  };

  // Handle submit action and mark the exam as over
  const handleSubmit = () => {
    console.log('Submitting the exam with answers:', answers);  // Log all answers on submit
    alert('Submitting the exam...');
    // Here you can add logic to send answers to the backend API for saving in the database
    
    // Set the exam as over
    setExamOver(true);  // Trigger the exam over state
  };

  if (loading) {
    return <Typography>Loading questions...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Main content for the question */}
        <Grid item xs={9}>
          <QuestionContent
            currentQuestion={currentQuestion}
            markAsAttempted={() => markAsAttempted(currentQuestion)}
            saveAnswer={saveAnswer}  // Pass saveAnswer to QuestionContent
            answers={answers}  // Pass answers state to QuestionContent
            questions={questions}  // Pass fetched questions to QuestionContent
          />
        </Grid>
        
        {/* Question navigation shifted to the right */}
        <Grid item xs={3}>
          <QuestionNavigation
            totalQuestions={questions.length} // Use the length of fetched questions
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            questionStatus={questionStatus}
            onSubmit={handleSubmit}  // Use handleSubmit to trigger the submission and setExamOver
          />
        </Grid>
      </Grid>

      {/* Action buttons at the bottom */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={markForReview}
        >
          Mark for Review & Next
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={clearResponse}
        >
          Clear Response
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          Save & Next
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionPage;
