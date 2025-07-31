import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InterviewDetails from './pages/InterviewDetails'; // Import this
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      {/* Add this new route */}
      <Route path="/interview/:id" element={user ? <InterviewDetails /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;