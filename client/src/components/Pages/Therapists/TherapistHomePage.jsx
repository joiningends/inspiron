import React, { useEffect, useState } from "react";
import "./TherapistHomePage.css"; // Import the CSS file for styling
import { fetchTodayAppointments } from "../../redux/Action";
import {
  getAppointmentsByTherapist,
  fetchTherapist,
  getUpcomingAppointmentsByTherapist,
} from "../../redux/Action";
import { useDispatch, useSelector } from "react-redux";
import inspironWheel from "../inspironwhitewheel.png";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Footer from "../Footer";

const TherapistHomePage = () => {
  const dispatch = useDispatch();

  const todayAppointments = useSelector(state => state.todayAppointments);
  const allAppointments = useSelector(state => state.appointmentByTherapist);
  const therapist = useSelector(state => state.therapist);
  const [upcomingAppointments, setUpcomingAppointment] = useState([]);

  const [therapistId, setTherapistId] = useState(null);

  useEffect(() => {
    // Assuming you have the JWT token stored in local storage under the key "jwtToken"
    const token = localStorage.getItem("token");

    if (token) {
      // Decoding the token
      const decodedToken = jwt_decode(token);

      // Accessing the 'id' from the payload
      const id = decodedToken.userId;

      // Setting the therapistId state with the extracted ID
      setTherapistId(id);
    }
  }, []);

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (therapistId) {
        try {
          // Call the API to fetch therapist data with the therapistId
          const apiUrlUpcoming = `${process.env.REACT_APP_SERVER_URL}/appointments/therapists/${therapistId}/upcoming`;

          axios
            .get(apiUrlUpcoming)
            .then(response => {
              setUpcomingAppointment(response.data);
            })
            .catch(error => {
              console.error("Error fetching upcoming appointments:", error);
            });

          await dispatch(fetchTherapist(therapistId));
          await dispatch(fetchTodayAppointments(therapistId));
          await dispatch(getAppointmentsByTherapist(therapistId));
          await dispatch(getUpcomingAppointmentsByTherapist(therapistId));
        } catch (error) {
          // Handle the error here (e.g., show an error message)
          console.error("Error fetching therapist data:", error);
        }
      }
    };

    fetchTherapistData();
  }, [therapistId]);

  console.log(therapist);
  console.log(todayAppointments);
  console.log(allAppointments);
  useEffect(() => {}, []);

  const handleDetails = appointmentId => {
    // Handle details button click for the given appointmentId
    console.log("Details button clicked for appointment:", appointmentId);
    window.open(`/patient-details/${appointmentId}`, "_blank");
  };

  return (
    <>
      <div className="centerTherapistsDetails">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#68B545",
            padding: "1rem",
            position: "relative",
          }}
        >
          <div className="therapistDetailsDiv">
            <img
              src={therapist?.image}
              alt="Rounded"
              className="therapistImage"
            />
          </div>
          <img
            src={inspironWheel}
            alt="watermark"
            style={{
              position: "absolute",
              width: "7rem",
              left: "1px",
            }}
          />
          <div className="therapistsName" style={{ color: "white" }}>
            {therapist?.name}
          </div>
          <span className="therapistsDetails" style={{ color: "white" }}>
            {therapist?.designation}
          </span>
        </div>
        <div className="tehrapistsSessionsDetails">
          <div
            className="tehrapistsSessionsDetailsDivs1"
            style={{
              backgroundColor: "#5179BD",
              borderRadius: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{ fontSize: "2rem", color: "white", fontWeight: "bold" }}
            >
              {todayAppointments?.totalPatients}
            </div>
            <div style={{ fontSize: "1rem", color: "white" }}>
              Todays Patients
            </div>
          </div>
          <div
            className="tehrapistsSessionsDetailsDivs1"
            style={{
              backgroundColor: "#43AEB4",
              borderRadius: "2rem",
              margin: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{ fontSize: "2rem", color: "white", fontWeight: "bold" }}
            >
              {upcomingAppointments?.totalUpcomingPatients}
            </div>
            <div style={{ fontSize: "1rem", color: "white" }}>
              Upcoming appointments
            </div>
          </div>
          <div
            className="tehrapistsSessionsDetailsDivs1"
            style={{
              backgroundColor: "#4690B4",
              borderRadius: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{ fontSize: "2rem", color: "white", fontWeight: "bold" }}
            >
              {allAppointments?.totalPatients}
            </div>
            <div style={{ fontSize: "1rem", color: "white" }}>
              Total appointments
            </div>
          </div>
        </div>
      </div>
      <div>
        <span>Today Appointment</span>
        <table className="today-appointments-table">
          <thead>
            <tr>
              <th className="table-header-cell">Patient Name</th>
              <th className="table-header-cell">Gender</th>
              <th className="table-header-cell">Age</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Time</th>
              <th className="table-header-cell">Session Mode</th>
              <th className="table-header-cell">Actions</th>
              <th className="table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments?.appointments?.map(appointment => (
              <tr key={appointment._id} className="table-body-row">
                <td className="table-body-cell">{appointment?.user?.name}</td>
                <td className="table-body-cell">{appointment?.user?.gender}</td>
                <td className="table-body-cell">{appointment?.user?.age}</td>
                <td className="table-body-cell">
                  {new Date(appointment?.dateTime).toLocaleDateString()}
                </td>
                <td className="table-body-cell">
                  {new Date(appointment?.dateTime).toLocaleTimeString()}
                </td>
                <td className="table-body-cell">{appointment?.sessionMode}</td>
                <td
                  className="table-body-cell"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="button details-button"
                    onClick={() => handleDetails(appointment?._id)}
                  >
                    <span className="button-icon">&#9432;</span>Details
                  </button>
                </td>
                <td className="table-body-cell">
                  {appointment?.googleMeetCallStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default TherapistHomePage;
