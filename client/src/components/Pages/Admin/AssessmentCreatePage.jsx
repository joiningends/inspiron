import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AssessmentCreatePage.css";
import { AiOutlineArrowLeft, AiOutlinePlus } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AssessmentCreatePage() {
  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentSummary, setAssessmentSummary] = useState("");
  const [image, setImage] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [severities, setSeverities] = useState([
    {
      name: "",
      minScore: "",
      maxScore: "",
      expertiseList: [], // Initialize an empty array to store selected expertise
    },
    {
      name: "",
      minScore: "",
      maxScore: "",
      expertiseList: [], // Initialize an empty array to store selected expertise
    },
    {
      name: "",
      minScore: "",
      maxScore: "",
      expertiseList: [], // Initialize an empty array to store selected expertise
    },
  ]);
  const [expertiseList, setExpertiseList] = useState([]);
  console.log(expertiseList);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/expetises`)
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

  const handleAssessmentSummaryChange = event => {
    setAssessmentSummary(event.target.value);
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

  const handleExpertiseChange = (event, severityIndex, expertiseId) => {
    const { checked } = event.target;

    setSeverities(prevSeverities => {
      const updatedSeverities = prevSeverities.map((severity, index) => {
        if (index === severityIndex) {
          // If the current severity is being updated
          if (checked && !severity.expertiseList.includes(expertiseId)) {
            // If the expertise is not already selected for this level, add it
            return {
              ...severity,
              expertiseList: [...severity.expertiseList, expertiseId],
            };
          } else if (!checked) {
            // If the expertise is already selected for this level, remove it
            return {
              ...severity,
              expertiseList: severity.expertiseList.filter(
                expertise => expertise !== expertiseId
              ),
            };
          }
        }
        return severity;
      });

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
        summary: assessmentSummary,
        image: image ? image.name : "",
        questions: questionsData,
        high: {
          min: parseInt(severities[2].minScore),
          max: parseInt(severities[2].maxScore),
          expertise: severities[2].expertiseList,
          serverityname: ["Severe"],
        },
        low: {
          min: parseInt(severities[0].minScore),
          max: parseInt(severities[0].maxScore),
          expertise: severities[0].expertiseList,
          serverityname: ["Severe"],
        },
        medium: {
          min: parseInt(severities[1].minScore),
          max: parseInt(severities[1].maxScore),
          expertise: severities[1].expertiseList,
          serverityname: ["Severe"],
        },
      };
      console.log(assessmentData);
      // Send assessment data to the backend API
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/assessments`,
        assessmentData
      );

      const formData = new FormData();
      formData.append("image", image);
      const updateResponse = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/assessments/${response.data.assessment._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(image);
      console.log(updateResponse);

      console.log("Assessment created:", response.data.assessment._id);

      toast.success("Assessment Added Successfully", {
        style: {
          fontSize: "14px", // Adjust the font size here
        },
      });

      setTimeout(() => {
        window.location.href = "/admin-Create-Assessment";
      }, 3000);
      // Optionally, you can navigate to another page upon successful assessment creation
      window.location.href = "/admin-Create-Assessment";
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast.error("Failed to Add Assessment", {
        style: {
          fontSize: "14px", // Adjust the font size here
        },
      });
      setTimeout(() => {
        window.location.href = "/admin-Create-Assessment";
      }, 3000);
    }
  };

  // Perform submission logic with assessmentName, image, questions, severities

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <ToastContainer />
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
            htmlFor="assessmentSummary"
            style={{
              marginRight: "10px",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555555",
            }}
          >
            Assessment Summary:
          </label>
          <input
            type="text"
            id="assessmentName"
            value={assessmentSummary}
            onChange={handleAssessmentSummaryChange}
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
            style={{
              marginBottom: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid #EAEAEA",
            }}
          >
            <h4 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
              Level of Severity {severityIndex + 1}:
            </h4>
            <div
              className="severity-container"
              style={{
                marginBottom: "1rem",
                paddingBottom: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", marginBottom: "15px" }}>
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <label
                    htmlFor={`severityName-${severityIndex}`}
                    style={{
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
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #D67449",
                      fontSize: "14px",
                      color: "#555555",
                      transition: "all 0.3s ease-out",
                      width: "15rem",
                    }}
                  />
                </div>
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <label
                    htmlFor={`minScore-${severityIndex}`}
                    style={{
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
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #D67449",
                      fontSize: "14px",
                      color: "#555555",
                      transition: "all 0.3s ease-out",
                      width: "9rem",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor={`maxScore-${severityIndex}`}
                    style={{
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
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #D67449",
                      fontSize: "14px",
                      color: "#555555",
                      transition: "all 0.3s ease-out",
                      width: "9rem",
                    }}
                  />
                </div>
              </div>
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
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {Array.isArray(expertiseList) &&
                  expertiseList.map(expertise => (
                    <label
                      key={expertise._id}
                      htmlFor={`expertise-option-${expertise._id}-${severityIndex}`}
                      style={{ fontSize: "1rem", margin: "0.5rem" }}
                    >
                      <input
                        type="checkbox"
                        id={`expertise-option-${expertise._id}-${severityIndex}`}
                        value={expertise._id}
                        checked={severity.expertiseList.includes(expertise._id)}
                        onChange={event =>
                          handleExpertiseChange(
                            event,
                            severityIndex,
                            event.target.value
                          )
                        }
                        style={{ marginRight: "5px" }}
                      />
                      {expertise.type[0]}
                    </label>
                  ))}
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
