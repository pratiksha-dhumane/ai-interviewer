import { useState } from 'react';
import axios from 'axios';
import Interview from './interview.jsx';
import './App.css';

function App() {
  const [jobPosition, setJobPosition] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [interviewData, setInterviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/interviews/start', {
        jobPosition,
        jobExperience,
      });
      // This line is crucial - it saves the whole object, including the ID
      setInterviewData(response.data); 
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Check the console for errors.');
    } finally {
      setIsLoading(false);
    }
  };

  if (interviewData) {
    return <Interview interviewData={interviewData} />;
  }

  return (
    // ... the rest of your form JSX ...
    <div className="app-container">
      <div className="form-container">
        <h1>MERN AI Interviewer</h1>
        <p>Enter details below to start your mock interview.</p>
        <form onSubmit={handleStartInterview}>
          <div className="input-group">
            <label htmlFor="jobPosition">Job Position</label>
            <input
              id="jobPosition"
              type="text"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              placeholder="E.g., React Developer"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="jobExperience">Years of Experience</label>
            <input
              id="jobExperience"
              type="number"
              value={jobExperience}
              onChange={(e) => setJobExperience(e.target.value)}
              placeholder="E.g., 5"
              required
            />
          </div>
          <button type="submit" className="start-button" disabled={isLoading}>
            {isLoading ? 'Generating Questions...' : 'Start Interview'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;