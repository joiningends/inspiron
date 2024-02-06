import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Footer from "../Footer";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  container: {
  },
  searchInput: {
  },
  tableContainer: {
    overflowX: "auto",
  },
  actionsCell: {
    display: "flex",
    flexDirection: "row", // Updated style for horizontal arrangement
  },
}));

function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function PatientPage() {
  const classes = useStyles();
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDetailsClick = (patientId, personId) => {
    navigate(`/session-history-patients/${patientId}`);
  };

  const handleCoinsClick = patientId => {
    navigate(`/user-coin/${patientId}`);
  };

  const handlePaymentClick = patientId => {
    const paymentUrl = `/userPayment/${patientId}`;
    window.open(paymentUrl, "_blank");
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users`
        );
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients data:", error);
      }
    };

    fetchPatientData();
  }, []);

  const patientsPerPage = 10;
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filterPatients = () => {
    if (!Array.isArray(patients)) {
      return [];
    }

    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom style={{width:"100%"}}>
        Patient Page
      </Typography>
      <TextField
        className={classes.searchInput}
        variant="outlined"
        label="Search by name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
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
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Last Session Date</TableCell>
              <TableCell>Last mental expert</TableCell>
              <TableCell>Total Sessions</TableCell>
              <TableCell>Corporate Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterPatients()
              .slice(startIndex, endIndex)
              .map(patient => (
                <TableRow key={patient._id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.mobile}</TableCell>
                  <TableCell>{formatDate(patient.date)}</TableCell>
                  <TableCell>{patient.lasttherapistname}</TableCell>
                  <TableCell>{patient.Sessionnumber}</TableCell>
                  <TableCell>{patient.clientName}</TableCell>
                  <TableCell className={classes.actionsCell}>
                    <Tooltip title="Details" arrow>
                      {patient?.firstsession !== "pending" && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleDetailsClick(patient._id, patient.user)
                          }
                        >
                          <VisibilityIcon />
                        </Button>
                      )}
                    </Tooltip>
                    <Tooltip title="Payment" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handlePaymentClick(patient._id)}
                      >
                        <PaymentIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Coins" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCoinsClick(patient._id)}
                      >
                        <MonetizationOnIcon />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        size="large"
      />
      <Footer />
    </Container>
  );
}

export default PatientPage;
