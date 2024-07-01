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
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      const id = decodedToken.userId;
      setTherapistId(id);
    }
  }, []);

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (therapistId) {
        try {
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
          console.error("Error fetching therapist data:", error);
        }
      }
    };

    fetchTherapistData();
  }, [therapistId]);

  const handleDetails = appointmentId => {
    console.log("Details button clicked for appointment:", appointmentId);
    window.open(`/patient-details/${appointmentId}`, "_blank");
  };

  return (
    <>
      <div className="centerTherapistsDetails">
        <div className="therapistHeader">
          <div className="therapistDetailsDiv">
            <img
              src={therapist?.image}
              alt="Rounded"
              className="therapistImage"
            />
          </div>
          <img src={inspironWheel} alt="watermark" className="inspironWheel" />
          <div className="therapistsName">{therapist?.name}</div>
          <span className="therapistsDetails">{therapist?.designation}</span>
        </div>
        <div className="tehrapistsSessionsDetails">
          <div className="tehrapistsSessionsDetailsDivs1 sessions1">
            <div className="sessionCount">
              {todayAppointments?.totalPatients}
            </div>
            <div className="sessionLabel">Today's Patients</div>
          </div>
          <div className="tehrapistsSessionsDetailsDivs1 sessions2">
            <div className="sessionCount">
              {upcomingAppointments?.totalUpcomingPatients}
            </div>
            <div className="sessionLabel">Upcoming appointments</div>
          </div>
          <div className="tehrapistsSessionsDetailsDivs1 sessions3">
            <div className="sessionCount">{allAppointments?.totalPatients}</div>
            <div className="sessionLabel">Total appointments</div>
          </div>
        </div>
      </div>
      <div>
        <span>Today Appointment</span>
        <div className="table-container">
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
                  <td className="table-body-cell">
                    {appointment?.user?.gender}
                  </td>
                  <td className="table-body-cell">{appointment?.user?.age}</td>
                  <td className="table-body-cell">
                    {new Date(appointment?.dateTime).toLocaleDateString()}
                  </td>
                  <td className="table-body-cell">{appointment?.startTime}</td>
                  <td className="table-body-cell">
                    {appointment?.sessionMode}
                  </td>
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
      </div>
      <Footer />
    </>
  );
};

export default TherapistHomePage;
