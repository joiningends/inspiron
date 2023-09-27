import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useDispatch } from "react-redux";
import createTherapistimg from "./intermediary.png";
import rightSideArrow from "./right-arrow.png";

function Dashboard() {
  const dispatch = useDispatch();
  const [profession, setProfession] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState("");
  const [mobile, setPhoneNumebr] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [therapistsData, setTherapistsDetails] = useState({
    totalTherapists: 0,
    therapists: [],
  });

  useEffect(() => {
    const fetchTherapistsDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/therapists/total-therapists"
        );
        setTherapistsDetails(response.data);
      } catch (error) {
        console.error("Error fetching therapist details:", error);
      }
    };

    fetchTherapistsDetails();
  }, []);

  const [availableAddress, setAvailableAddress] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/categories/center/info")
      .then((response) => {
        setAvailableAddress(response.data?.categories);
      });
  }, []);

  const handleDetails = (therapistId) => {
    const url = `/therapists-Details/${therapistId}`;
    window.open(url, "_blank");
  };

  const handleCreateTherapist = () => {
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/v1/therapists", {
        mobile,
        name,
        email,
        availability: [
          {
            location: address,
            day: "Monday",
          },
        ],
        therapisttype: profession,
      })
      .then(function (response) {
        setShowForm(false);
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTherapists = therapistsData.therapists.filter((therapist) =>
    therapist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const optionItems = availableAddress?.map((item) => (
    <option key={item?._id} value={item?._id}>
      {`${item?.centerName}, ${item?.centerAddress}`}
    </option>
  ));

  return (
    <>
      <div className="therapistsDetailsAvailability">
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: "bold",
            marginRight: "1rem",
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            color: "white",
            backgroundColor: "#D67449",
            padding: "5px 8px",
            borderRadius: "4px",
            width: "13rem",
            height: "5rem",
            marginTop: "1rem",
          }}
        >
          Total Therapist Count: {therapistsData.totalTherapists}
        </div>
        <div
          className="therapistCreateButton"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#D67449",
            padding: "5px 8px",
            borderRadius: "4px",
            width: "13rem",
            marginRight: "6%",
            height: "5rem",
            cursor: "pointer",
            marginTop: "1rem",
          }}
          onClick={handleCreateTherapist}
        >
          <img
            src={createTherapistimg}
            alt="Create Therapist"
            style={{ marginRight: "0.5rem", width: "2rem", height: "2rem" }}
          />
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Create new therapist
          </span>
          <img
            src={rightSideArrow}
            alt="Right Arrow"
            style={{ marginLeft: "0.5rem", width: "20px", height: "20px" }}
          />
        </div>
      </div>

      <div className="adminDashboardContainer" style={{ padding: "1rem", width: "100%" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Therapists</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "1rem" ,width:"91%"}}
        />
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "0.3rem", textAlign: "left" }}>
                  Therapist
                </th>
                <th style={{ padding: "0.3rem", textAlign: "left" }}>Gender</th>
                <th style={{ padding: "0.3rem", textAlign: "left" }}>Email</th>
                <th style={{ padding: "0.3rem", textAlign: "left" }}>
                  Mobile No.
                </th>
                <th style={{ padding: "0.3rem", textAlign: "left" }}>
                  Patients
                </th>
                <th style={{ padding: "0.3rem", textAlign: "left" }}>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTherapists.map((therapist) => (
                <tr key={therapist._id}>
                  <td
                    style={{
                      padding: "0.3rem",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={therapist?.image}
                      alt="Rounded"
                      className="therapist-image"
                      style={{
                        marginRight: "0.3rem",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                    />
                    {therapist?.name}
                  </td>
                  <td style={{ padding: "0.3rem", textAlign: "left" }}>
                    {therapist?.gender}
                  </td>
                  <td
                    style={{ padding: "0.3rem", textAlign: "left" }}
                    className="emailColumn"
                  >
                    {therapist?.email}
                  </td>
                  <td style={{ padding: "0.3rem", textAlign: "left" }}>
                    {therapist?.mobile}
                  </td>
                  <td style={{ padding: "0.3rem", textAlign: "left" }}>
                    {therapist?.patients?.length}
                  </td>
                  <td style={{ padding: "0.3rem", textAlign: "left" }}>
                    {therapist?.status}
                  </td>
                  <td style={{ padding: "0.3rem", textAlign: "left" }}>
                    <button
                      onClick={() => handleDetails(therapist?._id)}
                      className="detailsButton"
                      style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="createTherapistForm">
          <form onSubmit={handleFormSubmit}>
            <label style={{ fontSize: "2rem" }}>Create New Therapist</label>
            <label>
              Name:
              <input
                type="text"
                style={{ width: "100%" }}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                style={{ width: "100%" }}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Mobile:
              <input
                type="text"
                style={{ width: "100%" }}
                onChange={(e) => setPhoneNumebr(e.target.value)}
                required
              />
            </label>
            <label>
              Profession:
              <label style={{ display: "inline-block", marginLeft: "10px" }}>
                <input
                  type="radio"
                  value="therapist"
                  checked={profession === "therapist"}
                  onChange={() => setProfession("therapist")}
                />
                Therapist
              </label>
              <label style={{ display: "inline-block", marginLeft: "10px" }}>
                <input
                  type="radio"
                  value="psychiatrist"
                  checked={profession === "psychiatrist"}
                  onChange={() => setProfession("psychiatrist")}
                />
                Psychiatrist
              </label>
            </label>
            <label>
              Location:
              <select
                style={{ width: "100%", borderRadius: "1rem" }}
                onChange={(e) => setAddress(e.target.value)}
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
