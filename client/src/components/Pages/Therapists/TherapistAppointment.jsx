import React, { useState, useEffect } from "react";
import { fetchTodayAppointments } from "../../redux/Action";
import {
  getAppointmentsByTherapist,
  getUpcomingAppointmentsByTherapist,
} from "../../redux/Action";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

function TherapistAppointment() {
  const [activeButton, setActiveButton] = useState(1);
  const dispatch = useDispatch();

  const todayAppointments = useSelector(state => state.todayAppointments);
  const allAppointments = useSelector(state => state.appointmentByTherapist);
  const upcomingAppointments = useSelector(state => state.upcomingAppointments);

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
          await dispatch(fetchTodayAppointments(therapistId));
          await dispatch(getUpcomingAppointmentsByTherapist(therapistId));
          await dispatch(getAppointmentsByTherapist(therapistId));
        } catch (error) {
          // Handle the error here (e.g., show an error message)
          console.error("Error fetching therapist data:", error);
        }
      }
    };

    fetchTherapistData();
  }, [therapistId]);

  console.log(upcomingAppointments);
  console.log(allAppointments);
  console.log(todayAppointments);

  const handleButtonClick = buttonId => {
    setActiveButton(buttonId);
  };

  const handleDetailsClick = patientId => {
    // Open a new page with the patient's details
    window.open(`/patient-details/${patientId}`, "_blank");
  };

  let tableData;
  let appointmentCount = 0;

  if (activeButton === 1) {
    tableData = todayAppointments?.appointments;
    appointmentCount = todayAppointments?.appointments?.length;
  } else if (activeButton === 2) {
    tableData = upcomingAppointments;
    appointmentCount = upcomingAppointments?.length;
  } else if (activeButton === 3) {
    tableData = allAppointments?.appointments;
    appointmentCount = allAppointments?.appointments?.length;
  }

  const todayAppointmentCount = todayAppointments?.appointments?.length || 0;
  const upcomingAppointmentCount = upcomingAppointments?.length || 0;
  const allAppointmentCount = allAppointments?.appointments?.length || 0;

  return (
    <div>
      <div>
        <button
          onClick={() => handleButtonClick(1)}
          className={activeButton === 1 ? "active" : ""}
          style={{
            width: "200px",
            background:
              activeButton === 1 ? "#5179BD" : "rgba(81, 121, 189, 0.08)",
            color: activeButton === 1 ? "#fff" : "#333",
            borderRadius: "4px",
            padding: "10px",
            margin: "5px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Today Appointments
          <span
            className="appointment-count"
            style={{
              background: "#D67449",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              marginLeft: "5px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {todayAppointmentCount}
          </span>
        </button>
        <button
          onClick={() => handleButtonClick(2)}
          className={activeButton === 2 ? "active" : ""}
          style={{
            width: "200px",
            background:
              activeButton === 2 ? "#5179BD" : "rgba(81, 121, 189, 0.08)",
            color: activeButton === 2 ? "#fff" : "#333",
            borderRadius: "4px",
            padding: "10px",
            margin: "5px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Upcoming Appointments
          <span
            className="appointment-count"
            style={{
              background: "#D67449",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              marginLeft: "5px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {upcomingAppointmentCount}
          </span>
        </button>
        <button
          onClick={() => handleButtonClick(3)}
          className={activeButton === 3 ? "active" : ""}
          style={{
            width: "200px",
            background:
              activeButton === 3 ? "#5179BD" : "rgba(81, 121, 189, 0.08)",
            color: activeButton === 3 ? "#fff" : "#333",
            borderRadius: "4px",
            padding: "10px",
            margin: "5px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          All Appointments
          <span
            className="appointment-count"
            style={{
              background: "#D67449",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              marginLeft: "5px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {allAppointmentCount}
          </span>
        </button>
      </div>
      {tableData && (
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
            {tableData.map(appointment => (
              <tr key={appointment?._id} className="table-body-row">
                <td className="table-body-cell">{appointment?.userName}</td>
                <td className="table-body-cell">{appointment?.userGender}</td>
                <td className="table-body-cell">{appointment?.userAge}</td>
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
                    style={{
                      background: "#D67449",
                      color: "#fff",
                      borderRadius: "4px",
                      padding: "8px",
                      margin: "4px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={() => handleDetailsClick(appointment?._id)}
                  >
                    <span
                      className="button-icon"
                      style={{ color: "white", display: "block" }}
                    >
                      &#9432;
                    </span>
                    Details
                  </button>
                </td>
                <td className="table-body-cell">
                  {appointment?.googleMeetCallStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TherapistAppointment;
