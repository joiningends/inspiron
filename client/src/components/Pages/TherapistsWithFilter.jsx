import React, { useEffect, useState } from "react";
import Therapist from "./Therapist";
import "./TherapistsWithFilter.css";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Footer from "./Footer";
import {
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@material-ui/core";
import groupDiscuss from "./groupDiscuss.jpg";

import { useSelector, useDispatch } from "react-redux";

import { fetchTherapists } from "../redux/Action";
import SearchIcon from "@mui/icons-material/Search";
import Rating from "./Rating";

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

  const [tokenInfo, setTokenInfo] = useState(null);

  const [userInfo, setUserInfo] = useState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/users/${userInfo}`)
      .then(response => {
        // Handle the successful response here, and set the user data to state
        setUser(response.data);
      })
      .catch(error => {
        // Handle any errors here
        console.error("Error fetching user data:", error);
      });
  }, [userInfo]);

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the JWT token using jwt-decode
      const decoded = jwtDecode(token);

      // Store the decoded information in the component's state
      setTokenInfo(decoded);
      setUserInfo(decoded?.userId);
    }
  }, []);

  // Function to handle page change
  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/prices`;

    // Make the GET request using Axios
    axios
      .get(apiUrl)
      .then(response => {
        // Handle the response data here and update the state
        const data = response.data;
        setPrices(data);
      })
      .catch(error => {
        // Handle errors, if any
        console.error("Error:", error);
      });
  }, []); // The empty dependency array ensures that this effect runs only once on page load

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/expetises`;

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

    if (groupId !== "null") {
      // Construct the URL
      const url = `${process.env.REACT_APP_SERVER_URL}/therapists/group/${cleanGroupId}`;
      // Make the GET request using Axios
      axios
        .get(url)
        .then(response => {
          // Handle the response data here
          setTherapits(response.data);
        })
        .catch(error => {
          // Handle errors here
          console.error("Error:", error);
        });
    } else {
      // If groupid doesn't exist, dispatch the fetchTherapists action
      const url = `${process.env.REACT_APP_SERVER_URL}/therapists/all`;
      // Make the GET request using Axios
      axios
        .get(url)
        .then(response => {
          // Handle the response data here
          setTherapits(response.data);
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
    setFilteredTherapists(therapists);
  }, [load]);

  useEffect(() => {
    if (therapists.length !== 0) {
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

  console.log(prices);
  console.log(
    prices.map(price => ({
      label: `Level ${price.level}`,
      value: price.level, // Store the level value
      discountedPrice: price.discountPrice, // Store the discounted price
      id: price._id,
    }))
  );

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
        label: `${price.level}`,
        value: price.level, // Store the level value
        discountedPrice: price.discountPrice, // Store the discounted price
        id: price._id,
      })),
    },
    {
      label: "Gender",
      options: ["Male", "Female"],
    },
    // {
    //   label: "Age",
    //   options: ["18-25", "26-35", "36-45", "46-above"],
    // },
  ];

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
      const savedData = JSON.parse(localStorage.getItem("therapistsData"));

      const groupId = localStorage.getItem("groupid");
      const cleanGroupId = groupId.replace(/"/g, "");
      if (cleanGroupId === "null") {
        const therapists = savedData;
        const therapist = { therapists };
        setFilteredTherapists(therapist);
      } else {
        setFilteredTherapists(savedData);
      }
    } else {
      setFilteredTherapists(therapists);
    }
  }, [storedAssessment, score]);

  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleLabelClick = label => {
    setSelectedLabel(label);
  };

  const handleOptionClick = (option, label) => {
    if (label === "Session Price") {
      const updatedSessionPriceFilters = selectedFilters[label] || [];
      const updatedFilters = {
        ...selectedFilters,
        [label]: [...updatedSessionPriceFilters, option.label],
      };

      setSelectedFilters(updatedFilters);
      handleApplyFilters(updatedFilters); // Call apply filters function specifically for 'Session Price'
    } else {
      // Handle other label options where you store array of options
      const updatedSelectedFilters = { ...selectedFilters };
      if (!updatedSelectedFilters[label]) {
        updatedSelectedFilters[label] = [option];
      } else {
        const index = updatedSelectedFilters[label].indexOf(option);
        if (index === -1) {
          updatedSelectedFilters[label].push(option);
        } else {
          updatedSelectedFilters[label].splice(index, 1);
        }
      }
      setSelectedFilters(updatedSelectedFilters);
      handleApplyFilters(updatedSelectedFilters); // Call apply filters function for other labels
    }
  };

  const handleRemoveFilter = (option, label) => {
    const updatedSelectedFilters = { ...selectedFilters };
    updatedSelectedFilters[label] = (
      updatedSelectedFilters[label] || []
    ).filter(item => item !== option);
    setSelectedFilters(updatedSelectedFilters);
    handleApplyFilters(updatedSelectedFilters); // Call apply filters function
  };

  console.log(therapists);

  const handleApplyFilters = updatedSelectedFilters => {
    const selectedExpertise = updatedSelectedFilters["Experties"] || [];
    const selectedSessionMode = updatedSelectedFilters["Session Mode"] || [];
    const selectedGender = updatedSelectedFilters["Gender"] || [];
    const sessionPrice = updatedSelectedFilters["Session Price"] || [];

    console.log(updatedSelectedFilters);
    console.log(sessionPrice);

    const filteredTherapists = therapists.therapists.filter(therapist => {
      const expertiseMatched =
        selectedExpertise.length === 0 ||
        selectedExpertise.some(expertise =>
          therapist.expertise.some(item => item.type.includes(expertise))
        );

      const sessionModeMatched =
        selectedSessionMode.length === 0 ||
        selectedSessionMode.some(mode =>
          therapist.modeOfSession.some(item => item.includes(mode))
        );
      console.log(sessionModeMatched);

      const genderMatched =
        selectedGender.length === 0 ||
        selectedGender.includes(therapist.gender);

      const selectedPriceMatched =
        sessionPrice.length === 0 ||
        sessionPrice.some(level => {
          if (therapist.level === level) return true;
        });

      return (
        expertiseMatched &&
        sessionModeMatched &&
        genderMatched &&
        selectedPriceMatched
      );
      // Add other filter conditions similarly
    });
    console.log(filteredTherapists);
    const therapist = { therapists: filteredTherapists };
    setFilteredTherapists(therapist);
  };

  const displayTherapists = currentTherapists?.map(therapist => (
    <Therapist
      key={therapist.id}
      therapist={therapist}
      className="therapist-box"
    />
  ));

  return (
    <>
      {/* Button to toggle the visibility of filters */}
      <div
        className="assessmentintroPage"
        style={{
          backgroundImage: `url(${groupDiscuss})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          height: "15rem",
          width: "100vw",
          marginTop: "-2rem",
        }}
      >
        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 700 }}>
          Find a Therapist thatmeets your needs
        </h1>
        <p style={{ color: "white" }}>
          Our platform is built by psychiatrists, therapists and mental health
          experts with immense global experience.
        </p>
      </div>
      {user?.israting === true && (
        <Rating userId={user?._id} lastTherapist={user?.lasttherapist} />
      )}

      <Grid container spacing={2} style={{ marginTop: "-1.1rem" }}>
        {/* Merged Part for Labels, Options, and Selected Filters */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            style={{
              background: "#5179BD",
              color: "white",
              fontFamily: "Poppins, sans-serif",
              padding: 5,
            }}
          >
            {/* Displaying Labels */}
            <Grid container>
              {/* Apply Filters label */}
              <span
                style={{
                  fontFamily: "Poppins",
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                  marginRight: "1rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                Apply Filters:
              </span>

              {/* Rendering labels */}
              {optionsData.map(option => (
                <Grid item key={option.label}>
                  <Paper
                    component={ListItem}
                    button
                    onClick={() => handleLabelClick(option.label)}
                    selected={selectedLabel === option.label}
                    style={{
                      borderRadius: 20,
                      margin: 1,
                      marginRight: "0.5rem",
                      padding: 10,
                      background:
                        selectedLabel === option.label
                          ? "#e0e0e0"
                          : "transparent",
                      color: "white !important",
                      borderColor: "white",
                    }}
                  >
                    <ListItemText
                      primary={
                        selectedLabel === "Session Price"
                          ? option.label
                          : option.label
                      }
                      style={{
                        fontSize: 14,
                        margin: "-0.1rem",
                        color: "white !important",
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Conditionally render remaining sections after label selection */}
            {selectedLabel && (
              <>
                {/* Horizontal line */}
                <hr
                  style={{ borderTop: "0.1px solid white", margin: "1rem 0" }}
                />

                {/* Displaying Selected and Available Options along with Selected Filters */}
                <Grid container>
                  {/* Rendering options based on selected label */}
                  {(
                    optionsData.find(option => option.label === selectedLabel)
                      ?.options || []
                  ).map(option => (
                    <Grid item key={option.label || option}>
                      <Paper
                        component={ListItem}
                        button
                        onClick={() => handleOptionClick(option, selectedLabel)}
                        style={{
                          borderRadius: 20,
                          margin: 5,
                          padding: 10,
                          background: selectedFilters[selectedLabel]?.includes(
                            option
                          )
                            ? "#e0e0e0"
                            : "transparent",
                          color: "white",
                          borderColor: "white",
                        }}
                      >
                        <ListItemText
                          style={{
                            fontSize: 14,
                            margin: "-0.3rem",
                            color: "white",
                          }}
                          primary={
                            selectedLabel === "Session Price"
                              ? `Discounted Price: ${option.discountedPrice}`
                              : option.label || option
                          }
                        />
                      </Paper>
                    </Grid>
                  ))}
                  {!selectedLabel && (
                    <Typography align="center" variant="body1">
                      Select a label to view options
                    </Typography>
                  )}
                </Grid>

                {/* Horizontal line */}
                <hr
                  style={{ borderTop: "0.1px solid white", margin: "1rem 0" }}
                />

                {/* Displaying Selected Filters */}
                <Grid container>
                  {/* Rendering selected filters */}
                  {Object.keys(selectedFilters).map(label =>
                    selectedFilters[label].map((filter, index) => (
                      <Grid item key={`${label}-${filter}-${index}`}>
                        <Chip
                          label={filter}
                          onDelete={() => handleRemoveFilter(filter, label)}
                          style={{ margin: 5 }}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <div className="therapist-containerr">{displayTherapists}</div>

      {/* Pagination controls */}
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
      <Footer />
    </>
  );
};

export default TherapistsWithFilter;
