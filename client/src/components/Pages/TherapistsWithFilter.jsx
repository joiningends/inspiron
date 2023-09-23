import React, { useEffect, useState } from "react";
import Therapist from "./Therapist";
import "./TherapistsWithFilter.css";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Paper,
  Box,
  Typography,
  Checkbox,
  InputBase,
} from "@mui/material";

import { fetchTherapists } from "../redux/Action";
import SearchIcon from "@mui/icons-material/Search";

export const TherapistsWithFilter = () => {
  const [therapyOptions, setTherapyOptions] = useState([]);
  const [sessionModeOptions, setSessionModeOptions] = useState([]);
  const [concernOptions, setConcernOptions] = useState([]);
  const [experienceLevelOptions, setExperienceLevelOptions] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [ageOptions, setAgeOptions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [load, setLoad] = useState(false);
  const [sessionPriceOptions, setSessionPriceOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const therapistsPerPage = 6; // Number of therapists per page

  const [therapists, setTherapits] = useState(
    useSelector(state => state.therapists) || []
  );

  const dispatch = useDispatch();
  const [filteredTherapists, setFilteredTherapists] = useState(null);

  const [expertises, setExpertises] = useState([]);

  const [prices, setPrices] = useState([]);

  // Calculate the index range for therapists to display on the current page
  const indexOfLastTherapist = currentPage * therapistsPerPage;
  const indexOfFirstTherapist = indexOfLastTherapist - therapistsPerPage;
  const currentTherapists = filteredTherapists?.therapists?.slice(
    indexOfFirstTherapist,
    indexOfLastTherapist
  );

  // Function to handle page change
  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = "http://localhost:4000/api/v1/prices";

    // Make the GET request using Axios
    axios
      .get(apiUrl)
      .then(response => {
        // Handle the response data here and update the state
        const data = response.data;
        console.log(data);
        setPrices(data);
      })
      .catch(error => {
        // Handle errors, if any
        console.error("Error:", error);
      });
  }, []); // The empty dependency array ensures that this effect runs only once on page load

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
    const groupId = localStorage.getItem("groupid"); // Make sure you have 'groupid' stored in localStorage
    const cleanGroupId = groupId.replace(/"/g, "");
    console.log("hello1");
    console.log(groupId);
    console.log(cleanGroupId);
    if (groupId !== "null") {
      // Construct the URL
      const url = `http://localhost:4000/api/v1/therapists/group/${cleanGroupId}`;
      console.log(url);
      // Make the GET request using Axios
      axios
        .get(url)
        .then(response => {
          // Handle the response data here
          setTherapits(response.data);
          console.log(response.data);
        })
        .catch(error => {
          // Handle errors here
          console.error("Error:", error);
        });
    } else {
      // If groupid doesn't exist, dispatch the fetchTherapists action
      const url = `http://localhost:4000/api/v1/therapists/all`;
      console.log(url);
      // Make the GET request using Axios
      axios
        .get(url)
        .then(response => {
          // Handle the response data here
          setTherapits(response.data);
          console.log(response.data);
        })
        .catch(error => {
          // Handle errors here
          console.error("Error:", error);
        });
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("therapists");
      localStorage.removeItem("totalPoints");
      localStorage.removeItem("assessment");
      localStorage.removeItem("therapistsData");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    console.log("hello3");
    console.log(therapists);
    setFilteredTherapists(therapists);
  }, [load]);

  useEffect(() => {
    if (therapists.length !== 0) {
      console.log(therapists.length);
      setLoad(true);
    }
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
      case "Session Price":
        setSessionPriceOptions(prevOptions =>
          checked
            ? [...prevOptions, value]
            : prevOptions.filter(option => option !== value)
        );
        break;
      // case "Experience Level":
      //   setExperienceLevelOptions(prevOptions =>
      //     checked
      //       ? [...prevOptions, value]
      //       : prevOptions.filter(option => option !== value)
      //   );
      // break;
      case "Gender":
        setSexOptions(prevOptions =>
          checked
            ? [...prevOptions, value]
            : prevOptions.filter(option => option !== value)
        );
        break;
      case "Age":
        const [minAge, maxAge] = value?.split("-");
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

  const expertiseTypes = expertises?.map(expertise => expertise.type[0]);

  const optionsData = [
    {
      label: "Experties",
      options: expertiseTypes,
    },
    {
      label: "Session Mode",
      options: ["Offline", "Online"],
    },
    {
      label: "Session Price",
      options: prices.map(price => ({
        label: `Level ${price.level}`,
        value: price.level, // Store the level value
        discountedPrice: price.discountPrice, // Store the discounted price
      })),
    },
    {
      label: "Gender",
      options: ["Male", "Female"],
    },
    {
      label: "Age",
      options: ["18-25", "26-35", "36-45", "46-above"],
    },
  ];

  const handleApplyFilters = () => {
    // Filter therapists based on selected options for each field
    console.log("Hello");
    console.log(sessionPriceOptions);
    let filteredTherapistsCopy = therapists;
    console.log(filteredTherapistsCopy);
    const filteredTherapist = filteredTherapistsCopy?.therapists?.filter(
      therapist => {
        console.log(therapist);
        const expertiseMatched =
          therapyOptions.length === 0 ||
          therapyOptions.every(option => {
            return therapist.expertise.some(expertise =>
              expertise.type.includes(option)
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

        // const experienceLevelMatched =
        //   experienceLevelOptions.length === 0 ||
        //   experienceLevelOptions.every(level =>
        //     therapist.experienceLevel.includes(level)
        //   );

        const selectedPriceMatched =
          sessionPriceOptions.length === 0 ||
          sessionPriceOptions.some(level => {
            if (therapist.level === level) return true;
          });

        const sexMatched =
          sexOptions.length === 0 ||
          sexOptions.every(sex => therapist.gender === sex);

        const ageMatched =
          ageOptions.length === 0 ||
          ageOptions?.some(ageOption => {
            if (ageOption === "46-above") {
              return therapist.age >= 46;
            } else if (typeof ageOption === "string") {
              // Check if ageOption is a string
              const [min, max] = ageOption.split("-").map(Number);
              return therapist.age >= min && therapist.age <= max;
            }
            return false; // Handle invalid ageOption
          });

        // Return true if all filter conditions match
        return (
          expertiseMatched &&
          sessionModeMatched &&
          concernMatched &&
          selectedPriceMatched &&
          sexMatched &&
          ageMatched
        );
      }
    );

    // Update the filteredTherapists state
    const therapist = { therapists: filteredTherapist };
    setFilteredTherapists(therapist);
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
    console.log(storedAssessment);
    console.log(score);
    if (storedAssessment && score) {
      const savedData = JSON.parse(localStorage.getItem("therapistsData"));

      console.log("Hello this is ");
      const groupId = localStorage.getItem("groupid");
      const cleanGroupId = groupId.replace(/"/g, "");
      if (cleanGroupId === "null") {
        const therapists = savedData;
        const therapist = { therapists };
        setFilteredTherapists(therapist);
        console.log(therapist);
      } else {
        setFilteredTherapists(savedData);
      }
    } else {
      setFilteredTherapists(therapists);
    }
  }, [storedAssessment, score]);

  console.log(filteredTherapists);
  const handleRemoveFilters = () => {
    // Refresh the page
    window.location.reload();
  };

  return (
    <>
      {/* Button to toggle the visibility of filters */}
      <Button
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
      </Button>

      <Paper
        elevation={3}
        className="filter-container"
        style={{
          backgroundColor: "#5179BD",
          position: "fixed",
          top: "0",
          left: showFilters ? "0" : "-100%",
          width: "25%",
          height: "calc(100% - 4.3rem)", // Fixed height, subtracting the top margin
          zIndex: "9998",
          marginTop: "4.3rem",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "left 0.3s",
          overflowY: "auto", // Enable vertical scrollbar
        }}
      >
        <Button
          className="apply-btn"
          onClick={handleApplyFilters}
          style={{
            backgroundColor: "#68B545",
            color: "white",
            marginBottom: "1rem",
            marginTop: "20%",
          }}
        >
          Apply
        </Button>
        <Button
          className="remove-filters-btn"
          onClick={handleRemoveFilters}
          style={{
            backgroundColor: "#FF0000",
            color: "white",
            marginBottom: "1rem",
            marginLeft: "1rem",
            marginTop: "20%",
          }}
        >
          Remove Filters
        </Button>

        {optionsData.map(data => (
          <Box
            className="filter-field"
            key={data.label}
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              className="field-label"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
              }}
              onClick={() => handleFilterLabelClick(data.label)}
            >
              <Typography>
                {data.label}:
                {activeFilter === data.label ? (
                  <span style={{ marginLeft: "5px", fontSize: "10px" }}>▼</span>
                ) : (
                  <span style={{ marginLeft: "5px", fontSize: "10px" }}>▶</span>
                )}
              </Typography>
            </Box>
            {activeFilter === data.label && (
              <Box className="filter-options" style={{ margin: "0.5rem 0" }}>
                {data.label === "Session Price"
                  ? data.options.map(option => (
                      <label key={option.label} className="checkbox-label">
                        <Checkbox
                          name={data.label}
                          value={option.value}
                          onChange={event =>
                            handleOptionChange(event, data.label)
                          }
                        />
                        {option.discountedPrice}
                      </label>
                    ))
                  : // Render other options (Expertise, Gender, Age, etc.) as before
                    data.options.map(option => (
                      <label key={option} className="checkbox-label">
                        <Checkbox
                          name={data.label}
                          value={option}
                          onChange={event =>
                            handleOptionChange(event, data.label)
                          }
                        />
                        {option}
                      </label>
                    ))}
              </Box>
            )}
          </Box>
        ))}
      </Paper>
      {/* Therapists list */}
      <div className="therapist-grandParent">
        <div className="therapist-containerr">
          {currentTherapists?.map(therapist => (
            <Therapist
              key={therapist.id}
              therapist={therapist}
              className="therapist-box"
            />
          ))}
        </div>
      </div>

      {/* Pagination controls */}
      {/* Enhanced Pagination controls */}
      <div className="pagination">
        {filteredTherapists?.therapists && (
          <ul>
            {Array(
              Math.ceil(
                filteredTherapists?.therapists.length / therapistsPerPage
              )
            )
              .fill(null)
              .map((_, index) => (
                <li
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TherapistsWithFilter;
