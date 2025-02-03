import React, { useState, useRef, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import RecordingControls from './RecordingControls';
import UserActions from './UserActions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { useGlobalContext } from '../GlobalContext';

const Navbar = ({ isExamStarted }) => {
  const { state, dispatch } = useGlobalContext();

  const { user_email, token } = state;
  const isAuthenticated = !!token;
  const navigate = useNavigate();
  const [webcamChunks, setWebcamChunks] = useState([]);
  const [screenChunks, setScreenChunks] = useState([]);
  const webcamRecorderRef = useRef(null);
  const screenRecorderRef = useRef(null);
  const [totalTime, setTotalTime] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(0); 

  const tabSwitchCountRef = useRef(0); 



  useEffect(() => {


    
    
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/questions');
        const numberOfQuestions = response.data.questions.length;
        const calculatedTime = numberOfQuestions * 45; 
        setTotalTime(calculatedTime);
        setTimeLeft(calculatedTime); 
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestions();

  
  }, []);





  
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 && isExamStarted) {
      submitExam();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

   
  

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const submitExam = async () => {
    // Stop the recording
    stopRecording();

    // Extract answers from localStorage
    const answers = JSON.parse(localStorage.getItem('answers'));

    // Retrieve user email from localStorage
    const userEmail = user_email;  

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
  };;

  const stopRecording = async () => {
    // Stop the webcam recording
    if (webcamRecorderRef.current) {
      webcamRecorderRef.current.stop(); 
      // Stop all webcam media tracks (audio and video)
      if (webcamRecorderRef.current.stream) {
        webcamRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    }
  
    // Stop the screen recording
    if (screenRecorderRef.current) {
      screenRecorderRef.current.stop(); 
      // Stop all screen media tracks (video)
      if (screenRecorderRef.current.stream) {
        screenRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    }
  
    // Retrieve user email from localStorage
    const userEmail = localStorage.getItem('user_email');
  
    let webcamUploadSuccess = false;
    let screenUploadSuccess = false;
  
    // Upload the webcam recording
    if (webcamChunks.length > 0) {
      const blob = new Blob(webcamChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('user_email', userEmail);
      formData.append('webcamRecording', blob, 'webcam_with_audio.webm');
  
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/upload-webcam', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Webcam recording uploaded successfully:', response.data);
        webcamUploadSuccess = true;
      } catch (error) {
        console.error('Failed to upload webcam recording:', error);
      }
    } else {
      webcamUploadSuccess = true; // No webcam recording, so consider it successful
    }
  
    // Upload the screen recording
    if (screenChunks.length > 0) {
      const blob = new Blob(screenChunks, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('user_email', userEmail);
      formData.append('screenRecording', blob, 'screen_recording.webm');
  
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/upload-screen', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Screen recording uploaded successfully:', response.data);
        screenUploadSuccess = true;
      } catch (error) {
        console.error('Failed to upload screen recording:', error);
      }
    } else {
      screenUploadSuccess = true; // No screen recording, so consider it successful
    }
  
    // If both uploads are successful, clear localStorage and cookies, and redirect to the results page
    if (webcamUploadSuccess && screenUploadSuccess) {
      // Clear localStorage
      dispatch({ type: 'LOGOUT' })
      localStorage.removeItem('answers'); 
     
      localStorage.removeItem('timeLeft'); // Clear saved timer state
  
      // Clear cookies (assuming your app is setting cookies, otherwise you can omit this)
      document.cookie.split(';').forEach((cookie) => {
        const [name] = cookie.split('=');
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
  
      // // Navigate to results page after uploads are successful
      navigate('/results'); 
      console.log('exam has been done successfully')
    }
  };
  

  


  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  
  useEffect(() => {
    let blurTimeout;

    const handleBlur = () => {
      tabSwitchCountRef.current += 1;

      if (tabSwitchCountRef.current >= 3) {
        alert('Exam auto-submitting due to multiple tab switches.');
        submitExam();
      } else {
        alert(
          `Warning: Tab switched ${tabSwitchCountRef.current}/3 times. Auto-submit after 3.`
        );
      }
    };

    if (isExamStarted) {
      blurTimeout = setTimeout(() => {
        console.log('Blur listener activated.');
        window.addEventListener('blur', handleBlur);
      }, 5000);
    }

    return () => {
      clearTimeout(blurTimeout);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isExamStarted]);

  return (
    <div
    className="relative bg-blue-600 text-white rounded-xl p-4 shadow-lg flex justify-between items-center"
    style={{
      width: '99%',
      height: '100px',
      maxHeight: '110px',
      margin: '0 auto',
      display: 'flex',
      position: 'relative',
    }}
  >
    {/* Left Section: Logo */}
    <Box className="flex items-center" sx={{ position: 'absolute', left: '0', ml: 4 }}>
      <img
        src={logo} // Replace with the actual path to your logo
        alt="Logo"
        style={{
          width: '100px', // Adjust width as needed
          height: '100px', // Adjust height as needed
          objectFit: 'contain',
        }}
      />
      <Typography variant="h6" sx={{ ml: 2 }}>
        AI-Based Proctoring System
      </Typography>
    </Box>
  
    {/* Center Section: Recording Controls and Timer */}
    {isAuthenticated && isExamStarted && (
      <Box
        className="flex items-center"
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
      <RecordingControls
  isAuthenticated={isAuthenticated}
  isExamStarted={isExamStarted}
  setWebcamChunks={setWebcamChunks}
  setScreenChunks={setScreenChunks}
  webcamRecorderRef={webcamRecorderRef}
  screenRecorderRef={screenRecorderRef}
  submitExam={submitExam} // Pass the submitExam function
/>
        <Box sx={{ ml: 4 }}>
          <Typography variant="h6">{formatTime(timeLeft)}</Typography>
        </Box>
      </Box>
    )}
  
    {/* Right Section: User Actions */}
    {(
      <Box sx={{ position: 'absolute', right: '0', mr: 4 }}>
        <UserActions
          isAuthenticated={isAuthenticated}
          isExamStarted={isExamStarted}
          handleLogout={handleLogout}
          stopRecording={stopRecording}
        />
      </Box>
    )}
  </div>
  
  );
};

export default Navbar;
