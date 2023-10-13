import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Paper,
  TableContainer,
  Typography,
  withStyles,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import PaymentIcon from "@material-ui/icons/Payment";
import moment from "moment";

const styles = theme => ({});

function PendingPayments(props) {
  const { classes } = props;
  const userId = JSON.parse(localStorage.getItem("userId"));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderBy, setOrderBy] = useState("therapist.name");
  const [order, setOrder] = useState("asc");

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/appointments/users/${userId}/paymentpending`
      );
      setData(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = dateString => {
    return moment(dateString).format("DD-MM-YYYY");
  };

  const handleSort = columnId => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    document.addEventListener("pageChange", handlePageChange);
    document.addEventListener("rowsPerPageChange", handleRowsPerPageChange);

    return () => {
      document.removeEventListener("pageChange", handlePageChange);
      document.removeEventListener(
        "rowsPerPageChange",
        handleRowsPerPageChange
      );
    };
  }, []);

  const handleMakePaymentClick = appointmentData => {
    const url = `bookaslot/bookYourSession/${appointmentData.therapist._id}/${appointmentData._id}`;
    window.location.href = url;
  };

  const handlePaymentConfirm = () => {
    setOpenPaymentDialog(false);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Pending Payments
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography>Error: {error.message}</Typography>}
      {!loading && !error && (
        <div>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "therapist.name"}
                      direction={orderBy === "therapist.name" ? order : "asc"}
                      onClick={() => handleSort("therapist.name")}
                    >
                      Therapist Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "dateTime"}
                      direction={orderBy === "dateTime" ? order : "asc"}
                      onClick={() => handleSort("dateTime")}
                    >
                      Appointment Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "startTime"}
                      direction={orderBy === "startTime" ? order : "asc"}
                      onClick={() => handleSort("startTime")}
                    >
                      Appointment Time
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .sort((a, b) => {
                    const isAsc = order === "asc";
                    return isAsc
                      ? a[orderBy]?.localeCompare(b[orderBy])
                      : b[orderBy]?.localeCompare(a[orderBy]);
                  })
                  .map(payment => (
                    <TableRow key={payment._id}>
                      <TableCell>{payment.therapist.name}</TableCell>
                      <TableCell>{formatDate(payment.dateTime)}</TableCell>
                      <TableCell>{payment.startTime} </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          aria-label="Make Payment"
                          onClick={() => handleMakePaymentClick(payment)}
                        >
                          <PaymentIcon />
                        </IconButton>
                        <span>Make Payment</span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
          />
          <Dialog
            open={openPaymentDialog}
            onClose={() => setOpenPaymentDialog(false)}
            aria-labelledby="payment-dialog-title"
          >
            <DialogTitle id="payment-dialog-title">Confirm Payment</DialogTitle>
            <DialogContent>
              {selectedPayment && (
                <Typography>
                  Confirm payment for {selectedPayment.therapist.name} on{" "}
                  {selectedPayment.dateTime} at {selectedPayment.startTime}?
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenPaymentDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handlePaymentConfirm} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default withStyles(styles)(PendingPayments);
