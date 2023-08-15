import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PatientDetails.css";

function PatientDetails() {
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [therapistDetails, setTherapistDetails] = useState(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionNote, setSessionNote] = useState("");
  const [summaryOptions, setSummaryOptions] = useState({
    growthCurvePoints: false,
    therapeuticTechniques: false,
    homeworkGiven: false,
    nextSessionPlan: false,
  });
  const [detailsToBeShared, setDetailsToBeShared] = useState({
    withPsychiatrist: false,
    generateReport: false,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(appointmentDetails);

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

  // ... existing code ...

  const handleSave = e => {
    e.preventDefault();
    const selectedOptions = [];

    if (summaryOptions.growthCurvePoints) {
      selectedOptions.push("Growth curve points");
    }

    if (summaryOptions.therapeuticTechniques) {
      selectedOptions.push("Therapeutic Techniques used");
    }

    if (summaryOptions.homeworkGiven) {
      selectedOptions.push("Homework given");
    }

    if (summaryOptions.nextSessionPlan) {
      selectedOptions.push("Next session plan");
    }

    if (detailsToBeShared.withPsychiatrist) {
      selectedOptions.push("Details to be shared with psychiatrist");
    }

    if (detailsToBeShared.generateReport) {
      selectedOptions.push("Generate report");
    }

    // Create the request body with the selected options
    const requestBody = {
      sessionnotes: {
        option: selectedOptions,
      },
    };

    console.log(selectedOptions);

    console.log(id);

    // Make the PUT request to update the session notes and details to be shared
    fetch(
      `http://localhost:4000/api/v1/users/${appointmentDetails?.user?._id}/sessionotes`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log("Session notes and details to be shared saved:", data);
        // Handle any success message or state updates as needed
      })
      .catch(error => {
        console.error(
          "Error saving session notes and details to be shared:",
          error
        );
        // Handle any error scenarios
      });
  };

  console.log(appointmentDetails);

  return (
    <>
      <div className="profile-container">
        <h1 className="profile-title">Patient Details</h1>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">
              {appointmentDetails?.user?.name}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Age:</span>
            <span className="detail-value">
              {appointmentDetails?.user?.age}
            </span>
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
            <span className="detail-value">
              {appointmentDetails.sessionMode}
            </span>
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
      </div>
      <form
        style={{
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          maxWidth: "600px",
          backgroundColor: "#68B545",
          color: "black",
          fontSize: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ fontWeight: "bold", flex: "0 0 100px" }}>Name:</label>
          <span style={{ fontWeight: "normal" }}>
            {appointmentDetails?.user?.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>Summary:</label>
          <textarea
            name="summary"
            rows={5}
            style={{
              width: "100%",
              fontSize: "16px",
              padding: "8px",
              borderRadius: "5px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>Growth curve points:</label>
          <textarea
            name="growthCurve"
            rows={5}
            style={{
              width: "100%",
              fontSize: "16px",
              padding: "8px",
              borderRadius: "5px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>
            Therapeutic Techniques used:
          </label>
          <textarea
            name="therapeuticTechniques"
            rows={5}
            style={{
              width: "100%",
              fontSize: "16px",
              padding: "8px",
              borderRadius: "5px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>Homework given:</label>
          <textarea
            name="homeworkGiven"
            rows={5}
            style={{
              width: "100%",
              fontSize: "16px",
              padding: "8px",
              borderRadius: "5px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>Next session plan:</label>
          <textarea
            name="nextSessionPlan"
            rows={5}
            style={{
              width: "100%",
              fontSize: "16px",
              padding: "8px",
              borderRadius: "5px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>
            Details to be shared with patient:
          </label>
          <input type="checkbox" name="sharedWithPatient" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>
            Details to be shared with psychiatrist:
          </label>
          <input type="checkbox" name="sharedWithPsychiatrist" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>Generate report:</label>
          <input type="checkbox" name="generateReport" />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#ffa500",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}

export default PatientDetails;
