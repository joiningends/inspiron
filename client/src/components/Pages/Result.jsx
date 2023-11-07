import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Link as MUILink } from "@mui/material";
import jsPDF from "jspdf";
import "./Result.css";
import logo from "./Artboard 2.png";
import resultImg from "./resultImg.png";

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
    const lowDescription = `• ${data?.low?.result}. ${data?.low?.description}`;
    bulletPoints.push(lowDescription);
  }

  if (data?.medium) {
    const mediumDescription = `• ${data?.medium?.result}. ${data?.medium?.description}`;
    bulletPoints.push(mediumDescription);
  }

  if (data?.high) {
    const highDescription = `• ${data?.high?.result}. ${data?.high?.description}`;
    bulletPoints.push(highDescription);
  }

  const generatePDF = assessmentScore => {
    const doc = new jsPDF();

    const imgWidth = 150; // Adjust the width of the logo
    const imgHeight = 80; // Adjust the height of the logo

    // Set the X and Y coordinates to position the logo
    const xCoordinate = 30; // Adjust the X coordinate (horizontal position)
    const yCoordinate = -25; // Adjust the Y coordinate (vertical position)

    doc.addImage(logo, "PNG", xCoordinate, yCoordinate, imgWidth, imgHeight);

    // Adjust the X and Y coordinates for the assessment score
    const textXCoordinate = 10; // Horizontal position for the text
    const textYCoordinate = yCoordinate + imgHeight + 5; // Vertical position for the text

    // Set the font style for both the heading and the assessment score text
    doc.setFont("helvetica", "bold"); // Change the font style to "bold"

    // Add the "Assessment Score" heading text with underline
    doc.setFontSize(16);
    doc.text(textXCoordinate, textYCoordinate, "Assessment Score:", {
      decoration: "underline",
    });

    // Add the assessment score text with proper font
    doc.setFont("helvetica", "normal"); // Change the font style to "normal" for the assessment score
    doc.setFontSize(16);
    doc.text(textXCoordinate + 65, textYCoordinate, `${assessmentScore}`); // Adjust the position for the score

    // Adjust the Y coordinate for the "Your Result" text
    const resultYCoordinate = textYCoordinate + 15; // Adjust the vertical position

    // Set the font style for the "Your Result" text
    doc.setFont("helvetica", "bold"); // Change the font style to "bold"

    // Add the "Your Result" text with underline
    doc.setFontSize(16);
    doc.text(textXCoordinate, resultYCoordinate, "Your Result:", {
      decoration: "underline",
    });

    // Set the font style for the result text
    doc.setFont("helvetica", "normal"); // Change the font style to "normal"
    doc.setFontSize(14);
    doc.text(
      textXCoordinate,
      resultYCoordinate + 8,
      userResult
    );

    // Add the "Your Score Interpretation" heading with underline
    const interpretationYCoordinate = resultYCoordinate + 20; // Adjust the vertical position
    doc.setFont("helvetica", "bold"); // Change the font style to "bold"
    doc.setFontSize(16);
    doc.text(
      textXCoordinate,
      interpretationYCoordinate,
      "Your Score Interpretation:",
      { decoration: "underline" }
    );

    // Add the bullet points with proper font
    const bulletYCoordinate = interpretationYCoordinate + 14; // Adjust the vertical position for bullet points
    doc.setFontSize(12);

    // Use splitTextToSize to wrap text to the next line and add bullet points
    // const bulletPoints = [
    //   "• A score of 0 to 16 indicates no likelihood of having ADHD. This means that you do not have ADHD, no chances of having it. In case you are still experiencing symptoms, it is recommended for you to visit a licensed professional who can diagnose you and help you with the treatment.",
    //   "• A score of 17 to 23 indicates a likelihood of having ADHD. This means that you might have ADHD but to be sure, it is advised to get a proper diagnostic test. With the test that you just did, you got screened for chances of having ADHD. A mental health professional can guide you best into the next steps for the same.",
    //   "• A score of 24 and above increases the likelihood of having ADHD to a high level. It feels confusing at the moment but you must take this screening report to a psychiatrist or a clinical psychologist who can help you best in this time of need. You need not worry about that since Felicity has got you covered.",
    // ];

    const splitBulletPoints = doc.splitTextToSize(bulletPoints, 170); // Adjust the width as needed

    for (let i = 0; i < splitBulletPoints.length; i++) {
      const bulletText = splitBulletPoints[i];
      doc.text(textXCoordinate + 10, bulletYCoordinate + i * 12, bulletText);
    }

    // Add the watermark image at the bottom right corner
    const watermarkWidth = 80; // Adjust the width of the watermark
    const watermarkHeight = 60; // Adjust the height of the watermark
    const watermarkXCoordinate =
      doc.internal.pageSize.width - watermarkWidth - 10; // Adjust the X coordinate
    const watermarkYCoordinate =
      doc.internal.pageSize.height - watermarkHeight - 10; // Adjust the Y coordinate
    doc.addImage(
      resultImg,
      "PNG",
      watermarkXCoordinate,
      watermarkYCoordinate,
      watermarkWidth,
      watermarkHeight
    );

    doc.save("report.pdf");

    console.log()
  };

  useEffect(() => {
    if (assessmentScore) {
      handleGetTherapists(assessmentScore);
    }
  }, []);

  return (
    <Container style={containerStyle}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            style={{
              ...paperStyle,
              background: "linear-gradient(90deg, #D67449 0.88%, #5179BD 100%)",
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
                <Button variant="contained" color="primary" style={buttonStyle}>
                  Sign Up / Sign In
                </Button>
              </MUILink>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ ...paperStyle, background: "#D67449" }}>
            <Typography variant="h4" style={headerStyle}>
              Find your Therapist
            </Typography>
            <Typography variant="body1" style={headerStyle}>
              Start Your Diagnosis Today
            </Typography>
            {isLoggedIn ? (
              <MUILink component={Link} to="/FindTherapist">
                <Button variant="contained" color="primary" style={buttonStyle}>
                  Get Started
                </Button>
              </MUILink>
            ) : (
              <MUILink component={Link} to="/signin">
                <Button variant="contained" color="primary" style={buttonStyle}>
                  Sign Up / Sign In
                </Button>
              </MUILink>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Result;
