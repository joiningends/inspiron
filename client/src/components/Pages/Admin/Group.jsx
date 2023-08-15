import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Group.css";
import { Link } from "react-router-dom";

function Groups() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleAddCorporateClick = () => {
    setShowForm(true);
  };

  const handleImageUpload = event => {
    setSelectedImage(event.target.files[0]);
  };

  const handleFormSubmit = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", event.target.name.value);
    formData.append("image", selectedImage);
    formData.append("address", event.target.address.value);
    formData.append("credit", event.target.credit.value);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/clients",
        formData
      );
      console.log("Form submitted successfully", response);
      setShowForm(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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

              <label>Credit</label>
              <input type="text" name="credit" required />

              <button type="submit">Submit</button>
            </form>
            <button className="close-button" onClick={() => setShowForm(false)}>
              Close
            </button>
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
            <th>Image</th>
            <th>Credit</th>
            <th>URL</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map(group => (
            <tr key={group._id}>
              <td>{group.name}</td>
              <td>{group.address}</td>
              <td>{group.groupid}</td>
              <td>
                {group.name === "Retail" ? (
                  <span>N/A</span>
                ) : (
                  <img
                    src={group.image}
                    alt={`Image of ${group.name}`}
                    className="group-image"
                  />
                )}
              </td>
              <td>{group.credit}</td>
              <td>
                {group.name === "Retail" ? (
                  <span>N/A</span>
                ) : (
                  <a href={group.url} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                )}
              </td>
              <td>
                {group.name === "Retail" ? (
                  <span>N/A</span>
                ) : (
                  <Link to={`/corporate-user/${group.groupid}`} className="details-link">
      Details
    </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Groups;
