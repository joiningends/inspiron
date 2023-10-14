import React from "react";
import AssessmentCard from "./AvailableAssessmentCard";
import "./Assessments.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssessments } from "../redux/Action";
import { useEffect } from "react";
import groupDiscuss from "./groupDiscuss.jpg";

function Assessments() {
  const dispatch = useDispatch();
  const assessments = useSelector(state => state.assessments);

  useEffect(() => {
    dispatch(fetchAssessments()); // Fetch the therapist using the ID
  }, [dispatch]);


  return (
    <>
      <div
        className="assessmentintroPage"
        style={{
          backgroundImage: `url(${groupDiscuss})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          height: "18rem",
          width: "100vw",
        }}
      >
        <h1 style={{ color: "white" }}>Take a free Assessment</h1>
        <p style={{ color: "white" }}>
          Our platform is built by psychiatrists, therapists, and mental health
          experts with immense global experience.
        </p>
      </div>
      <div className="assessments-assessmentParentDiv">
        <div className="assessments-assessmentHeadingDiv">
          <span className="assessments-assessmentHeading">
            Choose your test
          </span>
          <p className="assessments-assessmentParagram">
            Our platform is built by psychiatrists, therapists, and mental
            health experts with immense global experience.
          </p>
        </div>
        <div className="assessments-AssessmentCardsAvailable">
          {assessments.map(assessment => (
            <AssessmentCard
              key={assessment._id}
              assessmentImage={assessment.image}
              assessment_name={assessment.assessment_name}
              summary={assessment.summary}
              assessment_id={assessment._id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Assessments;
