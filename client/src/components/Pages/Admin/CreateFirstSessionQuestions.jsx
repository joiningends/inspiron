import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateFirstSessionQuestions.css";
import Footer from "../Footer";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [optionsEditMode, setOptionsEditMode] = useState({});
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptions, setNewOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/headings`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleEditQuestion = (questionId, questionName) => {
    setEditQuestion(questionId);
    setEditedName(questionName);
    setOptionsEditMode(prevState => ({
      ...prevState,
      [questionId]: true,
    }));
  };

  const handleSaveQuestion = async () => {
    try {
      const updatedQuestions = questions.map(question => {
        if (newOptions[question._id]) {
          return {
            ...question,
            options: [...question.options, ...newOptions[question._id]],
          };
        }
        return question;
      });

      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/headings/${editQuestion}`,
        {
          name: editedName,
        }
      );

      setQuestions(updatedQuestions);
      setEditQuestion(null);
      setEditedName("");
      setOptionsEditMode(prevState => ({
        ...prevState,
        [editQuestion]: false,
      }));

      setNewOptions({});
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditQuestion(null);
    setEditedName("");
    setOptionsEditMode(prevState => ({
      ...prevState,
      [editQuestion]: false,
    }));
  };

  const handleOptionAction = async (questionId, optionAction, optionId) => {
    try {
      let updatedQuestions;

      if (optionAction === "delete") {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/headings/${questionId}`,
          {
            deleteOptions: [optionId],
          }
        );

        updatedQuestions = questions.map(question => {
          if (question._id === questionId) {
            const updatedOptions = question.options.filter(
              option => option.text !== optionId
            );
            return { ...question, options: updatedOptions };
          }
          return question;
        });
      }

      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleAddOption = async questionId => {
    try {
      if (newOptionText) {
        const newOption = { text: newOptionText };

        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/headings/${questionId}`,
          {
            options: [newOption],
          }
        );

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/headings`
        );
        setQuestions(response.data);

        setNewOptionText("");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div className="questions-container">
        <h1>Questions</h1>
        <div className="questions-list">
          {questions.map(question => (
            <div key={question._id} className="question">
              {editQuestion === question._id ? (
                <div className="question-edit-form">
                  <input
                    type="text"
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                  />
                  <div className="edit-buttons">
                    <button
                      className="save-button"
                      onClick={handleSaveQuestion}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-button"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="question-header">
                  <h2>{question.name}</h2>
                  <div className="question-icons">
                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEditQuestion(question._id, question.name)
                      }
                    >
                      <i className="fa fa-edit"></i> Edit
                    </button>
                  </div>
                </div>
              )}
              <ul>
                {question.options.map(option => (
                  <li key={`${question._id}-${option._id}`} className="option">
                    {option.text}
                    {editQuestion === question._id &&
                      optionsEditMode[question._id] && (
                        <button
                          className="remove-option-button"
                          onClick={() =>
                            handleOptionAction(
                              question._id,
                              "delete",
                              option.text
                            )
                          }
                        >
                          <i className="fa fa-times"></i> Remove
                        </button>
                      )}
                  </li>
                ))}
                {editQuestion === question._id &&
                  optionsEditMode[question._id] && (
                    <li className="new-option">
                      {newOptions[question._id] ? (
                        <div className="new-option-input">
                          <input
                            type="text"
                            value={newOptionText}
                            onChange={e => setNewOptionText(e.target.value)}
                          />
                          <button
                            className="save-option-button"
                            onClick={() => handleAddOption(question._id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-option-button"
                            onClick={() =>
                              setNewOptions(prevNewOptions => ({
                                ...prevNewOptions,
                                [question._id]: false,
                              }))
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="add-option-button"
                          onClick={() =>
                            setNewOptions(prevNewOptions => ({
                              ...prevNewOptions,
                              [question._id]: true,
                            }))
                          }
                        >
                          + ADD
                        </button>
                      )}
                    </li>
                  )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Questions;
