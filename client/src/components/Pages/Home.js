import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import groupHomePage from "./GroupHomeImage.png";
import footer from "./Footer";
import Footer from "./Footer";

import axios from "axios";
import jwtDecode from "jwt-decode";

import Rating from "./Rating";

export const Home = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  console.log(tokenInfo);

  const [userInfo, setUserInfo] = useState();
  const [user, setUser] = useState(null);
  console.log(user);

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

  console.log(userInfo);

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the JWT token using jwt-decode
      const decoded = jwtDecode(token);

      // Store the decoded information in the component's state
      console.log(decoded);
      setTokenInfo(decoded);
      setUserInfo(decoded?.userId);
    }
  }, []);
  return (
    <>
      {user?.israting === true && (
        <Rating userId={user?._id} lastTherapist={user?.lasttherapist} />
      )}
      <div className="homepageBanner">
        <div className="homepageBannerButtonsandtext">
          <div>
            <h2 className="homepageBannerText">
              Find a therapist that meets your need.
            </h2>
          </div>
          <p className="homePageBannerParagraph">
            Discovering the right therapist is key to your mental well-being
            journey. Our service ensures a personalized match with experts
            versed in scientific treatment protocols, including psychometric
            screening and multi-modal psychotherapy. We prioritize your unique
            goals, offering support through tailored self-help toolkits like
            podcasts and articles. Trust us to connect you with a therapist who
            understands and meets your individual needs, creating a
            collaborative and effective path towards mental wellness.
          </p>
          <span>
            <Link to={`/FindTherapist`} className="linkButton primary">
              FIND YOUR THERAPIST
            </Link>
          </span>
          <span>
            <Link to={`/assessment`} className="linkButton secondary">
              TAKE YOUR ASSESSMENT
            </Link>
          </span>
        </div>
        <div className="homepageBackgroundImage">
          <img src={groupHomePage} alt="homepageBackgroundImage" />
        </div>
      </div>
      <Footer />
    </>
  );
};
