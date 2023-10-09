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

  const dispatch = useDispatch();
  const therapists = useSelector(state => state.therapists);
  const [filteredTherapists, setFilteredTherapists] = useState([]);

  const [expertises, setExpertises] = useState([]);

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = "http://localhost:8080/api/v1/expetises";

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
      options: ["Depression", "IBS", "Stress", "Mania"],
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

        console.log(expertisesWithType)

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
      <div className="filter-container">
        <div className="filter-label">Apply Filters:</div>
        <div className="filter-options">
          {optionsData.map(data => (
            <div className="filter-field" key={data.label}>
              <div className="field-label">{data.label}:</div>
              {renderOptions(data.label, data.options)}
            </div>
          ))}
        </div>
        <button className="apply-btn" onClick={handleApplyFilters}>
          Apply
        </button>
      </div>
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
