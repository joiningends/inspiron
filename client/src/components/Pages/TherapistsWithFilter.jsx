import React, { useEffect, useState } from "react";
import Therapist from "./Therapist";
import "./TherapistsWithFilter.css";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { fetchTherapists } from "../redux/Action";

export const TherapistsWithFilter = () => {
  const [therapyOptions, setTherapyOptions] = useState([]);
  const [sessionModeOptions, setSessionModeOptions] = useState([]);
  const [concernOptions, setConcernOptions] = useState([]);
  const [experienceLevelOptions, setExperienceLevelOptions] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [ageOptions, setAgeOptions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const dispatch = useDispatch();
  const therapists = useSelector(state => state.therapists);
  const [filteredTherapists, setFilteredTherapists] = useState([]);

  const [expertises, setExpertises] = useState([]);
  const handleToggleFilters = () => {
    setShowFilters(prevState => !prevState);
  };

  const handleFilterLabelClick = label => {
    setActiveFilter(activeFilter === label ? null : label);
  };

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = "http://localhost:4000/api/v1/expetises";

    // Make the GET request using Axios
    axios
      .get(apiUrl)
      .then(response => {
        // Handle the response data here and update the state
        const data = response.data;
        setExpertises(data);
      })
      .catch(error => {
        // Handle errors, if any
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    dispatch(fetchTherapists());
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("therapists");
      localStorage.removeItem("score");
      localStorage.removeItem("assessment");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    setFilteredTherapists(therapists);
  }, [therapists]);

  const handleOptionChange = (event, field) => {
    const { value, checked } = event.target;
    switch (field) {
      case "Experties":
        setTherapyOptions(prevOptions =>
          checked
            ? [...prevOptions, value]
            : prevOptions.filter(option => option !== value)
        );
        break;
      case "Session Mode":
        setSessionModeOptions(prevOptions =>
          checked
            ? [...prevOptions, value]
            : prevOptions.filter(option => option !== value)
        );
        break;
      case "Concern":
        setConcernOptions(prevOptions =>
          checked
            ? [...prevOptions, value]
            : prevOptions.filter(option => option !== value)
        );
        break;
      case "Experience Level":
        setExperienceLevelOptions(prevOptions =>
          checked
            ? [...prevOptions, value]
            : prevOptions.filter(option => option !== value)
        );
        break;
      case "Gender":
        setSexOptions(prevOptions =>
          checked
            ? [...prevOptions, value]
            : prevOptions.filter(option => option !== value)
        );
        break;
      case "Age":
        const [minAge, maxAge] = value.split("-");
        setAgeOptions(prevOptions =>
          checked
            ? [...prevOptions, { min: Number(minAge), max: Number(maxAge) }]
            : prevOptions.filter(
                option =>
                  option.min !== Number(minAge) || option.max !== Number(maxAge)
              )
        );
        break;
      default:
        break;
    }
  };

  const renderOptions = (label, options) => {
    return (
      <div className="options-container">
        <div className="checkbox-group">
          {options.map(option => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                name={label}
                value={option}
                onChange={event => handleOptionChange(event, label)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const optionsData = [
    {
      label: "Experties",
      options: ["Depression", "Breakup", "Anxiety", "Sadness"],
    },
    {
      label: "Session Mode",
      options: ["In-person", "Online"],
    },
    {
      label: "Experience Level",
      options: ["Level 1", "Level 2", "Level 3"],
    },
    {
      label: "Gender",
      options: ["Male", "Female", "Other"],
    },
    {
      label: "Age",
      options: ["18-25", "26-35", "36-45"],
    },
  ];

  const handleApplyFilters = () => {
    // Filter therapists based on selected options for each field
    const filteredTherapists = therapists.filter(therapist => {
      const expertiseMatched =
        therapyOptions.length === 0 ||
        therapyOptions.every(therapyOption => {
          const expertiseType = therapyOption; // Assuming each therapy option has only one expertise type
          return therapist.expertise.some(expertise =>
            expertise.type.includes(expertiseType)
          );
        });

      console.log(expertiseMatched);

      const sessionModeMatched =
        sessionModeOptions.length === 0 ||
        sessionModeOptions.every(mode =>
          therapist.modeOfSession.includes(mode)
        );

      const concernMatched =
        concernOptions.length === 0 ||
        concernOptions.every(concern => therapist.concern.includes(concern));

      const experienceLevelMatched =
        experienceLevelOptions.length === 0 ||
        experienceLevelOptions.every(level =>
          therapist.experienceLevel.includes(level)
        );

      const sexMatched =
        sexOptions.length === 0 ||
        sexOptions.every(sex => therapist.gender === sex);

      const ageMatched =
        ageOptions.length === 0 ||
        ageOptions.some(
          ageOption =>
            therapist.age >= ageOption.min && therapist.age <= ageOption.max
        );

      // Return true if all filter conditions match
      return (
        expertiseMatched &&
        sessionModeMatched &&
        concernMatched &&
        experienceLevelMatched &&
        sexMatched &&
        ageMatched
      );
    });

    // Update the filteredTherapists state
    setFilteredTherapists(filteredTherapists);
  };

  // Retrieve the assessment score from localStorage
  let storedAssessment;
  try {
    storedAssessment = JSON.parse(localStorage.getItem("assessment"));
  } catch (error) {
    console.error("Error parsing stored assessment:", error);
    storedAssessment = null;
  }

  let score = localStorage.getItem("totalPoints");

  // Filter therapists based on assessment score or show all therapists if no score available
  useEffect(() => {
    if (storedAssessment && score) {
      const { low, medium, high } = storedAssessment;
      let expertise = [];
      console.log();

      if (score >= low?.min && score <= low?.max) {
        expertise = low.expertise;
        // console.log(expertise);
      } else if (score >= medium.min && score <= medium.max) {
        expertise = medium.expertise;
        // console.log(expertise);
      } else if (score >= high.min && score <= high.max) {
        expertise = high.expertise;
        // console.log(expertise);
      }

      console.log(expertise);

      const expertisesWithType = expertise
        .map(id => expertises.find(item => item._id === id))
        .filter(expertise => expertise !== undefined)
        .map(expertise => expertise.type[0]);

      console.log(expertisesWithType);

      const filteredTherapistsByScore = therapists.filter(therapist => {
        const matchedExpertise = expertisesWithType.some(expertiseType =>
          therapist.expertise.some(expertiseItem =>
            expertiseItem.type.includes(expertiseType)
          )
        );
        return matchedExpertise;
      });

      console.log(filteredTherapistsByScore);

      // Update the filteredTherapists state
      setFilteredTherapists(filteredTherapistsByScore);
    } else {
      setFilteredTherapists(therapists);
    }
  }, [storedAssessment, score]);

  console.log(filteredTherapists);

  return (
    <>
      {/* Button to toggle the visibility of filters */}
      <button
        className="toggle-filters-btn"
        style={{
          position: "fixed",
          top: "15%",
          left: "10px",
          transform: "translateY(-50%)",
          zIndex: "9999",
          padding: "10px",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={handleToggleFilters}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Filter container */}
      <div
        className="filter-container"
        style={{
          backgroundColor: "#5179BD",
          position: "fixed",
          top: "0",
          left: showFilters ? "0" : "-100%",
          minWidth: "25%",
          height: "100%",
          zIndex: "9998",
          marginTop: "4.3rem",
          padding: "20px",
          marginTop: "4.4rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "left 0.3s",
          overflowY: "auto", // Add scroll effect if content exceeds container size
        }}
      >
        {optionsData.map(data => (
          <div
            className="filter-field"
            key={data.label}
            style={{
              marginTop: "4.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="field-label"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
                marginTop: "rem",
              }}
              onClick={() => handleFilterLabelClick(data.label)}
            >
              {data.label}:
              {activeFilter === data.label ? (
                <span style={{ marginLeft: "5px", fontSize: "10px" }}>▼</span>
              ) : (
                <span style={{ marginLeft: "5px", fontSize: "10px" }}>▶</span>
              )}
            </div>
            {activeFilter === data.label && (
              <div
                className="filter-options"
                style={{ margin: "0.2rem , 0.2rem , 0.2rem , 0" }}
              >
                {renderOptions(data.label, data.options)}
              </div>
            )}
          </div>
        ))}
        <button
          className="apply-btn"
          onClick={handleApplyFilters}
          style={{ backgroundColor: "#68B545", color: "white" }}
        >
          Apply
        </button>
      </div>

      {/* Therapists list */}
      <div className="therapist-grandParent">
        <div className="therapist-containerr">
          {filteredTherapists.map(therapist => (
            <Therapist
              key={therapist.id}
              therapist={therapist}
              className="therapist-box"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TherapistsWithFilter;
