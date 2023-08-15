import React from "react";
import "./SessionHistoryOfPatients.css";

const SessionHistoryOfPatients = () => {
  // Example data for the table (you can replace this with your actual data)
  const sessionData = [
    {
      id: 1,
      sessionDate: "2023-07-15",
      therapistName: "John Doe",
    },
    {
      id: 2,
      sessionDate: "2023-07-22",
      therapistName: "Jane Smith",
    },
    {
      id: 3,
      sessionDate: "2023-07-29",
      therapistName: "Michael Johnson",
    },
  ];

  return (
    <div>
      <h1>Session History of Patients</h1>
      {/* <button
        className="view-button"
        style={{
          backgroundColor: "#D67449",
          color: "white",
          marginLeft: "5rem",
        }}
      >
        View First Session Notes
      </button> */}
      <p className="totalAvailablePatients">
        Total Patient: {sessionData.length}
      </p>
      <h2>Session History</h2>
      <table className="session-table">
        <thead>
          <tr>
            <th>SNo</th>
            <th>Session Date</th>
            <th>Therapist Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessionData.map(session => (
            <tr key={session?.id}>
              <td>{session?.id}</td>
              <td>{session?.sessionDate}</td>
              <td>{session?.therapistName}</td>
              <td>
                <button
                  className="view-session-button"
                  style={{ backgroundColor: "#D67449", color: "white" }}
                >
                  View Session Note
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistoryOfPatients;
