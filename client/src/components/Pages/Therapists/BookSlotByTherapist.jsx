import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapist } from "../../redux/Action";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Footer from "../Footer";

const formatDate = date => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date)
    .toLocaleDateString(undefined, options)
    .replace(/\//g, "-");
};

const Popup = ({ selectedTimeSlot, selectedDate, onClose, onBookNow }) => {
  const formattedDate = formatDate(selectedDate);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth={true}>
      <DialogTitle
        style={{
          backgroundColor: "#68B545",
          color: "#fff",
        }}
      >
        <span>Date: {formattedDate}</span>
        <Button
          style={{
            position: "absolute",
            right: "8px",
            top: "8px",
            color: "#fff",
          }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogTitle>
      <DialogContent
        style={{
          padding: "16px",
          backgroundColor: "#68B545",
          color: "#fff",
        }}
      >
        <p>Start Time: {selectedTimeSlot.startTime}</p>
        <p>End Time: {selectedTimeSlot.endTime}</p>
        <p>
          Session Type: {selectedTimeSlot.sessionType}{" "}
          {selectedTimeSlot.sessionType === "offline" && "/ Online"}
        </p>
        {selectedTimeSlot.location && (
          <p>Location: {selectedTimeSlot.location}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onBookNow}
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#68B545",
            color: "#fff",
          }}
        >
          Book Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function BookSlotByTherapist() {
  const [isLoading, setIsLoading] = useState(true);
  const { userid, therapistid } = useParams(); // Access the therapist ID from the URL parameter
  const dispatch = useDispatch();
  const therapist = useSelector(state => state.therapist);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [userId, setUserId] = useState();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const hideMessage = () => {
    setShowMessage(false);
    setMessage("");
    setError(false);
  };

  const handleBookNow = () => {
    if (!selectedTimeSlot) {
      return; // If no time slot is selected, do nothing
    }

    console.log("hu");

    const { mode } = selectedTimeSlot;
    // Prepare the data for the API request
    console.log(selectedTimeSlot);
    console.log(selectedTimeSlot.startTime);
    const appointmentData = {
      therapistId: therapistid,
      userId: userId,
      dateTime: selectedDate,
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
      session: {
        mode: "online",
        duration: 60,
      },
    };

    console.log(appointmentData);

    // Make the API request
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/appointments/therapist`,
        appointmentData
      )
      .then(response => {
        // Handle the success response here, if needed
        console.log("Appointment booked successfully!");
        setMessage("Thank you for booking!");
        setShowMessage(true);
        handleClosePopup(); // Close the popup after booking
        setTimeout(() => {
          hideMessage();
          window.open("/dashboard");
        }, 2000); // Hide the message after 2 seconds and reload the page
      })
      .catch(error => {
        // Handle errors here, if needed
        console.error("Error booking appointment:", error);
        setMessage("Booking failed. Please try again later.");
        setError(true);
        setShowMessage(true);
        setTimeout(() => {
          hideMessage();
          window.location.href = "/appointment"; // Set the desired URL
        }, 2000);
      });
  };
  useEffect(() => {
    // Assuming you have the JWT token stored in local storage under the key "jwtToken"
    const token = localStorage.getItem("token");

    if (token) {
      // Decoding the token
      // Accessing the 'id' from the payload
      const id = userid;

      // Setting the therapistId state with the extracted ID
      setUserId(id);
    }
  }, []);

  console.log(selectedTimeSlot);
  console.log(selectedDate);

  const handleTimeSlotClick = (timeSlot, date) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedDate(date);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setSelectedTimeSlot(null);
    setPopupVisible(false);
  };

  useEffect(() => {
    dispatch(fetchTherapist(therapistid)); // Fetch the therapist using the ID
  }, [dispatch, therapistid]);

  useEffect(() => {
    if (therapist !== null) {
      setIsLoading(false);
    }
  }, [therapist]);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching the therapist data
  }

  if (!therapist) {
    return <div>No therapist found.</div>; // Display a message if therapist is empty
  }

  const sessions = therapist?.sessions; // Add the sessions data from the therapist object

  console.log("Hello");
  return (
    <>
      <div>
        <h2 style={{ fontSize: "24px" }}>Session Slots</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            marginLeft: "3.5rem",
          }}
        >
          {sessions && Array.isArray(sessions) && sessions.length > 0 ? (
            sessions.map(session => (
              <div
                key={session?.date}
                style={{
                  flex: "0 0 250px",
                  marginRight: "20px",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    backgroundColor: "#5179BD",
                    color: "white",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                  }}
                >
                  Date: {formatDate(session?.date)}
                </h3>
                {session.timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    onClick={() => handleTimeSlotClick(timeSlot, session.date)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#68B545",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textDecoration: "none",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseOver={() => {
                      // Apply hover styles on mouse over
                      timeSlot.style = {
                        ...timeSlot.style,
                        backgroundColor: "#68b545",
                        color: "black",
                      };
                      setSelectedTimeSlot({ ...selectedTimeSlot });
                    }}
                    onMouseOut={() => {
                      // Revert to default styles on mouse out
                      timeSlot.style = {
                        ...timeSlot.style,
                        backgroundColor: "#68B545",
                        color: "white",
                      };
                      setSelectedTimeSlot({ ...selectedTimeSlot });
                    }}
                  >
                    {timeSlot.startTime} - {timeSlot.endTime}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>No session slots available.</div>
          )}
        </div>
      </div>
      {popupVisible && (
        <Popup
          selectedTimeSlot={selectedTimeSlot}
          selectedDate={selectedDate}
          onClose={handleClosePopup}
          onBookNow={handleBookNow}
        />
      )}
      {popupVisible && (
        <Popup
          selectedTimeSlot={selectedTimeSlot}
          selectedDate={selectedDate}
          onClose={handleClosePopup}
          onBookNow={handleBookNow}
        />
      )}
      {showMessage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: "20px" }}>
            {error ? <h3>Error: {message}</h3> : <h3>{message}</h3>}
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
}

export default BookSlotByTherapist;
