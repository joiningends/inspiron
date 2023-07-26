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
        emergencycontact: emergencyContact,
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
      <div className="personalDetailsDIV">
        <div className="primaryDetailsDiv">
          <div className="primaryDetalsUpperPart">
            <span className="primaryDetailsTitle" style={{ padding: "1rem" }}>
              Primary Details
            </span>
            <span
              className="editIcon"
              style={{
                padding: "0.1rem",
                margin: "0.2rem",
                borderRadius: "30%",
              }}
              onClick={openEditForm}
            >
              <FaEdit style={{ width: "1.3rem" }} />
              <span className="editText">EDIT</span>
            </span>
          </div>
          <div className="primaryDetailsLowerPart1">
            <div className="primaryDetailsLowerPart1div1">
              <h1 className="fullnameH1">Full Name</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.name}</h1>
              <h1 className="fullnameH1" style={{ paddingTop: "1rem" }}>
                Date Of Birth
              </h1>
              <h1 className="itemsOfPrimaryDetails">
                {therapist?.DateOfBirth}
              </h1>
            </div>
            <div className="primaryDetailsLowerPart1div2">
              <h1 className="fullnameH1">Gender</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.gender}</h1>
            </div>
          </div>
        </div>
        <div className="primaryDetailsDiv">
          <div className="primaryDetalsUpperPart">
            <span className="primaryDetailsTitle" style={{ padding: "1rem" }}>
              Contact Details
            </span>
            <span
              className="editIcon"
              style={{
                padding: "0.1rem",
                margin: "0.2rem",
                borderRadius: "30%",
              }}
              onClick={openContactForm}
            >
              <FaEdit style={{ width: "1.3rem" }} />
              <span className="editText">EDIT</span>
            </span>
          </div>
          <div className="primaryDetailsLowerPart1">
            <div className="primaryDetailsLowerPart1div1">
              <h1 className="fullnameH1">EMAIL</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.email}</h1>
              <h1 className="fullnameH1" style={{ paddingTop: "1rem" }}>
                Mobile
              </h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.mobile}</h1>
            </div>
            <div className="primaryDetailsLowerPart1div2">
              <h1 className="fullnameH1">emergency contact</h1>
              <h1 className="itemsOfPrimaryDetails">
                {therapist?.emergencycontact}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="addressesDetailsDiv">
        <div className="primaryDetalsUpperPart">
          <span className="primaryDetailsTitle" style={{ padding: "1rem" }}>
            Addresses
          </span>
          <span
            className="editIcon"
            style={{
              padding: "0.1rem",
              margin: "0.2rem",
              borderRadius: "30%",
            }}
            onClick={openAddressForm}
          >
            <FaEdit style={{ width: "1.3rem" }} />
            <span className="editText">EDIT</span>
          </span>
        </div>
        <div className="addressesDetailBottomsDiv">
          <div>
            <h1 className="fullnameH1">CURRENT ADDRESS</h1>
            <h1 className="itemsOfPrimaryDetails">
              {therapist?.currentaddress}
            </h1>
          </div>
          <div>
            <h1 className="fullnameH1">PERMANENT ADDRESS</h1>
            <h1 className="itemsOfPrimaryDetails">
              {therapist?.permanentaddress}
            </h1>
          </div>
        </div>
      </div>

      <div
        className="educationDetailsDiv"
        style={{ width: "80%", marginLeft: "8rem" }}
      >
        <div className="educationHeader">
          <h2>Education Details</h2>
          <div className="editEducationIcon" onClick={openEducationForm}>
            <FaEdit />
          </div>
        </div>
        {therapist?.education.map((item, index) => (
          <div className="educationItem" key={index}>
            <div>
              <span style={{ marginRight: "1rem", fontSize: "1rem" }}>
                University / college
              </span>
              <span
                className="collegeNameText"
                style={{ marginRight: "1rem", fontSize: "1rem" }}
              >
                {item?.collegeName}
              </span>
              <span
                style={{
                  marginRight: "1rem",
                  fontSize: "1rem",
                }}
              >
                Field of study
              </span>
              <span
                className="educationLevelText"
                style={{ marginRight: "1rem", fontSize: "1rem" }}
              >
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
              <label>Education Level</label>
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
            <label>Current Address:</label>
            <input
              type="text"
              value={currentAddress}
              onChange={e => setCurrentAddress(e.target.value)}
            />
            <label>Permanent Address:</label>
            <input
              type="text"
              value={permanentAddress}
              onChange={e => setPermanentAddress(e.target.value)}
            />
            <div className="buttons">
              <button onClick={handleAddressSaveClick}>Save</button>
              <button onClick={handleAddressCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showContactForm && (
        <div className="modalContainer">
          <div className="modal">
            <h2>Edit Contact Details</h2>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label htmlFor="mobile">Mobile:</label>
            <input
              type="text"
              id="mobile"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
            />

            <label htmlFor="emergencyContact">Emergency Contact:</label>
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
            <input
              type="text"
              value={experienceLevel}
              onChange={handleExperienceLevelChange}
              style={{
                padding: "0.5rem",
                width: "200px",
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
      <div
        style={{
          fontFamily: "Arial",
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
          background: "#f9f9f9",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Choose Expertise:</h2>
        {expertiseData.map(expertise => (
          <div key={expertise._id} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={selectedExpertise.includes(expertise._id)}
              onChange={() => handleExpertiseSelection(expertise._id)}
              style={{ marginRight: "8px" }}
            />
            <label style={{ fontSize: "16px" }}>{expertise.type[0]}</label>
          </div>
        ))}
        <button
          onClick={handleExpertiseSubmit}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
        {/* Optionally, you can add an edit button that allows the user to re-edit their selection */}
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
