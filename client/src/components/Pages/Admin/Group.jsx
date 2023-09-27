import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Group.css";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function Groups() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allowCompanyPayment, setAllowCompanyPayment] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [copyNotificationVisible, setCopyNotificationVisible] = useState(false); // Added

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/clients");
      setData(response.data.clients);
      console.log(response.data.clients)
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

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleAddCorporateClick = () => {
    setShowForm(true);
  };

  const handleImageUpload = event => {
    setSelectedImage(event.target.files[0]);
  };

  const handleAllowCompanyPaymentChange = event => {
    setAllowCompanyPayment(event.target.value === "yes");
  };

  const handleFormSubmit = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", event.target.name.value);
    formData.append("image", selectedImage);
    formData.append("address", event.target.address.value);
    formData.append("companypayment", allowCompanyPayment);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/clients",
        formData
      );
      console.log("Form submitted successfully", response);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const copyToClipboard = text => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    // Show the "Text copied" notification
    setCopyNotificationVisible(true);

    // Hide the notification after 2 seconds (adjust as needed)
    setTimeout(() => {
      setCopyNotificationVisible(false);
    }, 2000);
  };

  return (
    <div className="table-container">
      {showForm && (
        <div className="overlay">
          <div className="form-container">
            <form onSubmit={handleFormSubmit}>
              <label>Name</label>
              <input type="text" name="name" required />

              <label>Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />

              <label>Address</label>
              <input type="text" name="address" required />

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

              <button type="submit">Submit</button>
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
          {currentData.map(group => (
            <tr key={group._id}>
              <td>{group.name}</td>
              <td>{group.address}</td>
              <td>{group.groupid}</td>
              <td>{group.credit}</td>
              <td>
                {group.name === "Retail" ? (
                  <span>N/A</span>
                ) : (
                  <>
                    <a
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  </>
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
    </div>
  );
}

export default Groups;
