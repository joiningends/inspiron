import React, { useState, useEffect } from "react";
import "./Therapist.css";
import inspiron from "./inspironWheel.png";
import { Link } from "react-router-dom";
import start from "./star.png";

function Therapist({ therapist }) {
  const showAllExpertise = therapist.expertise.length <= 5;

  const [earliestDate, setEarliestDate] = useState("");
  const [earliestStartTime, setEarliestStartTime] = useState("");

  useEffect(() => {
    if (therapist?.sessions && therapist.sessions.length > 0) {
      let earliestDate = therapist.sessions[0].date;
      let earliestStartTime = therapist.sessions[0].timeSlots[0].startTime;

      therapist.sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        const earliestDateObj = new Date(earliestDate);

        if (sessionDate < earliestDateObj) {
          earliestDate = session.date;
          earliestStartTime = session.timeSlots[0].startTime;
        }
      });

      const formattedEarliestDate = new Date(earliestDate).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      setEarliestDate(formattedEarliestDate);
      setEarliestStartTime(earliestStartTime);
    }
  }, [therapist]);

  return (
    <div
      className="therapist-container"
      style={{
        position: "relative",
      }}
    >
      <img
        src={start}
        alt="Star"
        className="star-icon"
        style={{
          width: "20px",
          height: "20px",
          position: "absolute",
          top: 0,
          right: "7px",
          margin: "10px",
        }}
      />
      <span
        className="rating-text"
        style={{
          position: "absolute",
          top: 0,
          right: "40px",
          fontSize: "20px",
          color: "gold",
          fontWeight: "bold",
          lineHeight: "45px",
        }}
      >
        {therapist?.userRating}/5
      </span>

      <div className="therapist-card">
        <div
          className="therapist-image-container"
          style={{ width: "150px", height: "100%", overflow: "hidden" }}
        >
          {therapist?.image && (
            <img
              src={therapist.image}
              alt="Rounded"
              style={{
                maxWidth: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          )}
          {!therapist?.image && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                backgroundColor: "lightgray",
              }}
            ></span>
          )}
          <img src={inspiron} alt="Watermark" className="watermark" />
        </div>
        <div className="therapist-content-container">
          <span className="therapistName">{therapist?.name}</span>
          <span
            className="therapist-desig"
            style={{ color: "#5179BD", fontWeight: 500, fontSize: "1rem" }}
          >
            {therapist?.therapisttype}
          </span>
          <div className="therapist-expertise">
            <strong className="therapist-exp">Expertise:</strong>
            <ul
              className={`therapist-ulExp${
                showAllExpertise ? "" : " show-more"
              }`}
            >
              <div className="therapist-elements">
                {therapist.expertise.map(
                  (area, index) =>
                    (showAllExpertise || index < 5) && (
                      <li className="therapist-expertList" key={index}>
                        {area?.type[0]}
                      </li>
                    )
                )}
                {!showAllExpertise && (
                  <li style={{ fontSize: "16px" }}>....</li>
                )}
              </div>
            </ul>
          </div>
          <div className="therapist-languages">
            <strong className="therapist-language">Mode Of Session:</strong>
            <span className="therapist-lang">
              {therapist?.modeOfSession.join(", ")}
            </span>
          </div>
          <div className="therapist-languages">
            <strong
              className="therapist-language"
              style={{ marginRight: "0.2rem" }}
            >
              Languages:
            </strong>
            <span className="therapist-lang">
              {therapist?.languages.join(", ")}
            </span>
          </div>
          <div className="therapist-sessionPrice">
            <strong className="therapist-session">Session:</strong>
            <span className="therapist-sessionspan">
              Starts <strong>INR {therapist?.sessionPrice}</strong> for 60 mins
              session.
            </span>
          </div>
          <span className="therapist-available">
            <strong>Next Available Date and Time:</strong> {earliestDate} -{" "}
            {earliestStartTime}
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
                backgroundColor: "#5179BD",
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
