import React, { useEffect, useState } from "react";
import "./AvailableAssessmentCard.css";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const AssessmentCard = ({
  assessmentImage,
  assessment_name,
  summary,
  assessment_id,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const imageUrl = assessmentImage;
  return (
    <>
    <div className={`AssessmentCard ${loaded ? "loaded" : ""}`}>
      <div className="image-container">
        <img src={imageUrl} alt="Assessment" />
      </div>
      <div className="card-content">
        <div className="title">{assessment_name}</div>
        <div className="description">{summary}</div>
        <div className="button-container">
          <Link to={`/assessment/${assessment_id}`} className="assessment-link">
            <button className="Assessment-btn">Give Assessment</button>
          </Link>
        </div>
      </div>
    </div>

    </>
  );
};

export default AssessmentCard;
