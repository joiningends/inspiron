import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

function formatAppointmentDate(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
}

function PaymentSuccessPageCorp() {
  const { appointmentId } = useParams();
  const [appointmentData, setAppointmentData] = useState(null);
  const [confettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    // Make an API request to fetch appointment data based on appointmentId
    fetch(`http://localhost:4000/api/v1/appointments/${appointmentId}`)
      .then(response => response.json())
      .then(data => {
        setAppointmentData(data);
      })
      .catch(error => {
        console.error("Error fetching appointment data:", error);
      });

    // Set a timer to stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(confettiTimer);
  }, [appointmentId]);

  // Use react-spring for fade-in animation
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  return (
    <animated.div
      style={{
        ...fadeIn,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <Container
        component="main"
        style={{
          maxWidth: "100%", // Make it responsive
          padding: "1rem",
          textAlign: "center",
          margin: "auto",
          background: "#f5f5f5",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#4CAF50",
            }}
            gutterBottom
          >
            Congratulations!
          </Typography>
          <Typography
            variant="subtitle1"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 500,
              marginBottom: "1rem",
            }}
            paragraph
          >
            Your appointment has been successfully booked.
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 500,
              marginBottom: "1rem",
            }}
            paragraph
          >
            Appointment Date & Time:{" "}
            {formatAppointmentDate(appointmentData?.dateTime)}
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 500,
              marginBottom: "1rem",
            }}
            paragraph
          >
            Appointment Time: {appointmentData?.startTime}
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 500,
              marginBottom: "1rem",
            }}
            paragraph
          >
            Session Mode: {appointmentData?.sessionMode}
          </Typography>
          {confettiActive && (
            <Confetti
              style={{
                marginTop: "1rem",
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/`}
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              marginTop: "1rem",
              background: "#4CAF50",
              color: "white",
              transition: "background 0.3s ease-in-out",
              "&:hover": {
                background: "#388E3C",
              },
            }}
          >
            Go Back To Home Page
          </Button>
        </CardContent>
      </Container>
    </animated.div>
  );
}

export default PaymentSuccessPageCorp;
