import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTherapist,
  fetchTodayAppointments,
  getAppointmentsByTherapist,
} from "../../redux/Action";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./TherapistAppointment.css";

function TherapistAppointment() {
  const [activeButton, setActiveButton] = useState(1);
  const [currentPageToday, setCurrentPageToday] = useState(1);
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentPageAll, setCurrentPageAll] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const dispatch = useDispatch();

  const therapist = useSelector(state => state.therapist);
  const todayAppointments = useSelector(state => state.todayAppointments);
  const allAppointments = useSelector(state => state.appointmentByTherapist);
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

  const handleDetailsClick = patientId => {
    window.open(`/patient-details/${patientId}`, "_blank");
  };

  const handleFillPrescriptionClick = patientId => {
    window.open(`/prescription/${patientId}`, "_blank");
  };

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (therapistId) {
        const apiUrlUpcoming = `http://localhost:4000/api/v1/appointments/therapists/${therapistId}/upcoming`;
        try {
          await dispatch(fetchTodayAppointments(therapistId));
          await dispatch(fetchTherapist(therapistId));
          axios
            .get(apiUrlUpcoming)
            .then(response => {
              setUpcomingAppointment(response.data);
            })
            .catch(error => {
              console.error("Error fetching upcoming appointments:", error);
            });
          await dispatch(getAppointmentsByTherapist(therapistId));
        } catch (error) {
          console.error("Error fetching therapist data:", error);
        }
      }
    };

    fetchTherapistData();
  }, [therapistId, dispatch]);

  const handleButtonClick = buttonId => {
    setActiveButton(buttonId);
  };

  const handlePageChangeToday = newPage => {
    if (newPage >= 1) {
      setCurrentPageToday(newPage);
    }
  };

  const handlePageChangeUpcoming = newPage => {
    if (newPage >= 1) {
      setCurrentPageUpcoming(newPage);
    }
  };

  const handlePageChangeAll = newPage => {
    if (newPage >= 1) {
      setCurrentPageAll(newPage);
    }
  };

  const renderPaginationControls = (
    currentPage,
    handlePageChange,
    totalItems
  ) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    );
  };

  const todayAppointmentCount = todayAppointments?.appointments?.length || 0;
  const upcomingAppointmentCount =
    upcomingAppointments?.totalUpcomingPatients || 0;
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
      {activeButton === 1 && (
        <div>
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
                <th className="table-header-cell">Session Note Status</th>
                {therapist?.therapisttype === "psychiatrist" && (
                  <th className="table-header-cell">Prescription</th>
                )}
              </tr>
            </thead>
            <tbody>
              {todayAppointments?.appointments
                ?.slice(
                  (currentPageToday - 1) * itemsPerPage,
                  currentPageToday * itemsPerPage
                )
                .map(appointment => (
                  <tr key={appointment?._id} className="table-body-row">
                    <td className="table-body-cell">
                      {appointment?.user?.name}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.user?.gender}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.user?.age}
                    </td>
                    <td className="table-body-cell">
                      {new Date(appointment?.dateTime).toLocaleDateString()}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.startTime}
                    </td>
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
                      {appointment?.sessionstatus}
                    </td>
                    {therapist?.therapisttype === "psychiatrist" ? (
                      <td className="table-body-cell">
                        <button
                          className="button fill-prescription-button"
                          onClick={() =>
                            handleFillPrescriptionClick(appointment?._id)
                          }
                        >
                          Fill Prescription
                        </button>
                      </td>
                    ) : (
                      <td className="table-body-cell"></td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          {renderPaginationControls(
            currentPageToday,
            handlePageChangeToday,
            todayAppointmentCount
          )}
        </div>
      )}
      {activeButton === 2 && (
        <div>
          <table className="upcoming-appointments-table">
            <thead>
              <tr>
                <th className="table-header-cell">Patient Name</th>
                <th className="table-header-cell">Gender</th>
                <th className="table-header-cell">Age</th>
                <th className="table-header-cell">Date</th>
                <th className="table-header-cell">Time</th>
                <th className="table-header-cell">Session Mode</th>
                <th className="table-header-cell">Actions</th>
                <th className="table-header-cell">Session Note Status</th>
                {therapist?.therapisttype === "psychiatrist" && (
                  <th className="table-header-cell">Prescription</th>
                )}
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments?.upcomingAppointments
                ?.slice(
                  (currentPageUpcoming - 1) * itemsPerPage,
                  currentPageUpcoming * itemsPerPage
                )
                .map(appointment => (
                  <tr key={appointment?._id} className="table-body-row">
                    <td className="table-body-cell">
                      {appointment?.user?.name}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.user?.gender}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.user?.age}
                    </td>
                    <td className="table-body-cell">
                      {new Date(appointment?.dateTime).toLocaleDateString()}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.startTime}
                    </td>
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
                      {appointment?.sessionstatus}
                    </td>
                    {therapist?.therapisttype === "psychiatrist" ? (
                      <td className="table-body-cell">
                        <button
                          className="button fill-prescription-button"
                          onClick={() =>
                            handleFillPrescriptionClick(appointment?._id)
                          }
                        >
                          Fill Prescription
                        </button>
                      </td>
                    ) : (
                      <td className="table-body-cell"></td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          {renderPaginationControls(
            currentPageUpcoming,
            handlePageChangeUpcoming,
            upcomingAppointmentCount
          )}
        </div>
      )}

      {activeButton === 3 && (
        <div>
          <table className="all-appointments-table">
            <thead>
              <tr>
                <th className="table-header-cell">Patient Name</th>
                <th className="table-header-cell">Gender</th>
                <th className="table-header-cell">Age</th>
                <th className="table-header-cell">Date</th>
                <th className="table-header-cell">Time</th>
                <th className="table-header-cell">Session Mode</th>
                <th className="table-header-cell">Actions</th>
                <th className="table-header-cell">Session Note Status</th>
                {therapist?.therapisttype === "psychiatrist" && (
                  <th className="table-header-cell">Prescription</th>
                )}
              </tr>
            </thead>
            <tbody>
              {allAppointments?.appointments
                ?.slice(
                  (currentPageAll - 1) * itemsPerPage,
                  currentPageAll * itemsPerPage
                )
                .map(appointment => (
                  <tr key={appointment?._id} className="table-body-row">
                    <td className="table-body-cell">
                      {appointment?.user?.name}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.user?.gender}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.user?.age}
                    </td>
                    <td className="table-body-cell">
                      {new Date(appointment?.dateTime).toLocaleDateString()}
                    </td>
                    <td className="table-body-cell">
                      {appointment?.startTime}
                    </td>
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
                      {appointment?.sessionstatus}
                    </td>
                    {therapist?.therapisttype === "psychiatrist" ? (
                      <td className="table-body-cell">
                        <button
                          className="button fill-prescription-button"
                          onClick={() =>
                            handleFillPrescriptionClick(appointment?._id)
                          }
                        >
                          Fill Prescription
                        </button>
                      </td>
                    ) : (
                      <td className="table-body-cell"></td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          {renderPaginationControls(
            currentPageAll,
            handlePageChangeAll,
            allAppointmentCount
          )}
        </div>
      )}
    </div>
  );
}

export default TherapistAppointment;
