import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PatientDetails.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
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

  const openBookingPage = () => {
    // Open the booking page in a new window
    window.open(
      `/bookSlot/${appointmentDetails?.user?._id}/${appointmentDetails?.therapist}`,
      "_blank"
    );
  };

  const sessionNotes = appointmentDetails?.sessionnotes;

  const endSession = async () => {
    console.log(
      `http://localhost:4000/api/v1/users/${appointmentDetails?.user?._id}/ended/${appointmentDetails?._id}`
    );
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/users/${appointmentDetails?.user?._id}/ended/${appointmentDetails?._id}`
      );

      // Optionally, you can handle the response if needed
      console.log("Session ended:", response.data);

      // Refresh the page after the API call
      window.location.reload();
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const openFirstSessionNotes = () => {
    window.open(
      `/patient-details-first-session-notes/${appointmentDetails?.user?._id}`,
      "_blank"
    );
  };

  const openExtendSession = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/appointments/${id}/extend-session`
      );
      console.log("API Response:", response.data);

      // Show a success toast notification
      toast.success(response.data.message, {
        onClose: () => {
          // Reload the page after the success toast message is closed
          window.location.reload();
        },
      });

      // Do something with the response if needed
    } catch (error) {
      console.error("Error making API request:", error);

      // Show an error toast notification
      toast.error("Failed to extend session. Please try again."); // Customize the error message as needed
    }
  };
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
  }, []);

  if (!appointmentDetails || !therapistDetails) {
    return <div>Loading...</div>;
  }

  const startSession = async () => {
    try {
      console.log("Start button clicked");
      const response = await axios.get(
        `http://localhost:4000/api/v1/users/status/${id}`
      );
      console.log("API Response:", response.data);
      window.open(therapistDetails?.meetLink, "_blank");
      console.log(therapistDetails?.meetLink);
      window.location.reload();

      // Open the meeting link in a new window
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };

  // ... existing code ...

  const handleSave = async e => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Collect form data
    const formData = {
      summary: e.target.summary.value,
      growthCurve: e.target.growthCurve.value,
      therapeuticTechniques: e.target.therapeuticTechniques.value,
      homeworkGiven: e.target.homeworkGiven.value,
      nextSessionPlan: e.target.nextSessionPlan.value,
      sharedWithPatient: e.target.sharedWithPatient.checked,
      sharedWithPsychiatrist: e.target.sharedWithPsychiatrist.checked,
      generateReport: e.target.generateReport.checked,
    };

    try {
      console.log("Start button clicked");
      const response = await axios.put(
        `http://localhost:4000/api/v1/appointments/${appointmentDetails?._id}/sessionotes`,
        formData, // The data you want to update
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Form submitted successfully");
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error making API request:", error);
      toast.error("Form submission failed");
    }

    // Log the form data as JSON
    console.log(JSON.stringify(formData, null, 2));

    // Rest of the save logic...
  };

  console.log(appointmentDetails);

  const paperStyle = {
    backgroundColor: "#F5F5F5", // Light gray background
    padding: "32px",
    borderRadius: "8px",
  };

  const fieldStyle = {
    marginBottom: "16px",
  };

  const openPrescription = () => {
    window.open(`/prescription/${id}`, "_blank"); // "_blank" opens in a new window/tab
  };

  return (
    <>
      <div className="profile-container">
        <h1 className="profile-title">Patient Details</h1>
        <ToastContainer />
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
            <span className="detail-value">{appointmentDetails.startTime}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Session Mode:</span>
            <span className="detail-value">
              {appointmentDetails?.sessionMode}
            </span>
          </div>
        </div>
        <div
          className="detail-item meet-link-container"
          style={{ marginTop: "1rem" }}
        >
          <span className="detail-label">Meet Link:</span>
          <span className="detail-value">{therapistDetails?.meetLink}</span>
        </div>
        {appointmentDetails?.status === "pending" &&
          appointmentDetails?.sessionstatus !== "Completed" && (
            <button
              className="start-button"
              onClick={startSession}
              style={{ backgroundColor: "#D67449", color: "white" }}
            >
              Start
            </button>
          )}
        {appointmentDetails?.status === "started" && (
          <>
            <button
              className="book-session-button"
              style={{
                backgroundColor: "#D67449",
                color: "white",
                marginLeft: "1rem",
              }}
              disabled={true}
            >
              Started
            </button>
            <button
              className="book-session-button"
              style={{
                backgroundColor: "#D67449",
                color: "white",
                marginLeft: "1rem",
              }}
              onClick={endSession}
            >
              End Session
            </button>
            {appointmentDetails.firstsession === "Pending" ? (
              <button
                className="book-session-button"
                style={{
                  backgroundColor: "#D67449",
                  color: "white",
                  marginLeft: "1rem",
                }}
                onClick={openExtendSession}
              >
                Extend Session
              </button>
            ) : null}
            <button
              className="book-session-button"
              style={{
                backgroundColor: "#D67449",
                color: "white",
                marginLeft: "1rem",
              }}
              onClick={openFirstSessionNotes}
            >
              First Session Note
            </button>
            <button
              className="book-session-button"
              style={{
                backgroundColor: "#D67449",
                color: "white",
                marginLeft: "1rem",
              }}
              onClick={openBookingPage}
            >
              Book Session
            </button>
            {therapistDetails.psychiatriste === 0 ? (
              <button
                className="book-session-button"
                style={{
                  backgroundColor: "#D67449",
                  color: "white",
                  marginLeft: "1rem",
                }}
                onClick={openPrescription}
              >
                Extend Session
              </button>
            ) : null}
            {appointmentDetails.extensionprice === 0 ? (
              <button
                className="book-session-button"
                style={{
                  backgroundColor: "#D67449",
                  color: "white",
                  marginLeft: "1rem",
                }}
                onClick={openExtendSession}
              >
                Extend Session
              </button>
            ) : null}
          </>
        )}
      </div>

      {appointmentDetails?.status === "ended" &&
        appointmentDetails?.sessionstatus !== "Completed" && (
          <>
            <form
              onSubmit={handleSave}
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
                <label style={{ fontWeight: "bold", flex: "0 0 100px" }}>
                  Name:
                </label>
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
                <label style={{ fontWeight: "bold" }}>
                  Growth curve points:
                </label>
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
            <ToastContainer />
          </>
        )}
      {appointmentDetails?.sessionstatus === "Completed" && (
        <>
          <Container
            maxWidth="md"
            style={{
              marginTop: "-5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Paper elevation={3} style={paperStyle}>
              <Typography
                variant="h4"
                style={{ marginBottom: "1rem", color: "#333" }}
              >
                Therapist's Session Notes
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Shared with Patient"
                    value={sessionNotes.sharedWithPatient ? "Yes" : "No"}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                  <TextField
                    label="Shared with Psychiatrist"
                    value={sessionNotes.sharedWithPsychiatrist ? "Yes" : "No"}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                  <TextField
                    label="Generate Report"
                    value={sessionNotes.generateReport ? "Yes" : "No"}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                  <TextField
                    label="Growth Curve Points"
                    value={sessionNotes.Growthcurvepoints}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Homework Given"
                    value={sessionNotes.Homeworkgiven}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                  <TextField
                    label="Next Session Plan"
                    value={sessionNotes.Nextsessionplan}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                  <TextField
                    label="Summary"
                    value={sessionNotes.Summary}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                  <TextField
                    label="Therapeutic Techniques Used"
                    value={sessionNotes.TherapeuticTechniquesused}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    style={fieldStyle}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
}

export default PatientDetails;
