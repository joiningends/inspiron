import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTherapist,
  updateTherapist,
  updateTherapistImage,
} from "../../redux/Action";
import { FaEdit } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { Link, useParams } from "react-router-dom";
import "../Therapists/TherapistProfilePage.css";
import axios from "axios";

function TherapistDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const therapistId = id;
  const experienceLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
    "Not specified",
  ];
  const therapist = useSelector(state => state.therapist);
  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [meetLink, setMeetLink] = useState(therapist?.meetLink || "");
  const [isMeetLinkEditing, setIsMeetLinkEditing] = useState(false);
  const [expertiseData, setExpertisesData] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [isClickable, setIsClickable] = useState(false);

  const handleExpertiseSelection = expertiseId => {
    setSelectedExpertise(prevSelected =>
      prevSelected.includes(expertiseId)
        ? prevSelected.filter(id => id !== expertiseId)
        : [...prevSelected, expertiseId]
    );
  };

  const checkFields = () => {
    const requiredFields = ["expertise", "expriencelevel", "meetLink"];

    for (const field of requiredFields) {
      if (!therapist?.[field] || therapist?.[field].length === 0) {
        return false;
      }
    }

    return true;
  };

  React.useEffect(() => {
    setIsClickable(checkFields());
  }, [therapist]);

  const handleExpertiseSubmit = () => {
    // Here, you can use the selectedExpertise array as needed (e.g., submit it to a backend, etc.)
    dispatch(updateTherapist(therapistId, { expertise: selectedExpertise }));
  };

  useEffect(() => {
    // Function to fetch expertises data using Axios
    const fetchExpertises = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/expetises"
        );
        // Assuming the response data is an array of expertises
        setExpertisesData(response.data);
      } catch (error) {
        console.error("Error fetching expertises:", error);
      }
    };

    // Call the function to fetch expertises
    fetchExpertises();
  }, []);

  console.log(therapist);
  const [isEditing, setIsEditing] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState(
    therapist?.expriencelevel || ""
  );

  const handleExperienceLevelChange = event => {
    setExperienceLevel(event.target.value);
  };

  const handleExperienceLevelSave = () => {
    dispatch(updateTherapist(therapistId, { expriencelevel: experienceLevel }));
    setIsEditing(false);
  };

  const handleExperienceLevelCancel = () => {
    setExperienceLevel(therapist?.expriencelevel || "");
    setIsEditing(false);
  };

  const handleExperienceLevelEdit = () => {
    setIsEditing(true);
  };

  const handleMeetLinkChange = event => {
    setMeetLink(event.target.value);
  };

  const handleMeetLinkSave = () => {
    dispatch(updateTherapist(therapistId, { meetLink: meetLink }));
    setIsMeetLinkEditing(false);
  };

  const handleMeetLinkEdit = () => {
    setIsMeetLinkEditing(true);
  };

  const handleMeetLinkCancel = () => {
    setMeetLink(therapist?.meetLink || "");
    setIsMeetLinkEditing(false);
  };
  const openEducationForm = () => {
    setShowEducationForm(true);
  };

  const handleAddEducation = () => {
    const newEducation = {
      collegeName: collegeName,
      educationLevel: educationLevel,
    };
    dispatch(
      updateTherapist(therapistId, {
        education: [...therapist.education, newEducation],
      })
    );
    setShowEducationForm(false);
  };

  const handleCancelEducationClick = () => {
    setShowEducationForm(false);
  };

  const openAddressForm = () => {
    setCurrentAddress(therapist.currentaddress);
    setPermanentAddress(therapist.permanentaddress);
    setShowAddressForm(true);
  };

  const handleAddressSaveClick = () => {
    dispatch(
      updateTherapist(therapistId, {
        currentaddress: currentAddress,
        permanentaddress: permanentAddress,
      })
    );
    setShowAddressForm(false);
  };

  const handleAddressCancelClick = () => {
    setShowAddressForm(false);
  };

  const openContactForm = () => {
    setEmail(therapist.email);
    setMobile(therapist.mobile);
    setEmergencyContact(therapist.emergencycontact);
    setShowContactForm(true);
  };

  const handleContactSaveClick = () => {
    dispatch(
      updateTherapist(therapistId, {
        email: email,
        mobile: mobile,
        emergencymobile: emergencyContact,
      })
    );

    setShowContactForm(false);
  };

  const handleSaveClick = () => {
    dispatch(
      updateTherapist(therapistId, {
        name: name,
        gender: gender,
        dob: dob,
      })
    );
    setShowEditForm(false);
  };

  const handleCancelClick = () => {
    setShowEditForm(false);
  };

  const openEditForm = () => {
    setName(therapist.name);
    setGender(therapist.gender);
    setDob(therapist.DateOfBirth);
    setShowEditForm(true);
  };

  useEffect(() => {
    dispatch(fetchTherapist(therapistId));
  }, []);

  function formatDate(dateString) {
    if (!dateString) return ""; // Return empty string if dateString is undefined or null

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Pad day with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1 to get the correct month
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleButtonClick = () => {
    if (isClickable) {
      console.log("Hello");

      // Data to be sent in the PUT request
      const dataToSend = {
        expertise: therapist.expertise,
        expriencelevel: therapist.expriencelevel,
        meetLink: therapist.meetLink,
      };

      console.log(dataToSend);

      // Hit the API using the fetch API
      fetch(`http://localhost:4000/api/v1/therapists/${therapistId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data); // Handle the API response data here
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      <div
        className="personalDetailsDIV"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "2rem",
          marginRight: "2rem", // Reduced marginRight for smaller screens
          marginLeft: "-2rem",
        }}
      >
        <div
          className="primaryDetailsDiv"
          style={{
            flex: "1 1 100%",
            borderRadius: "10px",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            backgroundColor: "#fff",
            minWidth:"22rem",
          }}
        >
          <div
            className="primaryDetalsUpperPart"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span
              className="primaryDetailsTitle"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#D67449",
              }}
            >
              PRIMARY DETAILS
            </span>
            <span
              className="editIcon"
              onClick={openEditForm}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                padding: "0.5rem 1rem",
                background: "#D67449",
              }}
            >
              <FaEdit style={{ width: "1.3rem", color: "#fff" }} />
              <span
                className="editText"
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "1rem",
                  color: "#fff",
                }}
              >
                EDIT
              </span>
            </span>
          </div>
          <div
            className="primaryDetailsLowerPart1"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gridGap: "1rem",
            }}
          >
            <div className="primaryDetailsLowerPart1div1">
              <h1 className="fullnameH1">Full Name</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.name}</h1>
              <h1 className="fullnameH1">Date Of Birth</h1>
              <h1 className="itemsOfPrimaryDetails">
                {formatDate(therapist?.dob)}
              </h1>
            </div>
            <div
              className="primaryDetailsLowerPart1div2"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <h1 className="fullnameH1">Gender</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.gender}</h1>
            </div>
          </div>
        </div>

        <div
          className="primaryDetailsDiv"
          style={{
            flex: "1 1 100%",
            maxWidth: "100%", // Allow the second div to take the full width on smaller screens
            borderRadius: "10px",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            backgroundColor: "#fff",
            marginTop: "2rem", // Add margin to separate the sections on small screens
            minWidth:"22rem",
          }}
        >
          <div
            className="primaryDetalsUpperPart"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span
              className="primaryDetailsTitle"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#D67449",
              }}
            >
              CONTACT DETAILS
            </span>
            <span
              className="editIcon"
              onClick={openContactForm}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                padding: "0.5rem 1rem",
                background: "#D67449",
              }}
            >
              <FaEdit style={{ width: "1.3rem", color: "#fff" }} />
              <span
                className="editText"
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "1rem",
                  color: "#fff",
                }}
              >
                EDIT
              </span>
            </span>
          </div>
          <div
            className="primaryDetailsLowerPart1"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gridGap: "1rem",
            }}
          >
            <div className="primaryDetailsLowerPart1div1">
              <h1 className="fullnameH1">EMAIL</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.email}</h1>
              <h1 className="fullnameH1">Mobile</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.mobile}</h1>
            </div>
            <div
              className="primaryDetailsLowerPart1div2"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <h1 className="fullnameH1">Emergency Contact</h1>
              <h1 className="itemsOfPrimaryDetails">
                {therapist?.emergencymobile}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div
        className="addressesDetailsDiv"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "2rem",
          maxWidth: "82%",
        }}
      >
        <div
          className="primaryDetalsUpperPart"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <span
            className="primaryDetailsTitle"
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#D67449" }}
          >
            ADDRESS
          </span>
          <span
            className="editIcon"
            onClick={openAddressForm}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "0.2rem 0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "10%",
              marginLeft: "40%",
              background: "#D67449",
            }}
          >
            <FaEdit style={{ width: "1.3rem", color: "#fff" }} />
            <span
              className="editText"
              style={{ marginLeft: "0.5rem", fontSize: "1rem", color: "#fff" }}
            >
              EDIT
            </span>
          </span>
        </div>
        <div
          className="addressesDetailBottomsDiv"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              flex: "0 0 100%",
              maxWidth: "100%",
              borderRadius: "10px",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
              backgroundColor: "#fff",
            }}
          >
            <h1 className="fullnameH1">CURRENT ADDRESS</h1>
            <h1 className="itemsOfPrimaryDetails">
              {therapist?.currentaddress}
            </h1>
          </div>
          <div
            style={{
              flex: "0 0 100%",
              maxWidth: "100%",
              borderRadius: "10px",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
              backgroundColor: "#fff",
            }}
          >
            <h1 className="fullnameH1">PERMANENT ADDRESS</h1>
            <h1 className="itemsOfPrimaryDetails">
              {therapist?.permanentaddress}
            </h1>
          </div>
        </div>
      </div>

      <div
      className="educationDetailsDiv"
      style={{
        width: "100%", // Set full width for mobile view
        maxWidth:"85%",
        margin: "0 6%", // Center the container
        paddingLeft: "2rem", // Add padding for better mobile view
        paddingRight: "2rem", // Add padding for better mobile view
      }}
    >
      <div className="educationHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>Education Details</h2>
        <div className="editEducationIcon" onClick={openEducationForm}>
          <FaEdit />
        </div>
      </div>
      {therapist?.education.map((item, index) => (
        <div className="educationItem" key={index} style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "1rem" }}>
            <span style={{ marginRight: "1rem" }}>University / college</span>
            <span className="collegeNameText" style={{ marginRight: "1rem" }}>
              {item?.collegeName}
            </span>
            <span style={{ marginRight: "1rem" }}>Field of study</span>
            <span className="educationLevelText" style={{ marginRight: "1rem" }}>
              {item?.educationLevel}
            </span>
          </div>
        </div>
      ))}
      </div>
      {showEducationForm && (
        <Modal
          isOpen={showEducationForm}
          onRequestClose={handleCancelEducationClick}
        >
          <div className="educationForm">
            <h2>Add Education</h2>
            <div>
              <label>College Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
              />
              <label>Field of study</label>
              <input
                type="text"
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
              />
            </div>
            <div className="educationFormButtons">
              <button onClick={handleAddEducation}>Add</button>
              <button onClick={handleCancelEducationClick}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={showEditForm}
        onRequestClose={handleCancelClick}
        className="editFormModal"
        overlayClassName="editFormOverlay"
      >
        <div className="editForm">
          <div className="editFormHeader">
            <h2>Edit Therapist Details</h2>
            <span className="closeIcon" onClick={handleCancelClick}>
              <FaTimes />
            </span>
          </div>
          <div className="editFormBody">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <label htmlFor="gender">Gender:</label>
            <div>
              <input
                type="radio"
                id="gender-male"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={e => setGender(e.target.value)}
              />
              <label htmlFor="gender-male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                id="gender-female"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={e => setGender(e.target.value)}
              />
              <label htmlFor="gender-female">Female</label>
            </div>

            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
          </div>
          <div className="editFormFooter">
            <button className="saveButton" onClick={handleSaveClick}>
              Save
            </button>
            <button className="cancelButton" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {showAddressForm && (
        <div className="editFormContainer">
          <div className="editForm">
            <h2>Edit Address</h2>
            <label style={{ fontSize: "1rem" }}>Current Address:</label>
            <input
              type="text"
              value={currentAddress}
              onChange={e => setCurrentAddress(e.target.value)}
            />
            <label style={{ fontSize: "1rem" }}>Permanent Address:</label>
            <input
              type="text"
              value={permanentAddress}
              onChange={e => setPermanentAddress(e.target.value)}
            />
            <div className="buttons">
              <button
                onClick={handleAddressSaveClick}
                style={{ backgroundColor: "#D67449" }}
              >
                Save
              </button>
              <button
                onClick={handleAddressCancelClick}
                style={{ backgroundColor: "#68B545" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showContactForm && (
        <div className="modalContainer">
          <div className="modal">
            <h2>Edit Contact Details</h2>
            <label htmlFor="email" style={{ fontSize: "1rem" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label htmlFor="mobile" style={{ fontSize: "1rem" }}>
              Mobile:
            </label>
            <input
              type="text"
              id="mobile"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
            />

            <label htmlFor="emergencyContact" style={{ fontSize: "1rem" }}>
              Emergency Contact:
            </label>
            <input
              type="text"
              id="emergencyContact"
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
            />

            <div className="buttonContainer">
              <button className="saveButton" onClick={handleContactSaveClick}>
                Save
              </button>
              <button
                className="cancelButton"
                onClick={() => setShowContactForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="educationHeader" style={{ marginLeft: "8rem" }}>
        <h2>Expertise</h2>
      </div>
      <div
        style={{
          fontFamily: "Arial",
          maxWidth: "80.5%",
          margin: "auto",
          padding: "20px",
          marginTop: "1rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
          background: "#f9f9f9",
          display: "flex",
          marginRight: "11%",
          flexDirection: "column",
          alignItems: "center", // Center the elements horizontally
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap", // Enable wrapping if the container exceeds maxWidth
            justifyContent: "center", // Center the checkboxes horizontally
          }}
        >
          {expertiseData.map(expertise => (
            <label
              key={expertise._id}
              style={{
                display: "flex",
                alignItems: "center", // Align checkbox and label vertically
                marginBottom: "10px",
                marginRight: "10px", // Add marginRight to create space between checkboxes
              }}
            >
              <input
                type="checkbox"
                checked={selectedExpertise.includes(expertise._id)}
                onChange={() => handleExpertiseSelection(expertise._id)}
                style={{ marginRight: "8px", verticalAlign: "middle" }} // Adjust vertical alignment of checkbox
              />
              <span style={{ fontSize: "16px" }}>{expertise.type[0]}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleExpertiseSubmit}
          style={{
            display: "block",
            width: "10%",
            padding: "10px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "bold" }}>
          Google Meet Link:
        </h1>
        {therapist?.meetLink && !isMeetLinkEditing ? (
          <>
            <span style={{ fontSize: "1rem" }}>{therapist.meetLink}</span>
            <button
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#68b545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleMeetLinkEdit}
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={meetLink}
              onChange={handleMeetLinkChange}
              style={{
                padding: "0.5rem",
                width: "300px",
                marginRight: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#68b545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleMeetLinkSave}
            >
              Save
            </button>
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "1rem",
              }}
              onClick={handleMeetLinkCancel}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: "1rem 0" }}>
          Experience Level:
        </h1>
        {isEditing ? (
          <div>
            <select
              value={experienceLevel}
              onChange={handleExperienceLevelChange}
              style={{
                padding: "0.5rem",
                width: "200px",
                marginRight: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              {experienceLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#68b545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "1rem",
              }}
              onClick={handleExperienceLevelSave}
            >
              Save
            </button>
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "1rem",
              }}
              onClick={handleExperienceLevelCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <span style={{ marginRight: "1rem", fontSize: "1.6rem" }}>
              {therapist?.expriencelevel || "Not specified"}
            </span>
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#68b545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleExperienceLevelEdit}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",

            backgroundColor: isClickable ? "#4CAF50" : "#ccc",
            color: "#fff",
            cursor: isClickable ? "pointer" : "not-allowed",
          }}
          disabled={!isClickable}
          onClick={handleButtonClick}
        >
          Approve
        </button>
      </div>
    </>
  );
}

export default TherapistDetails;
