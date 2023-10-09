import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Result.css";

const getTherapists = async assessmentScore => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/therapists/score",
      {
        assessmentScore,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve therapists");
  }
};

function Result() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const isLoggedIn = storedUser !== null && storedToken !== null; // Check if both user and token exist in localStorage

  const handleGetTherapists = async assessmentScore => {
    try {
      const therapists = await getTherapists(assessmentScore);
      localStorage.setItem("therapists", JSON.stringify(therapists));
      console.log(therapists);
      // Do something with the retrieved therapists
    } catch (error) {
      console.error(error.message);
      // Handle the error
    }
  };

  useEffect(() => {
    // Example usage: Call the API and save therapists to localStorage when assessmentScore exists
    const assessmentScore = localStorage.getItem("totalPoints");
    if (assessmentScore) {
      handleGetTherapists(assessmentScore);
    }
  }, []);

  return (
    <div className="middle-container">
      <div className="left-box">
        <h2>To download the report</h2>
        {isLoggedIn ? (
          <button style={{ marginTop: "3rem" }}>Download Report</button>
        ) : (
          <Link to="/signin">
            <button style={{ marginTop: "3rem" }}>Sign Up / Sign In</button>
          </Link>
        )}
      </div>
      <div className="right-box">
        <h2>Find your Therapist</h2>
        <p>Start Your Diagnosis Today</p>
        {isLoggedIn ? (
          <Link to="/FindTherapist">
            <button>Get Started</button>
          </Link>
        ) : (
          <Link to="/signin">
            <button>Sign Up / Sign In</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Result;
