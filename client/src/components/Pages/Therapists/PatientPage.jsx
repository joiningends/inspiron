import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import {
  fetchTherapist,
  updateTherapist,
  updateTherapistImage,
} from "../../redux/Action";
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Tooltip,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchInput from "react-search-input"; // Import SearchInput
import "./PatientPage.css"; // Import your CSS file for styling

function PatientPage() {
  const [therapistId, setTherapistId] = useState(null);
  const [patients, setPatients] = useState([]);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state

  useEffect(() => {
    dispatch(fetchTherapist(therapistId));
  }, []);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Function to handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Function to handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      const id = decodedToken.userId;
      setTherapistId(id);

      // Fetch patient data from the API
      fetch(`http://localhost:4000/api/v1/appointments/therapists/${id}/name`)
        .then(response => response.json())
        .then(data => {
          // Assuming the API response contains an array of patients
          setPatients(data);
          console.log(data)
        })
        .catch(error => {
          console.error("Error fetching patient data: ", error);
        });
    }
  }, []);

  // Function to open a new window with the latest appointment URL
  const handleOpenLatestAppointment = userId => {
    const latestAppointmentURL = `appointments/users/${userId}/therapists/${therapistId}/latest-appointment`;
    window.open(latestAppointmentURL, "_blank");
  };

  // Create a function to filter patients based on the search term
  const filterPatients = () => {
    return patients.filter(patient =>
      patient.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div>
      <h1>Patient List</h1>
      {/* Style the SearchInput to match the previous design */}
      <TextField
        className="search-input"
        variant="outlined"
        label="Search by name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: "89%" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name of Patient</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterPatients()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(patient => (
                <TableRow key={patient.userId}>
                  <TableCell>{patient.userName}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        handleOpenLatestAppointment(patient.userId)
                      }
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={filterPatients()?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default PatientPage;
