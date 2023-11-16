import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  TextareaAutosize,
  Grid,
  styled,
  Slide, // Import Slide for animation
} from "@mui/material";
import { useSpring, animated } from "react-spring";
import {
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";
import groupHomePage from "./GroupHomeImage.png";
import Footer from "./Footer";

import jwtDecode from "jwt-decode";

import Rating from "./Rating";

import { TransitionProps } from "@mui/material/transitions";

const Container = styled("div")(({ theme }) => ({
  width: "600px",
  backgroundColor: "#68B545",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.6)",
  },
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  overflowY: "scroll",
  maxHeight: "80vh",
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SessionNotesPopup({ sessionNotes, onClose }) {
  const labelStyle = {
    fontWeight: "bold",
    marginRight: "8px",
  };

  const textAreaStyle = {
    width: "100%",
    minHeight: "80px",
    marginTop: "8px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const boxStyle = {
    marginBottom: "16px",
  };

  const scrollContainerRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowScrollIndicator(container.scrollHeight > container.clientHeight);
    }
  };

  return (
    <>
      <Dialog
        open={!!sessionNotes}
        onClose={onClose}
        maxWidth="md"
        TransitionComponent={Transition}
      >
        <DialogTitle>Session Notes</DialogTitle>
        <DialogContent>
          {sessionNotes ? (
            <Container ref={scrollContainerRef}>
              <Paper elevation={3} style={{ padding: "16px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <div style={boxStyle}>
                      <Typography style={labelStyle}>
                        Growth Curve Points:
                      </Typography>
                      <TextareaAutosize
                        minRows={3}
                        readOnly
                        value={sessionNotes.Growthcurvepoints}
                        style={textAreaStyle}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div style={boxStyle}>
                      <Typography style={labelStyle}>
                        Homework Given:
                      </Typography>
                      <TextareaAutosize
                        minRows={3}
                        readOnly
                        value={sessionNotes.Homeworkgiven}
                        style={textAreaStyle}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div style={boxStyle}>
                      <Typography style={labelStyle}>
                        Next Session Plan:
                      </Typography>
                      <TextareaAutosize
                        minRows={3}
                        readOnly
                        value={sessionNotes.Nextsessionplan}
                        style={textAreaStyle}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div style={boxStyle}>
                      <Typography style={labelStyle}>Summary:</Typography>
                      <TextareaAutosize
                        minRows={3}
                        readOnly
                        value={sessionNotes.Summary}
                        style={textAreaStyle}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={boxStyle}>
                      <Typography style={labelStyle}>
                        Therapeutic Techniques Used:
                      </Typography>
                      <TextareaAutosize
                        minRows={3}
                        readOnly
                        value={sessionNotes.TherapeuticTechniquesused}
                        style={textAreaStyle}
                      />
                    </div>
                  </Grid>
                </Grid>
              </Paper>
              {showScrollIndicator && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={1}
                >
                  <Typography variant="caption">Scroll for more</Typography>
                </Box>
              )}
            </Container>
          ) : (
            "Session notes not available."
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
            style={{ backgroundColor: "#D67449", color: "white" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Appointments() {
  const [showPastAppointments, setShowPastAppointments] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sessionNotes, setSessionNotes] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  console.log(tokenInfo);

  const [userInfo, setUserInfo] = useState();
  const [user, setUser] = useState(null);
  console.log(user);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/users/${userInfo}`)
      .then(response => {
        // Handle the successful response here, and set the user data to state
        setUser(response.data);
      })
      .catch(error => {
        // Handle any errors here
        console.error("Error fetching user data:", error);
      });
  }, [userInfo]);

  console.log(userInfo);

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the JWT token using jwt-decode
      const decoded = jwtDecode(token);

      // Store the decoded information in the component's state
      console.log(decoded);
      setTokenInfo(decoded);
      setUserInfo(decoded?.userId);
    }
  }, []);

  const handleStartAppointment = meetlink => {
    window.open(meetlink, "_blank");
  };

  const handleSeeSessionNote = appointmentId => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}`)
      .then(response => {
        setSessionNotes(response.data.sessionnotes);
      })
      .catch(error => {
        console.error("Error fetching session notes:", error);
      });
  };

  const handleShowPastAppointments = () => {
    setShowPastAppointments(true);
  };

  const handleShowUpcomingAppointments = () => {
    setShowPastAppointments(false);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId").slice(1, -1);
    if (!showPastAppointments) {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}/appointments/users/${userId}/upcoming-appointments`
        )
        .then(response => {
          setUpcomingAppointments(response.data.upcomingAppointments);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching upcoming appointments:", error);
          setLoading(false);
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/appointments/users/${userId}`)
        .then(response => {
          setPastAppointments(response.data.appointments);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching past appointments:", error);
          setLoading(false);
        });
    }
  }, [showPastAppointments]);

  const formatDateTime = dateTime => {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const fadeProps = useSpring({
    opacity: loading ? 0 : 1,
    from: { opacity: 0 },
  });

  const sortedAppointments = showPastAppointments
    ? pastAppointments
    : upcomingAppointments;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {user?.israting === true && (
        <Rating userId={user?._id} lastTherapist={user?.lasttherapist} />
      )}
      <div>
        <Button
          variant={showPastAppointments ? "outlined" : "contained"}
          onClick={handleShowUpcomingAppointments}
        >
          Upcoming Appointments
        </Button>
        <Button
          variant={showPastAppointments ? "contained" : "outlined"}
          onClick={handleShowPastAppointments}
          style={{ marginLeft: "1rem" }}
        >
          Past Appointments
        </Button>

        <Box mt={3}>
          {showPastAppointments ? (
            <animated.div style={fadeProps}>
              {pastAppointments.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  p={2}
                >
                  <InfoIcon fontSize="large" color="disabled" />
                  <p style={{ color: "grey" }}>
                    No past appointments available.
                  </p>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Therapist Name</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedAppointments
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map(appointment => (
                          <TableRow key={appointment._id}>
                            <TableCell>{appointment.therapistName}</TableCell>
                            <TableCell>{appointment.startTime}</TableCell>
                            <TableCell>
                              {formatDateTime(appointment.dateTime)}
                            </TableCell>
                            <TableCell>
                              {appointment.sessionnotes?.sharedWithPatient ===
                              true ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleSeeSessionNote(appointment._id)
                                  }
                                >
                                  Session History
                                </Button>
                              ) : (
                                <span>No Details are Available!</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sortedAppointments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              )}
            </animated.div>
          ) : (
            <animated.div style={fadeProps}>
              {upcomingAppointments.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  p={2}
                >
                  <InfoIcon fontSize="large" color="disabled" />
                  <p style={{ color: "grey" }}>
                    No upcoming appointments available.
                  </p>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Therapist Name</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedAppointments
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map(appointment => (
                          <TableRow key={appointment._id}>
                            <TableCell>{appointment.therapist.name}</TableCell>
                            <TableCell>{appointment.startTime}</TableCell>
                            <TableCell>
                              {formatDateTime(appointment.dateTime)}
                            </TableCell>
                            <TableCell>
                              {appointment.status === "started" ? (
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: "#D67449",
                                    color: "white",
                                  }}
                                  startIcon={<PlayArrowIcon />}
                                  onClick={() =>
                                    handleStartAppointment(appointment.meetlink)
                                  }
                                >
                                  Start
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  disabled
                                  startIcon={<PlayArrowIcon />}
                                >
                                  Start
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sortedAppointments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableContainer>
              )}
            </animated.div>
          )}
        </Box>

        {/* Session Notes Popup */}
        <SessionNotesPopup
          sessionNotes={sessionNotes}
          onClose={() => setSessionNotes(null)}
        />
      </div>
    </>
  );
}

export default Appointments;
