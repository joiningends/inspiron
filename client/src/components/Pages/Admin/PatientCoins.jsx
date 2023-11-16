import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  TablePagination,
} from "@mui/material";
import Footer from "../Footer";

function PatientCoins() {
  const { patientId } = useParams();
  const [coinData, setCoinData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Define the API URL with the patientId parameter
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/coins/${patientId}`;

    // Fetch data from the API
    axios
      .get(apiUrl)
      .then(response => {
        setCoinData(response.data);
        console.log(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [patientId]);

  const handleEditClick = (id, coinBalance) => {
    setEditingId(id);
    setEditedValue(coinBalance);
  };

  const handleSaveClick = id => {
    // Find the edited item
    const editedItem = coinData.find(data => data._id === id);

    // Prepare the data to be sent in the PUT request
    const updatedData = {
      coinBalance: editedValue,
    };

    // Send the PUT request to update the coinBalance
    axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/coins/${editedItem._id}`,
        updatedData
      )
      .then(response => {
        // Update the state with the updated data
        const updatedCoinData = coinData.map(data =>
          data._id === id ? { ...data, coinBalance: editedValue } : data
        );
        setCoinData(updatedCoinData);
        setEditingId(null);
      })
      .catch(error => {
        console.error("Error updating data:", error);
        setEditingId(null);
      });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom>
          PatientCoins
        </Typography>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Experience Level</TableCell>
                    <TableCell>Coin Balance</TableCell>
                    <TableCell>Average Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coinData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(data => (
                      <TableRow key={data._id}>
                        <TableCell>{data.expriencelevel[0]}</TableCell>
                        <TableCell>
                          {editingId === data._id ? (
                            <>
                              <TextField
                                value={editedValue}
                                onChange={e => setEditedValue(e.target.value)}
                              />
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleSaveClick(data._id)}
                                style={{
                                  backgroundColor: "#D67449",
                                  color: "white",
                                  border: "none",
                                  marginRight: "1rem",
                                  marginLeft: "1rem",
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelClick}
                                style={{
                                  backgroundColor: "white",
                                  color: "#D67449",
                                  border: "1px solid #D67449",
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              {data.coinBalance}
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                  handleEditClick(data._id, data.coinBalance)
                                }
                                style={{
                                  marginLeft: "1rem",
                                  backgroundColor: "#D67449",
                                  color: "white",
                                  border: "none",
                                }}
                              >
                                Edit
                              </Button>
                            </>
                          )}
                        </TableCell>
                        <TableCell>{data.avarage}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={coinData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default PatientCoins;
