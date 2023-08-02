import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PatientDetails.css";

function PatientDetails() {
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [therapistDetails, setTherapistDetails] = useState(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/appointments/${id}`)
      .then(response => response.json())
      .then(data => {
        setAppointmentDetails(data);

        // Retrieve therapist details
        fetch(`http://localhost:4000/api/v1/therapists/${data.therapist}`)
          .then(response => response.json())
          .then(therapistData => {
            setTherapistDetails(therapistData);
          })
          .catch(error =>
            console.error("Error retrieving therapist details:", error)
          );
      })
      .catch(error =>
        console.error("Error retrieving appointment details:", error)
      );
  }, [id]);

  if (!appointmentDetails || !therapistDetails) {
    return <div>Loading...</div>;
  }

  const startSession = () => {
    // Implement the logic to start the session here
    console.log("Start button clicked");
    setIsSessionStarted(true);
    window.open(therapistDetails.meetLink, "_blank");
  };

  const handleFirstSessionNotes = () => {
    // Open the first session notes page in a new tab with the current id
    window.open(`/patient-details-first-session-notes/${id}`, "_blank");
  };

  console.log(appointmentDetails);

  return (
    <div className="profile-container">
      <h1 className="profile-title">Patient Details</h1>
      <div className="profile-details">
        <div className="detail-item">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{appointmentDetails?.user?.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Age:</span>
          <span className="detail-value">{appointmentDetails?.user?.age}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Gender:</span>
          <span className="detail-value">
            {appointmentDetails.user?.gender}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Date:</span>
          <span className="detail-value">
            {new Date(appointmentDetails.dateTime).toLocaleDateString()}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">
            {new Date(appointmentDetails.dateTime).toLocaleTimeString()}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Session Mode:</span>
          <span className="detail-value">{appointmentDetails.sessionMode}</span>
        </div>
      </div>
      <button
        className="start-button"
        onClick={startSession}
        style={{ backgroundColor: "#D67449", color: "white" }}
        disabled={isSessionStarted}
      >
        {isSessionStarted ? "Session Started" : "Start"}
      </button>
      <button
        className="first-session-notes-button"
        onClick={handleFirstSessionNotes}
        style={{
          backgroundColor: "#D67449",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          marginTop: "10px",
          cursor: "pointer",
          margin: "1rem",
        }}
      >
        First Session Notes
      </button>
    </div>
  );
}

export default PatientDetails;
