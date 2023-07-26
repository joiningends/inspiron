import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import groupHomePage from "./GroupHomeImage.png";

export const Home = () => {
  return (
    <>
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
