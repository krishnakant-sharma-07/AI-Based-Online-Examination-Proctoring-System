import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Card, CardContent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');  // State to track backend errors
  const [isRegistered, setIsRegistered] = useState(false);  // Track registration success
  const navigate = useNavigate();

  // Email validation function (basic regex for email format)
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function (assume a valid phone is 10 digits)
  const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Age validation function (between 16 and 100)
  const isValidAge = (age) => {
    return age >= 16 && age <= 100;
  };

  // Password validation function (minimum length of 6 characters)
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  // Form validation before submission
  const validateForm = () => {
    let tempErrors = {};
    if (!name) tempErrors.name = "Name is required";
    if (!email || !isValidEmail(email)) tempErrors.email = "A valid email is required";
    if (!phone || !isValidPhone(phone)) tempErrors.phone = "A valid 10-digit phone number is required";
    if (!age || !isValidAge(Number(age))) tempErrors.age = "Age must be between 16 and 100";
    if (!password || !isValidPassword(password)) tempErrors.password = "Password must be at least 6 characters long";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0; // Return true if no errors
  };
  const handleRegister = async () => {
  if (!validateForm()) return;  // Validate form and return if invalid
  
  try {
    setBackendError('');  // Clear previous error message
    setIsRegistered(false);  // Ensure registration state is false

    // Send registration request
    const response = await axios.post('http://127.0.0.1:5000/api/register', {
      name, 
      email, 
      phone_number: phone, 
      age, 
      password
    });

    setIsRegistered(true);  // If successful, set registration state to true
  } catch (error) {
    console.error('Error Response:', error.response);  // Log error for debugging
    
    if (error.response) {
      // Server responded with an error
      if (error.response.data && error.response.data.error) {
        alert(error.response.data.error);  // Show the error message as a popup
        setBackendError(error.response.data.error);  // Set the error message from the backend
      } else {
        alert('An unknown error occurred. Please try again.');  // Show a fallback error popup
        setBackendError('An unknown error occurred. Please try again.');  // Fallback if no specific error message
      }
    } else if (error.request) {
      // No response was received (network error, server down, etc.)
      alert('No response from server. Please check your network connection.');
      setBackendError('No response from server. Please check your network connection.');
    } else {
      // Something else went wrong in the request setup
      alert('An unexpected error occurred. Please try again.');
      setBackendError('An unexpected error occurred. Please try again.');
    }
  }
};

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      {!isRegistered ? (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(6px)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            padding: '30px',
            maxWidth: '350px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>

          {/* Display Backend Error (if any) */}
          {backendError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {backendError}
            </Typography>
          )}

          {/* Name field */}
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="dense"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />

          {/* Email field */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />

          {/* Phone field */}
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            margin="dense"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="small"
            error={!!errors.phone}
            helperText={errors.phone}
            sx={{ mb: 2 }}
          />

          {/* Age field */}
          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            margin="dense"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            size="small"
            error={!!errors.age}
            helperText={errors.age}
            sx={{ mb: 2 }}
          />

          {/* Password field with visibility toggle */}
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Register button with reduced width */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 1.5,
              fontSize: '0.875rem',
              padding: '8px 0',
              width: '80%',
            }}
            onClick={handleRegister}
          >
            Register
          </Button>
        </Box>
      ) : (
        <Card sx={{ maxWidth: 350, p: 3, borderRadius: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Thank you for registering. You can now log in to your account.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, fontSize: '0.875rem', padding: '8px 0', width: '80%' }}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RegisterPage;
