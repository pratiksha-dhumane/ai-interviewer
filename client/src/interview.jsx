import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeechRecognition } from './hooks/use-speech-recognition';

function Interview({ interviewData, onInterviewComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState(interviewData.questions);
  const { text, startListening, stopListening, isListening, setText } = useSpeechRecognition();

  const handleNextQuestion = async () => {
    stopListening();
    
    try {
      const currentQuestionText = completedQuestions[currentQuestionIndex].question;
      const response = await axios.post('http://localhost:4000/api/feedback/generate', {
        question: currentQuestionText,
        answer: text,
      });

      const { rating, feedback } = response.data;
      setLastFeedback(response.data);

      // Update the current question with the answer and feedback
      const updatedQuestions = [...completedQuestions];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        answer: text,
        rating,
        feedback,
      };
      setCompletedQuestions(updatedQuestions);

      // Move to the next question or end the interview
      if (currentQuestionIndex < completedQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setText('');
      } else {
        // End of interview, save the full data
        await axios.put(`http://localhost:4000/api/interviews/${interviewData._id}/complete`, {
          completedQuestions: updatedQuestions
        });
        alert("Interview complete and saved! Check your database.");
      }
      
    } catch (error) {
      console.error("Error getting feedback:", error);
      alert("Could not get feedback from the server.");
    }
  };

  return (
    <div className="interview-container">
      {lastFeedback && (
        <div className="feedback-card">
          <h4>Feedback on Previous Answer</h4>
          <p><strong>Rating:</strong> {lastFeedback.rating} / 10</p>
          <p><strong>Feedback:</strong> {lastFeedback.feedback}</p>
        </div>
      )}

      <div className="question-card">
        <h3>Question {currentQuestionIndex + 1} / {completedQuestions.length}</h3>
        <p className="question-text">
          {completedQuestions[currentQuestionIndex].question}
        </p>
      </div>

      <div className="answer-section">
        <textarea
          className="answer-textarea"
          value={text}
          readOnly
          placeholder="Your answer will appear here..."
        />
        <div className="controls">
          <button onClick={isListening ? stopListening : startListening} className="control-button">
            {isListening ? 'Stop Answering' : 'Start Answering'}
          </button>
          <button onClick={handleNextQuestion} className="control-button" disabled={isListening}>
            {currentQuestionIndex === completedQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interview;