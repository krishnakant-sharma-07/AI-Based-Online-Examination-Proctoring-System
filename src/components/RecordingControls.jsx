import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';

const RecordingControls = ({

  isExamStarted,
  setWebcamChunks,
  setScreenChunks,
  webcamRecorderRef,
  screenRecorderRef,
  submitExam,
}) => {
  const webcamRef = useRef(null);
  const screenRef = useRef(null);
  const recordingStartedRef = useRef(false); // A flag to prevent double access
  const tabSwitchCountRef = useRef(0); // Keep track of tab switches
  const [warningMessage, setWarningMessage] = useState(''); // Warning message for tab switches
  const isAuthenticated = !!token;

  const startRecording = () => {
    // Constraints for 720p video
    const videoConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: true,
    };

    // Start webcam recording
    navigator.mediaDevices.getUserMedia(videoConstraints)
      .then((stream) => {
        if (!stream || stream.getVideoTracks().length === 0) {
          console.error('No video tracks available in webcam stream.');
          alert('Webcam input is invalid. The exam will now be auto-submitted.');
          submitExam(); // Auto-submit if webcam is invalid
          return;
        }

        console.log('Webcam access granted.');
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
        const webcamRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        webcamRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) setWebcamChunks((prev) => [...prev, e.data]);
        };
        webcamRecorder.start(1000); // Collect data every second
        webcamRecorderRef.current = webcamRecorder;

        // Handle webcam stop event
        stream.getVideoTracks()[0].onended = () => {
          alert('Webcam stopped. The exam will now be auto-submitted.');
          submitExam(); // Auto-submit if webcam is stopped
        };
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
        alert('Failed to access webcam. The exam will now be auto-submitted.');
        submitExam(); // Auto-submit if webcam access fails
      });

    // Start screen recording
    navigator.mediaDevices.getDisplayMedia({
      video: true,
    })
      .then((stream) => {
        const videoTrack = stream.getVideoTracks()[0];
        

        console.log('Entire screen sharing confirmed.');
        if (screenRef.current) {
          screenRef.current.srcObject = stream;
        }
        const screenRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        screenRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) setScreenChunks((prev) => [...prev, e.data]);
        };
        screenRecorder.start(1000); // Collect data every second
        screenRecorderRef.current = screenRecorder;

        // Handle screen sharing stop event
        stream.getVideoTracks()[0].onended = () => {
          alert('Screen sharing stopped. The exam will now be auto-submitted.');
          submitExam(); // Auto-submit if screen sharing is stopped
        };
      })
      .catch((err) => {
        console.error('Error accessing screen sharing:', err);
        alert('Failed to access screen sharing. The exam will now be auto-submitted.');
        submitExam(); // Auto-submit if screen sharing fails
      });
  };


  useEffect(() => {
    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Prevent double access by ensuring we only start recording once
    if (isExamStarted) {
      startRecording();
      recordingStartedRef.current = true;
    }

    return () => {
   
      if (webcamRecorderRef.current) webcamRecorderRef.current.stop();
      if (screenRecorderRef.current) screenRecorderRef.current.stop();
    };
  }, [isExamStarted]);

  return (
    <div className="flex gap-4 items-center">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden w-32 h-24">
        <video ref={webcamRef} autoPlay muted className="w-full h-full object-cover" />
      </div>
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden w-32 h-24">
        <video ref={screenRef} autoPlay muted className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
        <Typography variant="body2">Recording</Typography>
      </div>
      {warningMessage && (
        <div className="text-red-600 mt-2">
          <Typography variant="body2">{warningMessage}</Typography>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
