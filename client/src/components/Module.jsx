import React, { useState, useEffect } from 'react';
import '../styles/courseLearn.css';
import { Popup } from './Popup';
import { Feedback } from './Feedback';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import axios from 'axios';

export const Module = ({
  userId,
  courseId,
  moduleNumber,
  subModuleNumber,
  title,
  videoUrl,
  description,
  questions,
  onProgressUpdated
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState({});
  const [popup, setPopup] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedAnswers({});
    setResults({});
  }, [moduleNumber, subModuleNumber]);

  const showPopup = (message, color) => {
    setPopup({ message, color });
    setTimeout(() => setPopup(null), 4000);
  };

  const handleOptionChange = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const validateAnswers = async () => {
    const newResults = {};
    questions.forEach((question, idx) => {
      newResults[idx] = selectedAnswers[idx] === question.correctAnswer;
    });
    setResults(newResults);

    const allCorrect = questions.every(
      (question, idx) => selectedAnswers[idx] === question.correctAnswer
    );

    if (allCorrect) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/${courseId}/progress/${moduleNumber}/${subModuleNumber}`,
          {}, // body payload
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        const data = response.data;

        onProgressUpdated?.();

        if (data.UpdatedPercentComplete === 100) {
          setShowFeedback(true);
          return;
        }

        showPopup(`Progress updated: ${data.UpdatedPercentComplete}% complete`, {
          background: "#d4edda",
          border: "#c3e6cb",
          text: "#155724"
        });

      } catch (err) {
        console.error('Error updating progress:', err);
        const message = err.response?.data?.message || 'Failed to update progress';

        showPopup(message, {
          background: "#fdecea",
          border: "#f5c6cb",
          text: "#a71d2a"
        });
      }
    } else {
      showPopup("Some answers are incorrect.\nPlease review and try again.", {
        background: "#fdecea",
        border: "#f5c6cb",
        text: "#a71d2a"
      });
    }

  };

  return (
    <>
      <div className="module-container">
        <h1 className="module-title">{title}</h1>

        <div className="module-video-wrapper">
          <iframe
            src={videoUrl}
            title="Module Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="module-video"
          />
        </div>

        <h2>Description</h2>
        <p className="module-description">{description}</p>

        <h2>Quiz</h2>
        <form className="module-quiz-form">
          {questions.map((question, idx) => (
            <div key={question._id} className="quiz-question-card">
              <p className="module-quiz-question-text">{question.questionText}</p>
              <div className="module-quiz-options">
                {question.options.map((option, oidx) => (
                  <label
                    key={oidx}
                    className={`module-quiz-option-label ${selectedAnswers[idx] === option ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={option}
                      checked={selectedAnswers[idx] === option}
                      onChange={() => handleOptionChange(idx, option)}
                      className="module-quiz-option-input"
                    />
                    <span className="module-custom-radio" />
                    {option}
                  </label>
                ))}
              </div>

              {results.hasOwnProperty(idx) && (
                <p className={`module-quiz-feedback ${results[idx] ? 'correct' : 'incorrect'}`}>
                  {results[idx]
                    ? '✔ Correct!'
                    : `✘ Incorrect! Correct answer: ${question.correctAnswer}`}
                </p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={validateAnswers}
            className="module-quiz-submit-btn"
          >
            Submit Answers
          </button>
        </form>

        {popup && <Popup message={popup.message} color={popup.color} />}
      </div>

      {/* Portal renders feedback on top of everything */}
      {showFeedback &&
        ReactDOM.createPortal(
          <Feedback userId={userId} courseId={courseId} />,
          document.body
        )}
    </>
  );
};
