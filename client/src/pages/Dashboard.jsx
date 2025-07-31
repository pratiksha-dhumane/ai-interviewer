import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Interview from '../Interview';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [jobPosition, setJobPosition] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [interviewData, setInterviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:4000/api/interviews/history', config);
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };

    if (token) {
      fetchHistory();
    }
  }, [token]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('http://localhost:4000/api/interviews/start', {
        jobPosition,
        jobExperience,
      }, config);
      setInterviewData(response.data);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (interviewData) {
    return <Interview interviewData={interviewData} />;
  }

  return (
    <div className="app-container">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="logout-button">Logout</button>
        </header>

        <div className="form-container" style={{ margin: '0 auto 40px auto' }}>
          <h1>MERN AI Interviewer</h1>
          <p>Enter details to start a new mock interview.</p>
          <form onSubmit={handleStartInterview}>
            {/* ... form JSX remains the same ... */}
            <div className="input-group">
              <label htmlFor="jobPosition">Job Position</label>
              <input id="jobPosition" type="text" value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="jobExperience">Years of Experience</label>
              <input id="jobExperience" type="number" value={jobExperience} onChange={(e) => setJobExperience(e.target.value)} required />
            </div>
            <button type="submit" className="start-button" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Start Interview'}
            </button>
          </form>
        </div>

        <div className="history-container">
          <h2>Interview History</h2>
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map((interview) => (
              <Link to={`/interview/${interview._id}`} key={interview._id} className="history-link">
                <li className="history-item">
                  <h3>{interview.jobPosition}</h3>
                  <p>Experience: {interview.jobExperience} years</p>
                  <p>Date: {new Date(interview.createdAt).toLocaleDateString()}</p>
                </li>
              </Link>
              ))}
            </ul>
          ) : (
            <p>You have no past interviews.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;