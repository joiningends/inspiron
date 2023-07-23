import React, { useState } from "react";

function PatientPage() {
  // Sample data for the table
  const patients = [
    {
      id: 1,
      name: "John Doe",
      lastSessionDate: "2023-07-10",
      nextSessionDate: "2023-07-20",
      totalSessions: 5,
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastSessionDate: "2023-07-08",
      nextSessionDate: "2023-07-15",
      totalSessions: 3,
      summary:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    // Add more patient objects as needed
  ];

  const patientsPerPage = 2; // Number of patients to display per page
  const totalPages = Math.ceil(patients.length / patientsPerPage); // Calculate total pages

  const [currentPage, setCurrentPage] = useState(1); // Current page state

  // Function to handle page navigation
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  // Calculate start and end index of patients to display based on the current page
  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;

  // Get the patients to display on the current page
  const displayedPatients = patients.slice(startIndex, endIndex);

  return (
    <div>
      <h1>Patient Page</h1>
      <table style={{ textAlign: "center" }}>
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
          {displayedPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.lastSessionDate}</td>
              <td>{patient.nextSessionDate}</td>
              <td>{patient.totalSessions}</td>
              <td>
                <div>
                  <button style={{ border: "1px solid" }}>View/Download</button>
                  <button style={{ border: "1px solid", marginLeft: "1rem" }}>
                    Details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
      >
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          pageNumber => (
            <button
              key={pageNumber}
              style={{
                margin: "0.25rem",
                padding: "0.5rem 1rem",
                border: "1px solid",
                backgroundColor:
                  pageNumber === currentPage ? "blue" : "transparent",
                color: pageNumber === currentPage ? "white" : "black",
              }}
              onClick={() => handlePageChange(pageNumber)}
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
