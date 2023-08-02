import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { fetchTherapists } from "../../redux/Action";
import { useSelector, useDispatch } from "react-redux";
import createTherapistimg from "./intermediary.png";
import rightSideArrow from "./right-arrow.png";

function Dashboard() {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the form
  const [address, setAddress] = useState("");
  const [mobile, setPhoneNumebr] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [therapistsData, setTherapistsDetails] = useState({
    totalTherapists: 0,
    therapists: [],
  });

  console.log(therapistsData);

  useEffect(() => {
    // Function to fetch therapist details using Axios
    const fetchTherapistsDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/therapists/total-therapists"
        );
        // Assuming the response data is an object with 'totalTherapists' and 'therapists' properties
        console.log(response.data);
        setTherapistsDetails(response.data);
      } catch (error) {
        console.error("Error fetching therapist details:", error);
      }
    };

    // Call the function to fetch therapist details
    fetchTherapistsDetails();
  }, []);

  const [availableAddress, setAvailableAddress] = React.useState(null);

  React.useEffect(() => {
    axios.get("http://localhost:4000/api/v1/categories").then(response => {
      setAvailableAddress(response.data);
    });
  }, []);

  console.log(availableAddress);

  const handleDetails = therapistId => {
    // Open a new window with the therapist details
    const url = `/therapists-Details/${therapistId}`;
    window.open(url, "_blank");
  };

  const handleCreateTherapist = () => {
    // Show the form when the "Create new therapist" button is clicked
    setShowForm(true);
  };

  const handleFormCancel = () => {
    // Hide the form when the cancel button is clicked
    setShowForm(false);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log({
      mobile,
      name,
      email,
      availability: [
        {
          location: address,
          day: [], // Add the desired day value(s) here
          timeSlots: [], // Add the desired time slot value(s) here
        },
      ],
    });
    axios
      .post("http://localhost:4000/api/v1/therapists", {
        mobile,
        name,
        email,
        availability: [
          {
            location: address,
            day: [], // Add the desired day value(s) here
            timeSlots: [], // Add the desired time slot value(s) here
          },
        ],
      })
      .then(function (response) {
        console.log(response);
        // Close the form and refresh the page
        setShowForm(false);
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("Form submitted");
  };

  console.log("Available Addresses:", availableAddress);
  let optionItems = availableAddress?.map(item => (
    <option key={item?._id} value={item?._id}>
      {`${item?.centerName}, ${item?.centerAddress}`}
    </option>
  ));

  return (
    <>
      <div className="therapistsDetailsAvailability">
        <div className="therapistQuantintity">
          {/* <div>1</div>
          <div>2</div>
          <div>3</div> */}
        </div>
        <div
          className="therapistCreateButton"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#D67449",
            padding: "5px 8px",
            borderRadius: "4px",
            width: "12rem",
            cursor: "pointer",
          }}
          onClick={handleCreateTherapist}
        >
          <img
            src={createTherapistimg}
            alt="Create Therapist"
            style={{ marginRight: "5px", width: "20px", height: "20px" }}
          />
          <span
            style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}
          >
            Create new therapist
          </span>
          <img
            src={rightSideArrow}
            alt="Right Arrow"
            style={{ marginLeft: "5px", width: "20px", height: "20px" }}
          />
        </div>
      </div>
      <div className="adminDashboardContainer">
        <h2>Therapists</h2>
        <table>
          <thead>
            <tr>
              <th>Therapist</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Patients</th>
              <th>Approval Status</th>
              <th>Total Revenue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {therapistsData.therapists.map(therapist => (
              <tr key={therapist._id}>
                <td>
                  <img
                    src={therapist?.image}
                    alt="Rounded"
                    className="therapist-image"
                  />
                  {therapist?.name}
                </td>
                <td>{therapist?.gender}</td>
                <td style={{ color: "#D67449" }}>{therapist?.email}</td>
                <td>{therapist?.mobile}</td>
                <td>{therapist?.patients?.length}</td>
                <td>{therapist?.status}</td>
                <td>{therapist?.totalRevenue}</td>
                <td>
                  <button
                    onClick={() => handleDetails(therapist?._id)}
                    style={{ border: "1px solid " }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render the form component conditionally based on the showForm state */}
      {showForm && (
        <div className="createTherapistForm">
          <h2
            style={{
              backgroundColor: "#D67449",
              color: "white",
              padding: "10px",
              textAlign: "center",
            }}
          >
            Create New Therapist
          </h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input
                type="text"
                style={{ width: "100%" }}
                onChange={e => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                style={{ width: "100%" }}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Mobile:
              <input
                type="text"
                style={{ width: "100%" }}
                onChange={e => setPhoneNumebr(e.target.value)}
                required
              />
            </label>
            <label>
              Location:
              {/* <input type="text" style={{ width: "100%" }} required /> */}
              <select
                style={{ width: "100%", borderRadius: "1rem" }}
                onChange={e => setAddress(e.target.value)}
                required
              >
                {optionItems}
              </select>
            </label>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={handleFormCancel}
                style={{
                  width: "48%",
                  backgroundColor: "white",
                  color: "#D67449",
                  border: "1px solid #D67449",
                  borderRadius: "1rem",
                  marginBottom: "10px",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: "#D67449",
                  color: "white",
                  borderRadius: "1rem",
                  width: "48%",
                  marginBottom: "10px",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Dashboard;
