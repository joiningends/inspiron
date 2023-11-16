import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import {
  CreditCard as CreditCardIcon,
  DoneOutline as DoneOutlineIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";
import "./CustomerPayment.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Footer from "../Footer";

function formatDate(dateTimeString) {
  try {
    const date = new Date(dateTimeString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error parsing date:", error);
    return dateTimeString;
  }
}

function CustomerPayment() {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const [selectedExtension, setSelectedExtension] = useState(null);
  const { userId } = useParams();

  const fetchPaymentData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/appointments/users/${userId}/payment`
      );

      const formattedPayments = response.data.map(payment => ({
        ...payment,
        date: formatDate(payment.dateTime),
      }));

      console.log(formattedPayments);
      setPayments(formattedPayments);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const offset = currentPage * perPage;
  const paginatedPayments = payments.slice(offset, offset + perPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleMakePayment = async appointmentId => {
    try {
      // Step 1: Fetch payment details
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}/payment`
      );

      const { message, extensionprice } = response.data;

      console.log(message, extensionprice);
      // Step 2: Display a confirmation dialog for "message"
      confirmAlert({
        title: "Confirm Payment",
        message: `Do you want to confirm payment of amount ${message}?`,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              // Step 3: If the user chooses 'Yes' for "message," make the first payment confirmation request
              try {
                const paymentResponse = await axios.put(
                  `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}/paymentrecived`,
                  { paymentrecived: true }
                );

                console.log("Payment confirmed:", paymentResponse.data);

                // Step 4: Check if there is an "extensionprice"
                if (extensionprice !== undefined) {
                  // Step 5: Display a confirmation dialog for "extensionprice"
                  confirmAlert({
                    title: "Confirm Extension Price",
                    message: `Do you want to confirm extension price of ${extensionprice}?`,
                    buttons: [
                      {
                        label: "Yes",
                        onClick: async () => {
                          // Step 6: If the user chooses 'Yes' for "extensionprice," make the second payment confirmation request
                          try {
                            const extensionResponse = await axios.get(
                              `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}/updatepaymentstatus`
                            );

                            console.log(
                              "Extension payment confirmed:",
                              extensionResponse.data
                            );

                            // Step 7: Reload the page after completing the payment process
                            window.location.reload();
                          } catch (error) {
                            console.error(
                              "Error confirming extension payment:",
                              error
                            );
                          }
                        },
                      },
                      {
                        label: "No",
                        onClick: () => {
                          // Handle the "No" response for "extensionprice" as needed
                        },
                      },
                    ],
                  });
                } else {
                  // Step 7: Reload the page after completing the payment process
                  window.location.reload();
                }
              } catch (error) {
                console.error("Error confirming payment:", error);
              }
            },
          },
          {
            label: "No",
            onClick: () => {
              // Handle the "No" response for "message" as needed
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching payment details:", error);
    }
  };

  const handleConfirmPayment = async appointmentId => {
    confirmAlert({
      title: "Confirm Payment",
      message: "Do you want to confirm the payment?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}/success`
              );

              console.log("Payment confirmed:", response.data);
            } catch (error) {
              console.error("Error confirming payment:", error);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
    window.location.reload();
  };

  const handleAcceptExtensionAmount = async (appointmentId, extensionprice) => {
    try {
      console.log(extensionprice);

      confirmAlert({
        title: "Accept Extension Amount",
        message: `Extension Amount: ${extensionprice}`,
        buttons: [
          {
            label: "Accept",
            onClick: async () => {
              try {
                const extensionResponse = await axios.get(
                  `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}/updatepaymentstatus`
                );

                console.log(
                  "Extension payment confirmed:",
                  extensionResponse.data
                );

                window.location.reload();
              } catch (error) {
                console.error("Error confirming extension payment:", error);
              }
            },
          },
          {
            label: "Cancel",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching extension price:", error);
    }
  };

  return (
    <>
    <div>
      <h1 className="table-header">Customer Payments</h1>
      <TableContainer component={Paper} className="payment-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>
                <CreditCardIcon />
                Payment Method
              </TableCell>
              <TableCell>
                <DoneOutlineIcon />
                Payment Status
              </TableCell>
              <TableCell>
                <AccessTimeIcon />
                Start Time
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPayments.map((payment, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <span className="completed-status">
                    {payment.paymentstatus}
                  </span>
                </TableCell>
                <TableCell>{payment.startTime}</TableCell>
                <TableCell>
                  {payment.paymentstatus === "Failed" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleConfirmPayment(payment._id)}
                      style={{ backgroundColor: "#D67449", color: "white" }}
                    >
                      Confirm Payment
                    </Button>
                  )}
                  {payment.paymentstatus === "Success" &&
                    (payment.paymentMethod === "Online" ||
                      payment.paymentMethod === "Offline") &&
                    payment.extensionprice > 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleAcceptExtensionAmount(
                            payment._id,
                            payment.extensionprice
                          )
                        }
                        style={{ backgroundColor: "#D67449", color: "white" }}
                      >
                        Accept Extension Amount
                      </Button>
                    )}
                  {payment.paymentstatus !== "Success" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleMakePayment(payment._id)}
                      style={{ backgroundColor: "#D67449", color: "white" }}
                    >
                      Make Payment
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination-container">
        <Stack direction="row" spacing={2} justifyContent="center">
          <Pagination
            count={Math.ceil(payments.length / perPage)}
            page={currentPage + 1}
            onChange={(event, page) => handlePageChange({ selected: page - 1 })}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      </div>
    </div>
  <Footer/>
    </>
  );
}

export default CustomerPayment;
