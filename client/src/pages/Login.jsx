import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });
      
      // Use the login function from context to save user data and token
      login(response.data.user, response.data.token);
      
      // Navigate to the dashboard after successful login
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    // ... your JSX for the login form remains the same
    <div className="app-container">
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="start-button">Login</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;