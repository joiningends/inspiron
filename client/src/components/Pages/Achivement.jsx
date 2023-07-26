import React from "react";
import achiv from "./achiv.png";
import "./Achievement.css";

const Achievement = ({ achievements }) => {
  return (
    <div className="achievement-container">
      {achievements.map((achievement, index) => (
        <div className="achievement-item" key={index}>
        <span>
          <img className="img" src={achiv} alt="Achievement" />
          </span>
          <span className="des">{achievement.description}</span>
        </div>
      ))}
    </div>
  );
};

export default Achievement;
