import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from "@material-ui/core";
import { PacmanLoader } from "react-spinners";
import Footer from "../Footer";

const buttonStyle = {
  marginRight: "10px",
  padding: "8px 16px",
  background: "#2196F3",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const containerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
};

const cardStyle = {
  marginBottom: "20px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f9f9f9",
};

function OpenFirstSessionNotes() {
  const [userData, setUserData] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/users/${userId}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [userId]);

  const handleButtonClick = field => {
    setSelectedField(field);
  };

  return (
    <>
      <div style={containerStyle}>
        <div>
          <button onClick={() => handleButtonClick("socioeconomic")} style={buttonStyle}>
            Socioeconomic
          </button>
          <button onClick={() => handleButtonClick("chief")} style={buttonStyle}>
            Chief
          </button>
          <button onClick={() => handleButtonClick("illness")} style={buttonStyle}>
            Illness
          </button>
        </div>
        {loading ? (
          <PacmanLoader color="#2196F3" loading={loading} size={50} />
        ) : null}
        {selectedField === "socioeconomic" && userData && userData.socioeconomic ? (
          <div>
            <h2 style={{ marginTop: "20px", marginBottom: "10px" }}>
              Socioeconomic Data
            </h2>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Field</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(userData.socioeconomic.json).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        ) : null}
        {selectedField === "chief" && userData && userData.chief && userData.chief[0].result ? (
          <div>
            <h2 style={{ marginTop: "20px", marginBottom: "10px", fontSize: "1.5rem" }}>
              Chief Data
            </h2>
            {userData.chief[0].result.map((result, index) => (
              <div key={index} style={{ ...cardStyle, fontSize: "1rem", padding: "15px" }}>
                {result.question === "Onset" ? (
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                    Onset: {result.selectedOptions.join(", ")}
                  </h3>
                ) : (
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                    {result.question}
                  </h3>
                )}
                {result.question !== "Onset" &&
                  result.optionComments &&
                  Object.keys(result.optionComments).length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {Object.entries(result.optionComments).map(([option, comment], commentIndex) => (
                        <li key={commentIndex} style={{ marginBottom: "10px", maxHeight: "100px", overflowY: "auto", fontSize: "0.9rem" }}>
                          <strong style={{ fontSize: "0.9rem" }}>{option}:</strong> {comment}
                        </li>
                      ))}
                    </ul>
                  ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {selectedField === "illness" && userData && userData.illness ? (
          <div>
            <h2 style={{ marginTop: "20px", marginBottom: "10px", fontSize: "1.5rem" }}>
              Illness Data
            </h2>
            {userData.illness.map((item, index) => (
              <div key={index} style={{ ...cardStyle, fontSize: "1rem", padding: "15px" }}>
                {item.result.map((result, resultIndex) => (
                  <div key={resultIndex} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>{result.question}</h3>
                    {result.options ? (
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {result.options.map((option, optionIndex) => (
                          <li key={optionIndex} style={{ marginBottom: "10px", maxHeight: "100px", overflowY: "auto", fontSize: "0.9rem" }}>
                            <strong style={{ fontSize: "0.9rem" }}>{option.option}:</strong> {option.comment}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  );
}

export default OpenFirstSessionNotes;
