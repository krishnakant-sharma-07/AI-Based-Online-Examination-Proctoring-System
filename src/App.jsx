import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import QuestionPage from './pages/QuestionPage';
import InstructionsPage from './pages/InstructionsPage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';
import { useGlobalContext } from './GlobalContext';

const App = () => {
  const { state, dispatch } = useGlobalContext();
  const [isExamStarted, setExamStarted] = useState(false); // State to manage exam status
  const [isExamOver, setExamOver] = useState(false); // Manage exam over state
  const navigate = useNavigate(); // React Router's navigate function

  const { token, role } = state; // Extract token and role from global context
  const isAuthenticated = !!token; // Check if user is authenticated
  const isAdmin = role === 'admin'; // Check if the user has an admin role

  useEffect(() => {
    // Redirect to instructions if authenticated and on the login page
    if (isAuthenticated && window.location.pathname === '/login') {
      navigate('/instructions', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Redirect to results page when the exam is over
    if (isExamOver && window.location.pathname !== '/results' && isAuthenticated) {
      navigate('/results', { replace: true });
    }
  }, [isExamOver, navigate, isAuthenticated]);

  return (
    <div className="w-full h-full overflow-x-hidden">
      {/* Navbar */}
      <Navbar isExamStarted={isExamStarted} isAuthenticated={isAuthenticated} />

      {/* Routes */}
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/instructions" replace /> : <LoginPage dispatch={dispatch} />
          }
        />

        {/* Admin Login Route */}
        <Route
          path="/adminlogin"
          element={
            isAuthenticated && isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLoginPage dispatch={dispatch} />
            )
          }
        />

        {/* Register Route */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Instructions Route */}
        <Route
          path="/instructions"
          element={
            isAuthenticated ? (
              <InstructionsPage
                setExamStarted={setExamStarted}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Exam Route */}
        <Route
          path="/exam"
          element={
            isAuthenticated && isExamStarted ? (
              <QuestionPage setExamOver={setExamOver} />
            ) : (
              <Navigate to="/instructions" replace />
            )
          }
        />

        {/* Result Route */}
        <Route path="/results" element={<ResultPage />} />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? (
              <AdminPage />
            ) : (
              <Navigate to="/adminlogin" replace />
            )
          }
        />

        {/* Redirect any other route to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
