import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {logo, OnlineExamImage} from '../assets'; // Adjust path as per your folder structure

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect if token already exists
    if (localStorage.getItem('token')) {
      navigate('/instructions', { replace: true });
    }
  }, [navigate]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setErrorMessage('');
    setEmailError(false);
    setPasswordError(false);

    if (!email || !password) {
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError(true);
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user_email', email);

      // Navigate to the instructions page after successful login
      navigate('/instructions', { replace: true });
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '90vh',
      backgroundColor: '#f4f6f8',
      p: 3,
      gap: { xs: 3, md: 6 }, // Add spacing between left and right boxes
    }}
  >
    {/* Left side - Logo and images */}
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(6px)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        p: 6,
        maxWidth: { xs: '100%', md: '50%' }, // Responsive max width
        mb: { xs: 3, md: 0 },
      }}
    >
      <div className="flex flex-row items-center justify-between w-full">
        {/* CUH Logo on the left */}
        <Box
          sx={{
            width: '150px',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logo}
            alt="CUH Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain', // Ensures the image scales correctly
            }}
          />
        </Box>
  
        {/* Online Examination image on the right */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <img
            src={OnlineExamImage}
            alt="Online Examination"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '60vh',
              objectFit: 'contain', // Ensures the image scales correctly
            }}
          />
        </Box>
      </div>
  
      <Typography variant="h5" sx={{ mt: 2 }}>
        Online Proctoring System
      </Typography>
      <Typography variant="body2">
        Built by the Department of Computer Science and Engineering, Central University of Haryana
      </Typography>
    </Box>
  
    {/* Right side - Login form */}
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(6px)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        p: 4,
        maxWidth: { xs: '100%', md: '30%' }, // Reduced max width for larger screens
        width: { xs: '90%', sm: '70%', md: '30%' }, // Add width for finer control
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
  
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="dense"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        error={emailError}
        helperText={emailError ? 'Invalid email address.' : ''}
        sx={{ mb: 2 }}
      />
  
      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        margin="dense"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        size="small"
        error={passwordError}
        helperText={passwordError ? 'Password is required.' : ''}
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
  
      {errorMessage && (
        <Typography color="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}
  
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 1.5, fontSize: '0.875rem', padding: '8px 0', width: '80%' }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>
  
      <Typography variant="body2" sx={{ mt: 2 }}>
        New user?{' '}
        <Link href="/register" color="primary">
          Register now
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Admin?{' '}
        <Link href="/adminlogin" color="primary">
          Admin Login
        </Link>
      </Typography>
    </Box>
  </Box>


  );
};

export default LoginPage;
