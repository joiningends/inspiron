import React, { useState, useEffect } from "react";
import "./BookTime.css";
import MyImg from "./myimg.jpg";
import favorite from "./white-star.png";
import thubmsup from "./like-white.png";
import clock from "./white-clock.png";
import happy from "./white-happy.png";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapist } from "../redux/Action";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Popup = ({ selectedTimeSlot, selectedDate, onClose, onBookNow }) => {
  const { id } = useParams();
  return (
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
        <h3>Date: {selectedDate}</h3>
        <p>Start Time: {selectedTimeSlot.startTime}</p>
        <p>End Time: {selectedTimeSlot.endTime}</p>
        <p>
          Session Type: {selectedTimeSlot.sessionType}{" "}
          {selectedTimeSlot.sessionType === "offline" && "/ Online"}
        </p>
        <p>Location: {selectedTimeSlot.location}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={onBookNow}>Book Now</button>
      </div>
    </div>
  );
};

function BookTime() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams(); // Access the therapist ID from the URL parameter
  const dispatch = useDispatch();
  const therapist = useSelector(state => state.therapist);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    // Assuming you have the JWT token stored in local storage under the key "jwtToken"
    const token = localStorage.getItem("token");

    if (token) {
      // Decoding the token
      const decodedToken = jwt_decode(token);

      // Accessing the 'id' from the payload
      const id = decodedToken.userId;

      // Setting the therapistId state with the extracted ID
      setUserId(id);
    }
  }, []);

  console.log(selectedTimeSlot);
  console.log(selectedDate);

  const handleBookNow = () => {
    if (!selectedTimeSlot) {
      return; // If no time slot is selected, do nothing
    }

    const { mode } = selectedTimeSlot;
    // Prepare the data for the API request
    const appointmentData = {
      therapistId: id,
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
      .post("http://localhost:4000/api/v1/appointments", appointmentData)
      .then(response => {
        // Handle the success response here, if needed
        console.log("Appointment booked successfully!");
        handleClosePopup(); // Close the popup after booking
        window.location.reload();
      })
      .catch(error => {
        // Handle errors here, if needed
        console.error("Error booking appointment:", error);
        window.location.reload();
      });
  };

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
    dispatch(fetchTherapist(id)); // Fetch the therapist using the ID
  }, [dispatch, id]);

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

  return (
    <>
      <div className="booktime-container1">
        <div className="booktime-imgDiv">
          <img
            src={`data:${therapist?.image?.contentType};base64,${therapist?.image?.data}`}
            className="booktime-doctorImg"
            alt="Rounded"
          />
        </div>
        <div className="booktime-aboutDiv">
          <div className="booktime-containerr2">
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={favorite}
                  className="booktime-profileIcons"
                  alt="Favorite"
                />
              </span>
              <span className="booktime-subDetails">
                <h3>{therapist.userRating}/5</h3>
              </span>
              <span className="booktime-lastUserDetailRow">User Rating</span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={thubmsup}
                  className="booktime-profileIcons"
                  alt="Thumbs Up"
                />
              </span>
              <span>
                <h3 className="subDetails">
                  {therapist.usersRecommended.length}
                </h3>
              </span>
              <span
                className="lastUserDetailRow"
                style={{ textAlign: "center" }}
              >
                User Recommended
              </span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={clock}
                  className="booktime-profileIcons"
                  alt="Clock"
                />
              </span>
              <span>
                <h3 className="subDetails">{therapist.availableSessions}</h3>
              </span>
              <span className="lastUserDetailRow">Available Sessions</span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={happy}
                  className="booktime-profileIcons"
                  alt="Happy"
                />
              </span>
              <span>
                <h3 className="subDetails">{therapist.userReviews.length}</h3>
              </span>
              <span className="lastUserDetailRow1">User Reviews</span>
            </div>
          </div>
        </div>
      </div>
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
                  Date: {session?.date}
                </h3>
                {session.timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    onClick={() => handleTimeSlotClick(timeSlot, session.date)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(104, 181, 69, 0.25)",
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
                        backgroundColor: "rgba(104, 181, 69, 0.25)",
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
    </>
  );
}

export default BookTime;
