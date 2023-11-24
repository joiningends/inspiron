import React, { useState, useEffect } from "react";
import "./Assessment.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssessment, fetchAssessments } from "../redux/Action";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const AssessmentPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const assessments = useSelector(state => state.assessments);

  useEffect(() => {
    dispatch(fetchAssessments()); // Fetch the therapist using the ID
  }, []);

  const assessment = assessments.find(assessment => assessment._id === id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  useEffect(() => {
    calculateTotalScore();
  }, [selectedOptions]);

  const calculateTotalScore = () => {
    let score = 0;

    selectedOptions.forEach((optionId, questionIndex) => {
      const question =
        assessment &&
        assessment.questions &&
        assessment.questions[questionIndex];
      const option =
        question &&
        question.options &&
        question.options.find(opt => opt._id === optionId);
      if (option && option.points) {
        score += option.points;
      }
    });

    setTotalScore(score);
  };

  const handleOptionSelect = optionId => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestionIndex] = optionId;
    setSelectedOptions(updatedOptions);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex - 1);
  };

  const handleFinish = () => {
    // Check if the current question has a selected option
    const selectedOption = selectedOptions[currentQuestionIndex];
    if (selectedOption) {
      // Finish the assessment or navigate to the next assessment if available
      if (
        currentQuestionIndex ===
        (assessment && assessment.questions && assessment.questions.length - 1)
      ) {
        // Last question, save the assessment name and total points in localStorage
        localStorage.setItem("assessment", assessment);
        localStorage.setItem("assessmentName", assessment.assessment_name);
        localStorage.setItem("totalPoints", totalScore.toString());
        localStorage.setItem("assessment", JSON.stringify(assessment));
      }
    }
  };

  const currentQuestion =
    assessment &&
    assessment.questions &&
    assessment.questions[currentQuestionIndex];
  const selectedOption = selectedOptions[currentQuestionIndex];

  const isLastQuestion =
    currentQuestionIndex ===
    (assessment && assessment.questions && assessment.questions.length - 1);

  if (!assessment || !currentQuestion) {
    return <div>Loading assessment...</div>; // or show an error message
  }

  // Calculate progress
  const progress =
    ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  return (
    <>
      <div className="assessment-container">
        <h1 className="assessment-title">{assessment.assessment_name}</h1>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <h2 className="question-number">{currentQuestionIndex + 1}</h2>
        <p className="question">
          {currentQuestion && currentQuestion.question}
        </p>
        <div className="options">
          {currentQuestion &&
            currentQuestion.options.map(option => (
              <div
                key={option._id}
                className={`option ${
                  selectedOption === option._id ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option._id)}
                style={{
                  backgroundColor:
                    selectedOption === option._id
                      ? "#68B545"
                      : "rgba(104, 181, 69, 0.15)",
                  height: "50px", // Adjust the height as needed
                  padding: "10px", // Adjust the padding as needed
                }}
              >
                {option.text}
              </div>
            ))}
        </div>

        <div className="navigation-buttons">
          {currentQuestionIndex !== 0 && (
            <button
              className="previous-button"
              onClick={handlePreviousQuestion}
              style={{
                border: "1.5px solid #D67449",
                color: "#D67449",
                backgroundColor: "#FFFFFF",
                width: "7rem",
              }}
            >
              Previous
            </button>
          )}
          {!isLastQuestion && (
            <button
              disabled={!selectedOption}
              onClick={handleNextQuestion}
              style={{
                background:
                  "linear-gradient(90deg, #D67449 10.9%, #5179BD 100%)",
                color: "#FFFFFF",
                width: "7rem",
                border: "none",
              }}
            >
              Next
            </button>
          )}
          {isLastQuestion && selectedOption && (
            <button
              className="finish-button"
              onClick={handleFinish}
              style={{
                background: "#D67449",
                width: "7rem",
              }}
            >
              <Link
                to={`/result`}
                style={{ color: "#ffffff", textDecoration: "none" }}
              >
                Finish
              </Link>
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AssessmentPage;
