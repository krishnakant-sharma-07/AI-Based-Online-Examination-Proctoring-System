import React, { useState, useEffect } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, TextField } from '@mui/material';

const QuestionContent = ({ currentQuestion, questions, saveAnswer, answers }) => {
  const currentQ = questions[currentQuestion - 1];  // Get the current question

  // Initialize answer state based on the question type
  const [selectedOptions, setSelectedOptions] = useState(answers[currentQ?.id] || '');

  useEffect(() => {
    setSelectedOptions(answers[currentQ?.id] || '');
  }, [currentQuestion, answers, currentQ]);

  if (!currentQ) {
    return <Typography>No question available for this index.</Typography>;
  }

  const handleSingleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(value);
    saveAnswer(currentQ.id, value); // Save the answer when selected
  };

  const handleMultipleOptionChange = (e) => {
    const value = e.target.value;
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];
    setSelectedOptions(newSelectedOptions);
    saveAnswer(currentQ.id, newSelectedOptions); // Save the answer when selected
  };

  const handleIntegerChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(value);
    saveAnswer(currentQ.id, value); // Save the integer answer
  };

  const handleSubjectiveChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(value);
    saveAnswer(currentQ.id, value); // Save the subjective answer
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Question {currentQuestion}: {currentQ?.question_text || 'No question available'}
      </Typography>

      {/* Handle single-choice questions */}
      {currentQ?.question_type === 'single_choice' && currentQ?.options?.length > 0 && (
        <RadioGroup value={selectedOptions} onChange={handleSingleOptionChange}>
          {currentQ.options.map((option, index) => (
            <FormControlLabel key={index} value={option.option_text} control={<Radio />} label={option.option_text} />
          ))}
        </RadioGroup>
      )}

      {/* Handle multiple-choice questions */}
      {currentQ?.question_type === 'multiple_choice' && currentQ?.options?.length > 0 && (
        <Box>
          {currentQ.options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedOptions.includes(option.option_text)}
                  onChange={handleMultipleOptionChange}
                  value={option.option_text}
                />
              }
              label={option.option_text}
            />
          ))}
        </Box>
      )}

      {/* Handle integer-type questions */}
      {currentQ?.question_type === 'integer_type' && (
        <TextField
          type="number"
          value={selectedOptions}
          onChange={handleIntegerChange}
          label="Enter your answer"
          variant="outlined"
          fullWidth
        />
      )}

      {/* Handle subjective questions */}
      {currentQ?.question_type === 'subjective' && (
        <TextField
          multiline
          rows={4}
          value={selectedOptions}
          onChange={handleSubjectiveChange}
          label="Your Answer"
          variant="outlined"
          fullWidth
        />
      )}
    </Box>
  );
};

export default QuestionContent;
