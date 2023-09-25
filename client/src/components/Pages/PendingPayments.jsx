import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const styles = {
  tableContainer: {
    maxWidth: "600px",
    margin: "0 auto",
  },
};

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

  const handleMakePaymentClick = appointmentData => {
    const url = `bookaslot/bookYourSession/${appointmentData.therapist._id}/${appointmentData._id}`;
    console.log(url);
    window.location.href = url;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/v1/appointments/users/${userId}/paymentpending`
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePaymentConfirm = () => {
    console.log(
      `Payment for ${selectedPayment.therapist.name} on ${selectedPayment.dateTime}`
    );
    setOpenPaymentDialog(false);
  };

  return (
    <div>
      <h1>Pending Payments</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div>
          <div style={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>
                    <button
                      onClick={() => handleSort("therapist.name")}
                      style={{ cursor: "pointer" }}
                    >
                      Therapist Name
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => handleSort("dateTime")}
                      style={{ cursor: "pointer" }}
                    >
                      Appointment Date
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => handleSort("startTime")}
                      style={{ cursor: "pointer" }}
                    >
                      Appointment Time
                    </button>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .sort((a, b) => {
                    const isAsc = order === "asc";
                    return isAsc
                      ? a[orderBy]?.localeCompare(b[orderBy])
                      : b[orderBy]?.localeCompare(a[orderBy]);
                  })
                  .map(payment => (
                    <tr key={payment._id}>
                      <td>{payment.therapist.name}</td>
                      <td>{formatDate(payment.dateTime)}</td>
                      <td>{payment.startTime} </td>
                      <td>
                        <button
                          onClick={() => handleMakePaymentClick(payment)}
                          style={{ cursor: "pointer" }}
                        >
                          Make Payment
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            <div>
              <span>Rows per page: </span>
              <select onChange={handleChangeRowsPerPage}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div>
              <span>
                Page {page + 1} of {Math.ceil(data.length / rowsPerPage)}
              </span>
              <button
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
                style={{ cursor: "pointer" }}
              >
                Previous
              </button>
              <button
                onClick={() => handleChangePage(null, page + 1)}
                disabled={page === Math.ceil(data.length / rowsPerPage) - 1}
                style={{ cursor: "pointer" }}
              >
                Next
              </button>
            </div>
          </div>
          {selectedPayment && (
            <div>
              <div>
                Confirm payment for {selectedPayment.therapist.name} on{" "}
                {selectedPayment.dateTime} at {selectedPayment.startTime}?
              </div>
              <div>
                <button onClick={() => setOpenPaymentDialog(false)}>
                  Cancel
                </button>
                <button onClick={handlePaymentConfirm}>Confirm</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PendingPayments;