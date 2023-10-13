import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateSecondPart.css";

function CreateSecondPart() {
  const [illnessesData, setIllnessesData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedQuestionId, setEditedQuestionId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");

  useEffect(() => {
    // Function to fetch data from the API
    const fetchIllnessesData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/illnesses`
        );
        // Filter out illnesses with no options
        const filteredData = response.data.filter(
          illness => illness.options.length > 0
        );
        setIllnessesData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetch function
    fetchIllnessesData();
  }, []);

  const handleEdit = questionId => {
    const questionToEdit = illnessesData.find(
      illness => illness._id === questionId
    );
    setEditedQuestionId(questionId);
    setEditedQuestion(questionToEdit.name);
    setEditMode(true);
  };

  const handleSave = async questionId => {
    const updatedIllnessesData = illnessesData.map(illness =>
      illness._id === questionId
        ? { ...illness, name: editedQuestion }
        : illness
    );
    setIllnessesData(updatedIllnessesData);
    setEditMode(false);
    setEditedQuestionId(null);

    try {
      // Send PUT request to update the illness name
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/illnesses/${questionId}`,
        {
          name: editedQuestion,
        }
      );
    } catch (error) {
      console.error("Error updating illness name:", error);
    }
  };

  const handleDeleteOption = async (questionId, optionText) => {
    const updatedIllnessesData = illnessesData.map(illness =>
      illness._id === questionId
        ? {
            ...illness,
            options: illness.options.filter(
              option => option.text !== optionText
            ),
          }
        : illness
    );
    setIllnessesData(updatedIllnessesData);

    try {
      // Send PUT request to update the options
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/illnesses/${questionId}`,
        {
          deleteOptions: [optionText],
        }
      );
    } catch (error) {
      console.error("Error deleting option:", error);
    }
  };

  const handleAddOption = async questionId => {
    try {
      const newOption = { text: newOptionText };

      // Send PUT request to add the new option
      const updatedIllnessesData = illnessesData.map(illness =>
        illness._id === questionId
          ? {
              ...illness,
              options: [...illness.options, newOption],
            }
          : illness
      );
      setIllnessesData(updatedIllnessesData);
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/illnesses/${questionId}`,
        {
          options: [newOption],
        }
      );
    } catch (error) {
      console.error("Error adding option:", error);
    }

    setNewOptionText("");
    setShowAddOption(false);
  };

  return (
    <div className="questions-container">
      <h1 className="heading">Illnesses Data</h1>
      <ul className="questions-list">
        {illnessesData.map(illness => (
          <li key={illness._id} className="question">
            <div className="question-header">
              {editMode && editedQuestionId === illness._id ? (
                <input
                  type="text"
                  value={editedQuestion}
                  onChange={e => setEditedQuestion(e.target.value)}
                />
              ) : (
                <h2>{illness.name}</h2>
              )}
              <div className="question-icons">
                {editMode && editedQuestionId === illness._id ? (
                  <button
                    className="save-button"
                    onClick={() => handleSave(illness._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(illness._id)}
                    style={{ backgroundColor: "orange" }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            <ul className="options-list">
              {illness.options.map(option => (
                <li key={option._id} className="option">
                  {option.text}
                  {editMode && editedQuestionId === illness._id && (
                    <button
                      className="remove-option-button"
                      onClick={() =>
                        handleDeleteOption(illness._id, option.text)
                      }
                    >
                      X
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {editMode && editedQuestionId === illness._id && showAddOption && (
              <div>
                <input
                  type="text"
                  value={newOptionText}
                  onChange={e => setNewOptionText(e.target.value)}
                />
                <button onClick={() => handleAddOption(illness._id)}>
                  Save
                </button>
                <button onClick={() => setShowAddOption(false)}>Cancel</button>
              </div>
            )}
            {editMode && editedQuestionId === illness._id && !showAddOption && (
              <button onClick={() => setShowAddOption(true)}>+</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateSecondPart;
