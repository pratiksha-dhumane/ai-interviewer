import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function InterviewDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`http://localhost:4000/api/interviews/${id}`, config);
        setInterview(response.data);
      } catch (error) {
        console.error('Failed to fetch interview details', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInterview();
    }
  }, [id, token]);

  if (loading) return <p>Loading interview details...</p>;
  if (!interview) return <p>Interview not found.</p>;

  return (
    <div className="app-container">
      <div className="interview-container">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <h2>Interview Details</h2>
        <div className="interview-details">
          <p><strong>Job Position:</strong> {interview.jobPosition}</p>
          <p><strong>Experience:</strong> {interview.jobExperience} years</p>
        </div>
        {interview.questions.map((q, index) => (
          <div key={index} className="qa-feedback-block">
            <h4>Question {index + 1}</h4>
            <p className="question-text">{q.question}</p>
            <h5>Your Answer:</h5>
            <p className="answer-text">{q.answer || "No answer recorded."}</p>
            <div className="feedback-card">
              <p><strong>Rating:</strong> {q.rating} / 10</p>
              <p><strong>Feedback:</strong> {q.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewDetails;