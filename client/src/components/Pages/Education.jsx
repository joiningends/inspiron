import React from "react";
import "./Education.css";

const Education = ({ educationData }) => {
  return (
    <div className="education-container">
      <h5 className="education-qualification">Qualification</h5>
      <div className="education-details">
        {educationData.map((education, index) => (
          <div className="education-card" key={index}>
            <p className="collegeName">{education.collegeName}</p>
            <p className="eLevel">{education.educationLevel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
