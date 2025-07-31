import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:4000/api/auth/register', {
        username,
        email,
        password,
      });
      // Navigate to the login page after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="start-button">Register</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;