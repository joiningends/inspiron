import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssessmentCreatePage.css";
import { AiOutlineArrowLeft, AiOutlinePlus } from "react-icons/ai";
import { createAssessment } from "../../redux/Action";
import { margin } from "@mui/system";

function AssessmentCreatePage() {
  const [assessmentName, setAssessmentName] = useState("");
  const [image, setImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [severities, setSeverities] = useState([
    {
      name: "",
      minScore: "",
      maxScore: "",
      expertise: "",
      expertiseList: [],
    },
    {
      name: "",
      minScore: "",
      maxScore: "",
      expertise: "",
      expertiseList: [],
    },
    {
      name: "",
      minScore: "",
      maxScore: "",
      expertise: "",
      expertiseList: [],
    },
  ]);
  const [expertiseList, setExpertiseList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/expetises")
      .then(response => {
        setExpertiseList(response.data);
      })
      .catch(error => {
        console.error("Error fetching expertise list:", error);
      });
  }, []); // Empty dependency array to fetch data only once when the component mounts

  const handleAssessmentNameChange = event => {
    setAssessmentName(event.target.value);
  };

  const handleGoBack = () => {
    window.location.href = "admin-Create-Assessment";
  };

  const handleImageChange = event => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleQuestionAdd = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: [
          { text: "", points: "" },
          { text: "", points: "" },
          { text: "", points: "" },
          { text: "", points: "" },
        ],
      },
    ]);
  };

  const handleQuestionChange = (event, questionIndex) => {
    const { value } = event.target;
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].question = value;
      return updatedQuestions;
    });
  };

  const handleOptionChange = (event, questionIndex, optionIndex, field) => {
    const { value } = event.target;
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options[optionIndex][field] =
        field === "points" ? parseInt(value) : value;
      return updatedQuestions;
    });
  };

  const handleSeverityChange = (event, severityIndex, field) => {
    const { value } = event.target;
    setSeverities(prevSeverities => {
      const updatedSeverities = [...prevSeverities];
      updatedSeverities[severityIndex][field] = value;
      return updatedSeverities;
    });
  };

  const handleExpertiseChange = (event, severityIndex, expertiseValue) => {
    const { checked } = event.target;
    setSeverities(prevSeverities => {
      const updatedSeverities = [...prevSeverities];
      if (checked) {
        updatedSeverities[severityIndex].expertiseList.push(expertiseValue);
      } else {
        const index =
          updatedSeverities[severityIndex].expertiseList.indexOf(
            expertiseValue
          );
        if (index !== -1) {
          updatedSeverities[severityIndex].expertiseList.splice(index, 1);
        }
      }
      return updatedSeverities;
    });
  };

  const handleExpertiseAdd = severityIndex => {
    setSeverities(prevSeverities => {
      const updatedSeverities = [...prevSeverities];
      const expertise = updatedSeverities[severityIndex].expertise;
      if (expertise) {
        updatedSeverities[severityIndex].expertiseList.push(expertise);
        updatedSeverities[severityIndex].expertise = "";
      }
      return updatedSeverities;
    });
  };

  const handleExpertiseRemove = (severityIndex, index) => {
    setSeverities(prevSeverities => {
      const updatedSeverities = [...prevSeverities];
      updatedSeverities[severityIndex].expertiseList.splice(index, 1);
      return updatedSeverities;
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const questionsData = questions.map(question => ({
        question: question.question,
        options: question.options.map(option => ({
          text: option.text,
          points: parseInt(option.points), // Ensure points are parsed as integers
        })),
      }));

      // Get low, medium, and high severities data
      const assessmentData = {
        assessment_name: assessmentName,
        image: image ? image.name : "",
        questions: questionsData,
        low: {
          type: {
            name: "low",
            min: parseInt(severities[0].minScore),
            max: parseInt(severities[0].maxScore),
            expertise: severities[0].expertiseList,
          },
        },
        medium: {
          type: {
            name: "medium",
            min: parseInt(severities[1].minScore),
            max: parseInt(severities[1].maxScore),
            expertise: severities[1].expertiseList,
          },
        },
        high: {
          type: {
            name: "high",
            min: parseInt(severities[2].minScore),
            max: parseInt(severities[2].maxScore),
            expertise: severities[2].expertiseList,
          },
        },

        // Add other fields here as needed
      };

      console.log(assessmentData);

      // Send assessment data to the backend API
      const response = await axios.post(
        "http://localhost:4000/api/v1/assessments",
        assessmentData
      );

      console.log("Assessment created:", response.data);

      // Optionally, you can navigate to another page upon successful assessment creation
      // window.location.href = "path-to-assessment-list-page";
    } catch (error) {
      console.error("Error creating assessment:", error);
    }
  };

  // Perform submission logic with assessmentName, image, questions, severities

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <button
        className="back-button"
        onClick={handleGoBack}
        style={{ marginBottom: "20px", fontSize: "14px" }}
      >
        <AiOutlineArrowLeft className="back-icon" />
        Go Back
      </button>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Create Assessment
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="assessmentName"
            style={{
              marginRight: "10px",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555555",
            }}
          >
            Name of the Assessment:
          </label>
          <input
            type="text"
            id="assessmentName"
            value={assessmentName}
            onChange={handleAssessmentNameChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D67449",
              fontSize: "14px",
              color: "#555555",
              transition: "all 0.3s ease-out",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="image"
            style={{
              marginRight: "10px",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555555",
            }}
          >
            Image of the Assessment:
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D67449",
              fontSize: "14px",
              color: "#555555",
              transition: "all 0.3s ease-out",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555555",
            }}
          >
            Questions:
          </label>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} style={{ marginBottom: "15px" }}>
              <input
                type="text"
                value={question.question}
                onChange={event => handleQuestionChange(event, questionIndex)}
                placeholder="Enter question"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #D67449",
                  fontSize: "14px",
                  color: "#555555",
                  transition: "all 0.3s ease-out",
                }}
              />
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={option.text}
                    onChange={event =>
                      handleOptionChange(
                        event,
                        questionIndex,
                        optionIndex,
                        "text"
                      )
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #D67449",
                      fontSize: "14px",
                      color: "#555555",
                      transition: "all 0.3s ease-out",
                    }}
                  />
                  <input
                    type="number"
                    value={option.points}
                    onChange={event =>
                      handleOptionChange(
                        event,
                        questionIndex,
                        optionIndex,
                        "points"
                      )
                    }
                    placeholder="Points"
                    required
                    style={{
                      width: "80px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #D67449",
                      fontSize: "14px",
                      color: "#555555",
                      transition: "all 0.3s ease-out",
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            className="add-question-button"
            onClick={handleQuestionAdd}
            style={{
              backgroundColor: "#D67449",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.3s ease-out",
            }}
          >
            <AiOutlinePlus className="add-question-icon" />
            Add Question
          </button>
        </div>
        {severities.map((severity, severityIndex) => (
          <div
            key={severityIndex}
            style={{ marginBottom: "20px", paddingBottom: "20px" }}
          >
            <h4 style={{ marginBottom: "10px", fontSize: "1.5rem" }}>
              Level of Severity {severityIndex + 1}:
            </h4>
            <div
              className="severity-container"
              style={{ marginBottom: "1rem", paddingBottom: "20px" }}
            >
              <div style={{ display: "flex" }}>
                <label
                  htmlFor={`severityName-${severityIndex}`}
                  style={{
                    marginRight: "10px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#555555",
                  }}
                >
                  Name:
                </label>
                <input
                  type="text"
                  id={`severityName-${severityIndex}`}
                  name="name"
                  value={severity.name}
                  onChange={event =>
                    handleSeverityChange(event, severityIndex, "name")
                  }
                  required
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #D67449",
                    fontSize: "14px",
                    color: "#555555",
                    transition: "all 0.3s ease-out",
                    width: "10rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", marginBottom: "15px" }}>
                <label
                  htmlFor={`minScore-${severityIndex}`}
                  style={{
                    marginRight: "10px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#555555",
                  }}
                >
                  Min Score:
                </label>
                <input
                  type="number"
                  id={`minScore-${severityIndex}`}
                  name="minScore"
                  value={severity.minScore}
                  onChange={event =>
                    handleSeverityChange(event, severityIndex, "minScore")
                  }
                  required
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #D67449",
                    fontSize: "14px",
                    color: "#555555",
                    transition: "all 0.3s ease-out",
                    width: "3rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", marginBottom: "15px" }}>
                <label
                  htmlFor={`maxScore-${severityIndex}`}
                  style={{
                    marginRight: "10px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#555555",
                  }}
                >
                  Max Score:
                </label>
                <input
                  type="number"
                  id={`maxScore-${severityIndex}`}
                  name="maxScore"
                  value={severity.maxScore}
                  onChange={event =>
                    handleSeverityChange(event, severityIndex, "maxScore")
                  }
                  required
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #D67449",
                    fontSize: "14px",
                    color: "#555555",
                    transition: "all 0.3s ease-out",
                    width: "3rem",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor={`expertise-${severityIndex}`}
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#555555",
                  }}
                >
                  Expertise:
                </label>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  {expertiseList.map(expertise => (
                    <label
                      key={expertise._id}
                      htmlFor={`expertise-option-${expertise._id}-${severityIndex}`}
                      style={{ fontSize: "1rem", margin: "1rem" }}
                    >
                      <input
                        type="checkbox"
                        id={`expertise-option-${expertise._id}-${severityIndex}`}
                        value={expertise.type[0]}
                        checked={severity.expertiseList.includes(
                          expertise.type[0]
                        )}
                        onChange={event =>
                          handleExpertiseChange(
                            event,
                            severityIndex,
                            expertise.type[0]
                          )
                        }
                        style={{ marginRight: "5px" }}
                      />
                      {expertise.type[0]}
                    </label>
                  ))}
                </div>
                {/* <button
                  type="button"
                  className="add-expertise-button"
                  onClick={() => handleExpertiseAdd(severityIndex)}
                  style={{
                    backgroundColor: "#D67449",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "background-color 0.3s ease-out",
                  }}
                >
                  Add Expertise
                </button> */}
              </div>
            </div>
          </div>
        ))}
        <button
          type="submit"
          style={{
            backgroundColor: "#D67449",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            transition: "background-color 0.3s ease-out",
          }}
        >
          Create Assessment
        </button>
      </form>
    </div>
  );
}

export default AssessmentCreatePage;
