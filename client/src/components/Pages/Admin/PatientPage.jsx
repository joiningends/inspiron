// PatientPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PatientPage.css";

function PatientPage() {
  const [patients, setPatientData] = useState([]);
  const navigate = useNavigate();

  // Function to handle navigation to the details page
  const handleDetailsClick = patientId => {
    // Navigate to the details page with the patient's ID as a parameter
    navigate(`/session-history-patients/${patientId}`);
  };

  // Function to fetch the data from the API
  const fetchPatientData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/users");
      setPatientData(response.data);
    } catch (error) {
      console.error("Error fetching patients data:", error);
    }
  };
  // Call the fetchPatientData function when the component mounts
  useEffect(() => {
    fetchPatientData();
  }, []);

  const patientsPerPage = 10; // Number of patients to display per page
  const totalPages = Math.ceil(patients?.length / patientsPerPage); // Calculate total pages

  const [currentPage, setCurrentPage] = useState(1); // Current page state

  // Function to handle page navigation
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  // Calculate start and end index of patients to display based on the current page
  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;

  // Get the patients to display on the current page
  const displayedPatients = patients?.slice(startIndex, endIndex);

  return (
    <div className="patient-page">
      <h1>Patient Page</h1>
      <div className="patient-table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Patient name</th>
              <th>Last session date</th>
              <th>Next session date</th>
              <th>Total session</th>
              <th>Patient summary</th>
            </tr>
          </thead>
          <tbody>
            {displayedPatients?.map(patient => (
              <tr key={patient?.id}>
                <td>{patient?.name}</td>
                <td>{patient?.lastSessionDate}</td>
                <td>{patient?.nextSessionDate}</td>
                <td>{patient?.totalSessions}</td>
                <td>
                  <div className="patient-buttons">
                    <button
                      onClick={() => handleDetailsClick(patient?._id)}
                      className={currentPage === patient?._id ? "active" : ""}
                    >
                      Details
                    </button>
                    <button>View/Download</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="patient-buttons">
        {Array?.from({ length: totalPages }, (_, index) => index + 1).map(
          pageNumber => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={currentPage === pageNumber ? "active" : ""}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default PatientPage;
