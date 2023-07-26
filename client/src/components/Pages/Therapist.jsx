import React from "react";
import "./Therapist.css";
import inspiron from "./inspironWheel.png";
import { Link } from "react-router-dom";

function Therapist({ therapist }) {
  return (
    <div className="therapist-container">
      <div className="therapist-card">
        <div className="therapist-image-container">
          <img
            src={`data:${therapist?.image?.contentType};base64,${therapist?.image?.data}`}
            alt="Rounded"
          />
          <img src={inspiron} alt="Watermark" className="watermark" />
        </div>
        <div className="therapist-content-container">
          <span className="therapistName">{therapist?.name}</span>
          <span className="therapist-desig">{therapist?.designation}</span>
          <div className="therapist-expertise">
            <span className="therapist-exp">Expertise:</span>
            <ul className="therapist-ulExp">
              <div className="therapist-elements">
                {therapist?.expertise.map((area, index) => (
                  <li className="therapist-expertList" key={index}>
                    {area?.type[0]}
                  </li>
                ))}
              </div>
            </ul>
          </div>
          <div className="therapist-languages">
            <span className="therapist-language">Languages:</span>
            <span className="therapist-lang">
              {therapist?.modeOfSession.join(", ")}
            </span>
          </div>
          <div className="therapist-languages">
            <span className="therapist-language">Languages:</span>
            <span className="therapist-lang">
              {therapist?.languages.join(", ")}
            </span>
          </div>
          <div className="therapist-sessionPrice">
            <span className="therapist-session">Session:</span>
            <span className="therapist-sessionspan">
              Starts <strong>INR {therapist?.sessionPrice}</strong> for 60 mins
              session.
            </span>
          </div>
          <span className="therapist-available">
            Next Available Date and Time: {therapist?.nextAvailableDateTime}
          </span>
          <div className="therapist-buttons-container">
            <Link
              to={`/therapists/${therapist._id}`}
              className="therapist-know-more-button"
              style={{ textDecoration: "none", borderRadius: "3rem" }}
            >
              KNOW MORE
            </Link>
            <Link
              to={`/bookaslot/${therapist._id}`}
              className="therapist-know-more-button"
              style={{
                background:
                  "linear-gradient(90deg, #D67449 10.9%, #5179BD 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "3rem",
              }}
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Therapist;
