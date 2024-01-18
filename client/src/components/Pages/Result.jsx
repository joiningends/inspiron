import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Link as MUILink } from "@mui/material";
import jsPDF from "jspdf";
import "./Result.css";
import logo from "./Artboard 2.png";
import resultImg from "./resultImg.png";
import Footer from "./Footer";

const getTherapists = async assessmentScore => {
  let storedAssessment;
  try {
    storedAssessment = JSON.parse(localStorage.getItem("assessment"));
  } catch (error) {
    console.error("Error parsing stored assessment:", error);
    storedAssessment = null;
  }
  const groupId = localStorage.getItem("groupid");
  const cleanGroupId = groupId.replace(/"/g, "");
  const assessmentId = storedAssessment?._id;
  let url = `${process.env.REACT_APP_SERVER_URL}/therapists/score/${assessmentId}/${assessmentScore}`;
  if (cleanGroupId !== "null") {
    url = `${process.env.REACT_APP_SERVER_URL}/therapists/score/${assessmentId}/${cleanGroupId}/${assessmentScore}`;
  }
  try {
    const response = await axios.get(url);
    localStorage.setItem("therapistsData", JSON.stringify(response.data));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const buttonStyle = {
  background: "white",
  color: "#D67449",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};

const paperStyle = {
  padding: "20px",
  borderRadius: "25px",
  textAlign: "center",
  minHeight: "15rem",
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
};

const headerStyle = {
  marginBottom: "20px",
};

function Result() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const isLoggedIn = storedUser !== null && storedToken !== null;
  const assessmentScore = localStorage.getItem("totalPoints");
  const storedAssessment = JSON.parse(localStorage.getItem("assessment"));
  console.log(storedAssessment);
  const [data, setData] = useState(null);
  const assessmentId = storedAssessment?._id;

  let userResult = null;

  if (assessmentScore >= data?.low?.min && assessmentScore <= data?.low?.max) {
    userResult = data?.low?.result;
  } else if (
    assessmentScore >= data?.medium?.min &&
    assessmentScore <= data?.medium.max
  ) {
    userResult = data?.medium.result;
  } else if (
    assessmentScore >= data?.high.min &&
    assessmentScore <= data?.high.max
  ) {
    userResult = data?.high.result;
  } else {
    // Handle the case where the assessment score does not fall into any of the defined ranges
    userResult = "Result not available for this score range";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/assessments/${assessmentId}`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [assessmentId._id]);

  const handleGetTherapists = async assessmentScore => {
    try {
      const therapists = await getTherapists(assessmentScore);
      localStorage.setItem("therapists", JSON.stringify(therapists));
      console.log(therapists);
    } catch (error) {
      console.error(error.message);
    }
  };

  const bulletPoints = [];

  if (data?.low) {
    const lowDescription = `${data?.low?.description}`;
    bulletPoints.push(lowDescription);
  }

  const generatePDF = assessmentScore => {
    const doc = new jsPDF(); // Ensure proper jsPDF object reference

    const imgWidth = 150;
    const imgHeight = 80;
    const xCoordinate = 30;
    const yCoordinate = 1;

    doc.addImage(logo, "PNG", xCoordinate, yCoordinate, imgWidth, imgHeight);

    const textXCoordinate = 10;
    const textYCoordinate = yCoordinate + imgHeight + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(textXCoordinate, textYCoordinate, "Assessment Score:", {
      decoration: "underline",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(textXCoordinate + 65, textYCoordinate, `${assessmentScore}`);

    const resultYCoordinate = textYCoordinate + 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(textXCoordinate, resultYCoordinate, "Your Result:", {
      decoration: "underline",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);

    // Split userResult into lines and display each line separately
    const userResultLines = doc.splitTextToSize(userResult, 170);
    for (let i = 0; i < userResultLines.length; i++) {
      doc.text(
        textXCoordinate,
        resultYCoordinate + 8 + i * 8,
        userResultLines[i]
      );
    }

    let interpretationYCoordinate =
      resultYCoordinate + userResultLines.length * 8 + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      textXCoordinate,
      interpretationYCoordinate,
      "Your Score Interpretation:",
      { decoration: "underline" }
    );

    let bulletYCoordinate = interpretationYCoordinate + 14;
    doc.setFontSize(12);
    const widthForText = 170;
    const heightForText = doc.getTextDimensions("Sample Text").h;

    const interpretationLines = doc.splitTextToSize(
      bulletPoints.join("\n"),
      widthForText
    );

    let remainingLines = interpretationLines;
    let currentPage = 1;
    let pageHeight = doc.internal.pageSize.height;

    for (let i = 0; i < remainingLines.length; i++) {
      if (bulletYCoordinate + heightForText > pageHeight) {
        doc.addPage();
        currentPage++;
        bulletYCoordinate = 20;
        pageHeight = doc.internal.pageSize.height;
      }
      const splitText = doc.splitTextToSize(remainingLines[i], widthForText);
      for (let j = 0; j < splitText.length; j++) {
        const lineYCoordinate = bulletYCoordinate + j * heightForText * 1.2;
        doc.text(textXCoordinate + 10, lineYCoordinate, splitText[j]);
      }
      bulletYCoordinate += heightForText * 1.2 * splitText.length;
    }

    const watermarkWidth = 80;
    const watermarkHeight = 60;
    const watermarkXCoordinate =
      doc.internal.pageSize.width - watermarkWidth - 10;
    const watermarkYCoordinate =
      doc.internal.pageSize.height - watermarkHeight - 10;
    doc.addImage(
      resultImg,
      "PNG",
      watermarkXCoordinate,
      watermarkYCoordinate,
      watermarkWidth,
      watermarkHeight
    );

    const pdfOutput = doc.output("blob");
    const blobURL = URL.createObjectURL(pdfOutput);

    const downloadLink = document.createElement("a");
    downloadLink.href = blobURL;
    downloadLink.download = "report.pdf";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    if (assessmentScore) {
      handleGetTherapists(assessmentScore);
    }
  }, []);

  return (
    <>
      <Container style={containerStyle}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              style={{
                ...paperStyle,
                backgroundColor: "#5179BD",
              }}
            >
              <Typography variant="h4" style={headerStyle}>
                To download the report
              </Typography>
              {isLoggedIn ? (
                <Button
                  variant="contained"
                  color="primary"
                  style={buttonStyle}
                  onClick={() => generatePDF(assessmentScore)}
                >
                  Download Report
                </Button>
              ) : (
                <MUILink component={Link} to="/signin">
                  <Button
                    variant="contained"
                    color="primary"
                    style={buttonStyle}
                  >
                    Sign Up / Sign In
                  </Button>
                </MUILink>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              style={{ ...paperStyle, background: "#D67449" }}
            >
              <Typography variant="h4" style={headerStyle}>
                Find your Therapist
              </Typography>
              <Typography variant="body1" style={headerStyle}>
                Start Your Diagnosis Today
              </Typography>
              {isLoggedIn ? (
                <MUILink component={Link} to="/FindTherapist">
                  <Button
                    variant="contained"
                    color="primary"
                    style={buttonStyle}
                  >
                    Get Started
                  </Button>
                </MUILink>
              ) : (
                <MUILink component={Link} to="/signin">
                  <Button
                    variant="contained"
                    color="primary"
                    style={buttonStyle}
                  >
                    Sign Up / Sign In
                  </Button>
                </MUILink>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer style={{ marginTop: "3rem" }} />
    </>
  );
}

export default Result;
