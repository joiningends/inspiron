import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Group.css";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import Snackbar from "@mui/material/Snackbar";

function Groups() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allowCompanyPayment, setAllowCompanyPayment] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [copyNotificationVisible, setCopyNotificationVisible] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentCredit, setPaymentCredit] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/clients`
      );
      setData(response.data.clients);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const pageCount = Math.ceil(data?.length / 5);

  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const currentData = data?.slice(startIndex, endIndex);

  const handleAddCorporateClick = () => {
    setShowForm(true);
  };

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleFormSubmit = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", selectedImage); // Append the image file
    formData.append("address", address);
    formData.append("companypayment", allowCompanyPayment);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/clients`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Client created successfully:", response.data);
      toast.success("Group created successfully");
      setTimeout(() => {
        window.location.reload(); // Reload the page after a delay
      }, 1000); // Adjust the delay time as needed
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Unable to create a group");
    }
  };

  const handleImageUpload = event => {
    setSelectedImage(event.target.files[0]);
  };

  const handleAllowCompanyPaymentChange = event => {
    setAllowCompanyPayment(event.target.value === "yes");
  };

  const copyToClipboard = text => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setCopyNotificationVisible(true);

    setTimeout(() => {
      setCopyNotificationVisible(false);
    }, 2000);
  };

  const handlePaymentButtonClick = group => {
    setPaymentCredit("");
    setSelectedGroupId(group._id);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handleConfirmPayment = async () => {
    console.log(paymentCredit);
    if (!paymentCredit || isNaN(paymentCredit) || paymentCredit <= 0) {
      setErrorMessage("Please enter a valid positive number for payment.");
      return;
    }

    const valueToSubtract = parseFloat(paymentCredit); // Use parseFloat to parse floating-point numbers
    console.log(valueToSubtract);

    if (
      valueToSubtract > data.find(group => group._id === selectedGroupId).credit
    ) {
      setErrorMessage("Payment cannot be greater than the available credit.");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/clients/${selectedGroupId}/subtract-credits`,
        {
          valueToSubtract,
        }
      );
      setPaymentDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error subtracting credits:", error);
    }
  };

  const handleSnackbarClose = () => {
    setErrorMessage("");
  };

  return (
    <>
      <ToastContainer />
      <div className="table-container">
        {showForm && (
          <div className="overlay">
            <div className="form-container">
              <form onSubmit={handleFormSubmit}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <label>Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />

                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />

                <label>Allow Company Payment</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="allowCompanyPayment"
                      value="yes"
                      checked={allowCompanyPayment === true}
                      onChange={handleAllowCompanyPaymentChange}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="allowCompanyPayment"
                      value="no"
                      checked={allowCompanyPayment === false}
                      onChange={handleAllowCompanyPaymentChange}
                    />
                    No
                  </label>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: "#D67449", color: "white" }}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="add-corporate-button">
          <button className="add-button" onClick={handleAddCorporateClick}>
            ADD CORPORATE
          </button>
        </div>
        <table className="groups-table">
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Address</th>
              <th>Group Id</th>
              <th>Credit</th>
              <th>URL</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map(group => (
              <tr key={group._id}>
                <td>{group.name}</td>
                <td>{group.address}</td>
                <td>{group.groupid}</td>
                <td>
                  {group.credit}
                  <button onClick={() => handlePaymentButtonClick(group)}>
                    Payment
                  </button>
                </td>
                <td>
                  {group.name === "Retail" ? (
                    <span>N/A</span>
                  ) : (
                    <a
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  )}
                </td>
                <td>
                  {group.name === "Retail" ? (
                    <span>N/A</span>
                  ) : (
                    <Link
                      to={`/corporate-user/${group.groupid}`}
                      className="details-link"
                    >
                      Details
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Stack spacing={2} sx={{ marginTop: "20px" }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
        {copyNotificationVisible && (
          <div className="copy-notification">Text copied</div>
        )}
        <Dialog
          open={paymentDialogOpen}
          onClose={handleClosePaymentDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Credit for which payment received</DialogTitle>
          <DialogContent>
            <TextField
              label="Payment Credit"
              type="number"
              fullWidth
              value={paymentCredit}
              onChange={e => setPaymentCredit(e.target.value)}
              error={errorMessage !== ""}
              helperText={errorMessage}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePaymentDialog} color="primary">
              Close
            </Button>
            <Button onClick={handleConfirmPayment} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={errorMessage !== ""}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={errorMessage}
        />
      </div>
    </>
  );
}

export default Groups;
