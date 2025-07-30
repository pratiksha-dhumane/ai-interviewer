import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobPosition, setJobPosition] = useState('');
  const [jobExperience, setJobExperience] = useState('');

  const handleStartInterview = async (e) => {
  e.preventDefault();
  console.log("Sending data to backend:", { jobPosition, jobExperience });

  try {
    // Send a POST request to our backend
    const response = await axios.post('http://localhost:4000/api/interviews/start', {
      jobPosition,
      jobExperience,
    });

    console.log('Backend response:', response.data);
    alert('Interview created successfully! Check the console for the response.');

    // In the future, we will redirect to the interview page here

  } catch (error) {
    console.error('Error starting interview:', error);
    alert('Failed to start interview. Check the console for errors.');
  }
};

  return (
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
          <button type="submit" className="start-button">Start Interview</button>
        </form>
      </div>
    </div>
  );
}

export default App;