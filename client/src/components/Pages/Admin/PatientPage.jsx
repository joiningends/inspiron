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
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; // Placeholder icon

function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function PatientPage() {
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
        const response = await axios.get("http://localhost:4000/api/v1/users");
        console.log(response.data);
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
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patient Page
      </Typography>
      <TextField
        className="search-input"
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
      <TableContainer
        component={Paper}
        className="table-container"
        sx={{ overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Last Session Date</TableCell>
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
                  <TableCell className="patient-name-cell">
                    {patient.name}
                  </TableCell>
                  <TableCell>{formatDate(patient.date)}</TableCell>
                  <TableCell>{patient.Sessionnumber}</TableCell>
                  <TableCell>{patient.clientName}</TableCell>
                  <TableCell>
                    <Tooltip title="Details" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          handleDetailsClick(patient._id, patient.user)
                        }
                      >
                        <VisibilityIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="View/Download" arrow>
                      <Button
                        variant="outlined"
                        size="small"
                        className="view-download-button"
                        style={{ marginLeft: "1rem" }}
                      >
                        <DescriptionIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Payment" arrow>
                      <Button
                        variant="outlined"
                        style={{ marginLeft: "1rem" }}
                        size="small"
                        onClick={() => handlePaymentClick(patient._id)}
                      >
                        <PaymentIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Coins" arrow>
                      <Button
                        variant="outlined"
                        style={{ marginLeft: "1rem" }}
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
        className="pagination"
      />
    </Container>
  );
}

export default PatientPage;
