import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import groupHomePage from "./GroupHomeImage.png";

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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
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
    </>
  );
};
