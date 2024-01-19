import React, { useState, useEffect } from "react";
import "./BookTime.css";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapist } from "../redux/Action";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Modal, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles (adjust the path as needed)
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { FaHeart, FaThumbsUp, FaClock, FaSmile } from "react-icons/fa";
import DialogTitle from "@material-ui/core/DialogTitle";
import Footer from "./Footer";

import RatingIcon from "./starForKnowMorePage.png";
import OnlineIcon from "./online-meetingForKnowMorePage.png";
import TotalSessionIcon from "./interactionsForKnowMorePage.png";
import OfflineIcon from "./meetingImageForKnowMorepage.png";
const Popup = ({
  selectedTimeSlot,
  selectedDate,
  onClose,
  onBookNow,
  cleanUserId,
  onBookNowCorp,
  isBalanceGreaterThanZero,
}) => {
  const { id } = useParams();

  const groupId = localStorage.getItem("groupid");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <div
        style={{
          backgroundColor: "#5179BD",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          width: "400px",
          maxWidth: "90%",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: "1.8rem", marginBottom: "20px", color: "#fff" }}>
          Booking Details
        </h3>
        {selectedDate && (
          <p
            style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#fff" }}
          >
            Date: {selectedDate}
          </p>
        )}
        {selectedTimeSlot.startTime && (
          <p
            style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#fff" }}
          >
            Start Time: {selectedTimeSlot.startTime}
          </p>
        )}
        {selectedTimeSlot.endTime && (
          <p
            style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#fff" }}
          >
            End Time: {selectedTimeSlot.endTime}
          </p>
        )}
        {selectedTimeSlot.sessionType && (
          <p
            style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#fff" }}
          >
            Session Type: {selectedTimeSlot.sessionType}{" "}
            {selectedTimeSlot.sessionType === "offline" && "/ Online"}
          </p>
        )}
        {selectedTimeSlot.location && (
          <p
            style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#fff" }}
          >
            Location: {selectedTimeSlot.location}
          </p>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "white",
              border: "1px solid #D67449",
              borderRadius: "5px",
              color: "#D67449",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            onClick={onClose}
          >
            Close
          </button>
          {groupId === "null" ? (
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "white",
                border: "1px solid #D67449",
                borderRadius: "5px",
                color: "#D67449",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
              onClick={onBookNow}
            >
              Next
            </button>
          ) : (
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "white",
                border: "1px solid #D67449",
                borderRadius: "5px",
                color: "#D67449",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
              onClick={onBookNowCorp}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function BookTime() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams(); // Access the therapist ID from the URL parameter
  const dispatch = useDispatch();
  const therapist = useSelector(state => state.therapist);
  console.log(therapist)
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [userId, setUserId] = useState();
  const [appointmentId, setAppointmentId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentNewId, setAppointmentNewId] = useState("");

  const storedUserId = localStorage.getItem("userId");
  const cleanUserId = storedUserId.replace(/"/g, "");

  const [userData, setUserData] = useState(null);
  const [coinData, setCoinData] = useState([]);

  const [therapistData, setTherapistData] = useState(null);
  const [availableSession, setAvailableSession] = useState("");

  const paginationButtonStyle = {
    backgroundColor: "#5179BD",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    outline: "none",
    marginRight: "10px",
  };

  // const handleDialogChoice = (choice) => {
  //   setOpenDialog(false); // Close the dialog

  //   if (choice === 'yes') {
  //     // Code for 'Yes' choice
  //     // axios.post(...).then(response => { ... });
  //   } else {
  //     // Code for 'No' choice
  //     const url = `bookYourSession/${appointmentData.therapistId}/${response.data._id}`;
  //     // window.location.href = url;
  //   }
  // };

  useEffect(() => {
    // Define the API URLs
    const therapistApiUrl = `${process.env.REACT_APP_SERVER_URL}/therapists/${id}`;

    // Send a GET request to the therapist API
    axios
      .get(therapistApiUrl)
      .then(response => {
        // Handle the successful response and store the data in state
        setTherapistData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        // Handle any errors here
        console.error("Therapist API Error:", error);
      });
  }, [id]);

  useEffect(() => {
    // Define the API URL with the patientId parameter
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/coins/${cleanUserId}`;

    // Fetch data from the API
    axios
      .get(apiUrl)
      .then(response => {
        setCoinData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [cleanUserId]);

  useEffect(() => {
    // Define the API URL
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/users/${cleanUserId}`;

    // Send a GET request to the API
    axios
      .get(apiUrl)
      .then(response => {
        // Handle the successful response and store the data in state
        setUserData(response.data);
      })
      .catch(error => {
        // Handle any errors here
        console.error("Error:", error);
      });
  }, [cleanUserId]);

  const [isBalanceGreaterThanZero, setIsBalanceGreaterThanZero] =
    useState(false);

  // Your therapist and coin data

  const coinDataArray = coinData; // Replace with your coinData

  useEffect(() => {
    // Check if therapist and coinData are available
    if (therapist && coinDataArray.length > 0) {
      // Get the therapist's level from experiencelevel[0]
     
      const therapistLevel = therapist.expriencelevel;


      // Find the corresponding coinData for the therapist's level
      const matchingCoinData = coinDataArray.find(
        coin => coin.expriencelevel[0] === therapistLevel.level
      );

      if (matchingCoinData) {
        // Check if the coinBalance is greater than 0
        if (matchingCoinData.coinBalance >= 1) {
          // Set the state variable to true
          setIsBalanceGreaterThanZero(true);
          setIsModalOpen(true);
        } else {
          // Set the state variable to false
          setIsBalanceGreaterThanZero(false);
        }
      }
    }
  }, [therapist, coinDataArray]);

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

  const handleBookNow = () => {
    if (!selectedTimeSlot) return;
    const { sessionType } = selectedTimeSlot;
    let sessionMode;
    if (sessionType.toLowerCase() === "online") sessionMode = "Online";
    else sessionMode = "Both";

    const appointmentData = {
      therapistId: id,
      userId: userId,
      dateTime: selectedDate,
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
      sessionMode,
      session: {
        mode: sessionMode,
        duration: 60,
      },
    };

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/appointments`, appointmentData)
      .then(response => {
        setAppointmentId(response.data._id);

        if (response.data.coinpositive === true) {
          // Show the dialog when response.data.coinpositive is true
          setOpenDialog(true);
          setPopupVisible(false);
          setAppointmentNewId(response.data._id);
        } else {
          // Continue with your code logic when response.data.coinpositive is false
          const url = `bookYourSession/${appointmentData.therapistId}/${response.data._id}`;
          window.location.href = url;
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          const userId = error.response.data.userId;
          const amountToPay = parseInt(errorMessage.match(/\d+/)[0]);
          const expriencelevel = error.response.data.expriencelevel;
          const userExperience =
            expriencelevel && expriencelevel.length > 0
              ? expriencelevel[0]
              : null;

          if (userId) {
            if (userExperience !== null) {
              toast.error(
                <div
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <p>
                    Please pay the amount {amountToPay} to complete your dues
                    from the previous appointment.
                  </p>
                  <button
                    style={{
                      backgroundColor: "lightcoral",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontSize: "14px",
                      borderRadius: "4px",
                      marginTop: "10px",
                    }}
                    onClick={() =>
                      handlePayNow(userId, amountToPay, expriencelevel)
                    }
                  >
                    Pay Now
                  </button>
                </div>,
                {
                  autoClose: 5000,
                  closeButton: false,
                  hideProgressBar: true,
                  style: {
                    background: "none",
                  },
                }
              );
            }
          }
        } else if (error.response && error.response.status === 409) {
          toast.error(
            <div
              style={{
                backgroundColor: "red",
                color: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <p>
                Please choose another time slot. This slot is not available.
              </p>
            </div>,
            {
              autoClose: 5000,
              closeButton: false,
              hideProgressBar: true,
              style: {
                background: "none",
              },
            }
          );
        } else {
          toast.error(
            <div
              style={{
                backgroundColor: "red",
                color: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <p>Error booking appointment: {error.message}</p>
            </div>,
            {
              autoClose: 5000,
              closeButton: false,
              hideProgressBar: true,
              style: {
                background: "none",
              },
            }
          );

          console.error("Error booking appointment:", error);
          if (error.response) {
            console.error("Status Code:", error.response.status);
            console.error("Response Data:", error.response.data);
          } else if (error.request) {
            console.error("No response received from the server");
          } else {
            console.error("Error setting up the request:", error.message);
          }
        }
      });
  };

  function handlePayNow(userId, amount, experienceLevel) {
    const paymentUrl = `/completePayment/${userId}/${amount}/${experienceLevel}`;
    window.open(paymentUrl, "_blank");
  }

  const handleBookNowCorporate = () => {
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

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/appointments`, appointmentData)
      .then(response => {
        // Handle the success response here, if needed
        setAppointmentId(response.data._id);
        window.open(`/sessionIsBookedCorp/${response.data._id}`, "_self");
      })
      .catch(error => {
        // Handle errors here, if needed
        console.error("Error booking appointment:", error);
      });

    // Make the API request
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
    setAvailableSession(
      therapist?.onlineSessionCount + therapist?.offlineSessionCount
    );
  }, [therapist]);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching the therapist data
  }

  if (!therapist) {
    return <div>No therapist found.</div>; // Display a message if therapist is empty
  }

  const sessions = therapist?.sessions; // Add the sessions data from the therapist object

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle the "Yes" button in the modal
  const handleYesClick = () => {
    // Set the state to true when the user selects "Yes"
    setIsBalanceGreaterThanZero(true);
    closeModal(); // Close the modal
  };

  // Function to handle the "No" button in the modal
  const handleNoClick = () => {
    // Set the state to false when the user selects "No"
    setIsBalanceGreaterThanZero(false);
    closeModal(); // Close the modal
  };

  // Function to format the date as "dd--MM--yyyy"
  function formatDate(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date)
      .toLocaleDateString(undefined, options)
      .replace(/\//g, "-");
  }

  // Define the current page and slots per page
  const slotsPerPage = 5;

  // Calculate the start and end indexes based on the current page
  const startIndex = (currentPage - 1) * slotsPerPage;
  const endIndex = startIndex + slotsPerPage;

  // Filter the sessions based on the current page
  const sessionsToDisplay = sessions?.slice(startIndex, endIndex);

  // Update the pagination controls
  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  const handleDialogChoice = choice => {
    setOpenDialog(false); // Close the dialog

    if (choice === "yes") {
      // Code for 'Yes' choice
      // axios.post(...).then(response => { ... });
      const appointmentNewIdValue = appointmentNewId.replace(/"/g, "");
      axios
        .put(
          `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentNewIdValue}/package`,
          {
            package: "true",
          }
        )
        .then(response => {
          // Handle the response if needed

          window.open(`/sessionIsBookedCorp/${response.data._id}`, "_self");
        })
        .catch(err => {
          toast.error(
            "There was a problem while booking your appointment. Please try again later.",
            "Error"
          );
        });
    } else {
      // Code for 'No' choice
      const appointmentNewIdValue = appointmentNewId.replace(/"/g, "");
      const url = `bookYourSession/${id}/${appointmentNewIdValue}`;
      window.location.href = url;
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Dialog open={openDialog} onClose={() => handleDialogChoice("no")}>
        <DialogTitle>Do you want to continue your ongoing package?</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select an option:</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogChoice("yes")} color="primary">
            Yes
          </Button>
          <Button onClick={() => handleDialogChoice("no")} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>

      <div className="booktime-container1">
        <div className="booktime-imgDiv">
          <img
            src={therapist?.image}
            className="booktime-doctorImg"
            alt="Rounded"
          />
        </div>
        <div className="booktime-aboutDiv">
          <div className="booktime-containerr2">
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={TotalSessionIcon}
                  alt="Expertise Icon"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
              <span>
                <h3 className="subDetails">{availableSession}</h3>
              </span>
              <span
                className="lastUserDetailRow"
                style={{ textAlign: "center" }}
              >
                Total Available Sessions
              </span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={RatingIcon}
                  alt="Expertise Icon"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
              <span>
                <h3 className="subDetails">
                  {therapist?.userRating.toFixed(1)}/5
                </h3>
              </span>
              <span
                className="lastUserDetailRow"
                style={{ textAlign: "center" }}
              >
                User Rating
              </span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={OfflineIcon}
                  alt="Expertise Icon"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
              <span>
                <h3 className="subDetails">{therapist?.offlineSessionCount}</h3>
              </span>
              <span className="lastUserDetailRow">
                Available Offline Session
              </span>
            </div>
            <div className="booktime-profileDetails" style={{ height: "35vh" }}>
              <span>
                <img
                  src={OnlineIcon}
                  alt="Online session"
                  style={{ height: "50px", width: "50px" }}
                />
              </span>
              <span>
                <h3 className="subDetails">{therapist?.onlineSessionCount}</h3>
              </span>
              <span className="lastUserDetailRow1">
                Available Online Sessions
              </span>
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
          {sessionsToDisplay &&
          Array.isArray(sessionsToDisplay) &&
          sessionsToDisplay?.length > 0 ? (
            sessionsToDisplay.map(session => (
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
                  {formatDate(session?.date)}
                </h3>
                {session.timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    onClick={() => handleTimeSlotClick(timeSlot, session.date)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between", // To add session type
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
                        backgroundColor: "white",
                        color: "white",
                      };
                      setSelectedTimeSlot({ ...selectedTimeSlot });
                    }}
                  >
                    <div>
                      {timeSlot.startTime} - {timeSlot.endTime}
                    </div>
                    <div>
                      {timeSlot.sessionType === "online/offline"
                        ? "Online/Offline"
                        : "Online"}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>No session slots available.</div>
          )}
        </div>

        {/* Pagination controls */}
        {/* Improved Pagination controls */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              ...paginationButtonStyle,
              opacity: currentPage === 1 ? 0.5 : 1, // Grey out when on the first page
              cursor: currentPage === 1 ? "not-allowed" : "pointer", // Disable pointer events when on the first page
            }}
          >
            Previous
          </button>
          <span style={{ margin: "0 10px", fontSize: "18px" }}>
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={endIndex >= sessions?.length}
            style={paginationButtonStyle}
          >
            Next
          </button>
        </div>
      </div>

      {popupVisible && (
        <Popup
          selectedTimeSlot={selectedTimeSlot}
          selectedDate={selectedDate}
          onClose={handleClosePopup}
          onBookNow={handleBookNow}
          cleanUserId={cleanUserId}
          isBalanceGreaterThanZero={isBalanceGreaterThanZero}
          onBookNowCorp={handleBookNowCorporate}
        />
      )}
      <Footer />
    </>
  );
}

export default BookTime;
