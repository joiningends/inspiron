import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";

const SessionHistoryOfPatients = () => {
  // Example data for the table (you can replace this with your actual data)
  const { id, userId } = useParams();
  const [patientDetails, setPatientDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionHistoryData, setSessionHistoryData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sessionHistoryDialogOpen, setSessionHistoryDialogOpen] =
    useState(false);

  console.log(patientDetails);

  const formatDate = dateString => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSessionHistoryClick = appointmentId => {
    const sessionHistoryUrl = `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}`;

    fetch(sessionHistoryUrl)
      .then(response => response.json())
      .then(sessionHistoryData => {
        setSessionHistoryData(sessionHistoryData.sessionnotes);
        console.log(sessionHistoryData.sessionnotes);
        setSessionHistoryDialogOpen(true);
      })
      .catch(error => {
        console.error("Error fetching session history:", error);
      });
  };

  const handleCloseSessionHistoryDialog = () => {
    setSessionHistoryDialogOpen(false);
  };

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/appointments/users/${id}`;

    // Fetch patient details data based on userId and therapistId
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Add the lastTherapistAppointment to the beginning of the appointments array
        const updatedAppointments = [...data.appointments];
        console.log(data);

        // Update patient details with the modified appointments array
        setPatientDetails({ ...data, appointments: updatedAppointments });
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Grid container style={{ padding: "20px" }}>
      <Grid
        item
        xs={12}
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Typography variant="h4">{patientDetails?.user} Details</Typography> */}
      </Grid>
      <Grid item xs={12} style={{ marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Construct the URL you want to open in a new window or tab.
            const url = `/openFirstSessionNotes/${id}`;
            // Open the URL in a new window or tab.
            window.open(url, "_blank");
          }}
        >
          First Session Notes
        </Button>
      </Grid>
      <Grid item xs={12} style={{ marginBottom: "20px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SNo</TableCell>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientDetails?.appointments?.map((appointment, index) => (
                <TableRow key={appointment._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate(appointment?.dateTime)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleSessionHistoryClick(appointment._id)}
                    >
                      Session History
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component={Box}
          rowsPerPageOptions={[5, 10, 25]}
          count={patientDetails?.appointments?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>

      <Dialog
        open={sessionHistoryDialogOpen}
        onClose={handleCloseSessionHistoryDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Session History Data</DialogTitle>
        <DialogContent>
          {sessionHistoryData && (
            <form>
              <div>
                <label htmlFor="Growthcurvepoints">Growth Curve Points:</label>
                <input
                  type="text"
                  id="Growthcurvepoints"
                  name="Growthcurvepoints"
                  value={sessionHistoryData.Growthcurvepoints}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="Homeworkgiven">Homework Given:</label>
                <input
                  type="text"
                  id="Homeworkgiven"
                  name="Homeworkgiven"
                  value={sessionHistoryData.Homeworkgiven}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="Nextsessionplan">Next Session Plan:</label>
                <input
                  type="text"
                  id="Nextsessionplan"
                  name="Nextsessionplan"
                  value={sessionHistoryData.Nextsessionplan}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="Summary">Summary:</label>
                <input
                  type="text"
                  id="Summary"
                  name="Summary"
                  value={sessionHistoryData.Summary}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="TherapeuticTechniquesused">
                  Therapeutic Techniques Used:
                </label>
                <input
                  type="text"
                  id="TherapeuticTechniquesused"
                  name="TherapeuticTechniquesused"
                  value={sessionHistoryData.TherapeuticTechniquesused}
                  style={{ userSelect: "none" }}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="sharedWithPatient">Shared with Patient:</label>
                <input
                  type="text"
                  id="sharedWithPatient"
                  name="sharedWithPatient"
                  value={sessionHistoryData.sharedWithPatient ? "Yes" : "No"}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="sharedWithPsychiatrist">
                  Shared with Psychiatrist:
                </label>
                <input
                  type="text"
                  id="sharedWithPsychiatrist"
                  name="sharedWithPsychiatrist"
                  value={
                    sessionHistoryData.sharedWithPsychiatrist ? "Yes" : "No"
                  }
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="generateReport">Generate Report:</label>
                <input
                  type="text"
                  id="generateReport"
                  name="generateReport"
                  value={sessionHistoryData.generateReport ? "Yes" : "No"}
                  readOnly
                />
              </div>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSessionHistoryDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default SessionHistoryOfPatients;
