import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import groupHomePage from "./GroupHomeImage.png";
import Footer from "./Footer";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Rating from "./Rating";

export const Home = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setTokenInfo(decoded);
      setUserInfo(decoded?.userId);
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/users/${userInfo}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userInfo]);

  const empid = JSON.parse(localStorage.getItem("empid"));
  const isEmpidNull = empid !== null;
  console.log(isEmpidNull);

  const handleButtonClick = () => {
    navigate("/selfhelp");
  };

  return (
    <>
      {user?.israting === true && (
        <Rating userId={user?._id} lastTherapist={user?.lasttherapist} />
      )}
      {isEmpidNull && (
        <button
          style={{
            marginLeft: "80%",
            marginRight: "20px",
            marginTop: "20px",
            padding: "12px 20px",
            background: "#5179BD",
            color: "#ffffff",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "background 0.3s ease-in-out",
          }}
          onClick={handleButtonClick}
        >
          Go Self Help
        </button>
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
