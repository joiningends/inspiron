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
import {
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

function TherapistDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const therapistId = id;
  const therapist = useSelector(state => state.therapist);
  console.log(therapist);
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

  const [expertisesData, setExpertisesData] = useState([]);
  const [selectedExpertises, setSelectedExpertises] = useState([]);

  useEffect(() => {
    const fetchExpertises = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/expertises"
        );
        setExpertisesData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching expertises:", error);
      }
    };

    fetchExpertises();
  }, []);

  useEffect(() => {
    // Check expertise IDs from therapist?.expertise and pre-select checkboxes
    const therapistExpertises = therapist?.expertise.map(exp => {
      const matchingExpertise = expertisesData?.find(e => e._id === exp._id);
      return matchingExpertise ? matchingExpertise : null;
    });

    setSelectedExpertises(therapistExpertises?.filter(exp => exp !== null));
  }, [therapist?.expertise, expertisesData]);

  const handleSubmit = () => {
    // Dispatch the updateTherapist action with the selected expertise
    dispatch(updateTherapist(therapistId, { expertise: selectedExpertises }));

    window.location.reload();
  };

  console.log(selectedExpertises);

  const handleExpertiseChange = event => {
    const { value } = event?.target;
    if (selectedExpertises?.some(exp => exp._id === value)) {
      // If the value is already selected, remove it
      setSelectedExpertises(
        selectedExpertises?.filter(exp => exp._id !== value)
      );
    } else {
      // If the value is not selected, add it
      const selectedExpertise = expertisesData?.find(exp => exp._id === value);
      if (selectedExpertise) {
        setSelectedExpertises([...selectedExpertises, selectedExpertise]);
      }
    }
  };
  const [isClickable, setIsClickable] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  const [priceLevels, setPriceLevels] = useState([]);
  console.log(priceLevels);
  const [selectedLevelId, setSelectedLevelId] = useState("");
  const [selectedPriceData, setSelectedPriceData] = useState(null);
  const [showHint, setShowHint] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage] = useState(6);

  const [selectedLanguages, setSelectedLanguages] = useState(
    therapist?.languages || []
  );
  const [online, setOnline] = useState(
    therapist?.modeOfSession?.includes("Online")
  );
  const [offline, setOffline] = useState(
    therapist?.modeOfSession?.includes("Offline")
  );

  const handleOnlineChange = event => {
    setOnline(event.target.checked);
  };

  const handleOfflineChange = event => {
    setOffline(event.target.checked);
  };

  const handleSessionTypeSaveClick = () => {
    // Handle saving the selected session modes (online and offline) here
    const selectedModes = [];

    if (online) {
      selectedModes.push("Online");
    }

    if (offline) {
      selectedModes.push("Offline");
    }

    // Dispatch the action with the selected modes
    dispatch(updateTherapist(therapistId, { modeOfSession: selectedModes }));
  };

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({
    Online: false,
    Offline: false,
  });

  const handleSessionModeCheckboxChange = option => {
    const newCheckboxValues = {
      ...checkboxValues,
      [option]: !checkboxValues[option],
    };

    // Update selectedOptions based on checkbox values
    const newSelectedOptions = Object.keys(newCheckboxValues).filter(
      key => newCheckboxValues[key]
    );

    setCheckboxValues(newCheckboxValues);
    setSelectedOptions(newSelectedOptions);
  };

  const handleSessionModeSaveClick = () => {
    // You can send the selectedOptions array to your API for saving if needed
    console.log(selectedOptions);
    dispatch(updateTherapist(therapistId, { modeOfSession: selectedOptions }));
  };
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const therapistSessions = therapist?.sessions || []; // Ensure therapistSessions is an array
  const currentSlots =
    therapistSessions.length > 0
      ? therapistSessions.slice(indexOfFirstSlot, indexOfLastSlot)
      : [];
  const [isOutsideCountry, setIsOutsideCountry] = useState(false);
  const handleLanguageChange = event => {
    setSelectedLanguages(event.target.value);
  };

  const handleLanguageCheckboxChange = event => {
    setIsOutsideCountry(event.target.checked);
  };

  useEffect(() => {
    setSelectedLanguages(therapist?.languages || []);
    const newCheckboxValues = { Online: false, Offline: false };
    therapist?.modeOfSession.forEach(option => {
      if (option === "Online") {
        newCheckboxValues.Online = true;
      } else if (option === "Offline") {
        newCheckboxValues.Offline = true;
      }
    });
    setCheckboxValues(newCheckboxValues);
  }, [therapist]);

  const handleLanguageSaveClick = () => {
    // Dispatch an action to update the therapist with selected languages
    dispatch(
      updateTherapist(therapistId, {
        languages: selectedLanguages,
      })
    );
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    const apiUrl = "http://localhost:4000/api/v1/prices";

    axios
      .get(apiUrl)
      .then(response => {
        setPriceLevels(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedLevelId) {
      const selectedPrice = priceLevels.find(
        price => price.expriencelevel._id === selectedLevelId
      );
      setSelectedPriceData(selectedPrice);
    }
  }, [selectedLevelId, priceLevels]);

  const handleLevelChange = event => {
    setSelectedLevelId(event.target.value);
  };

  const handleSaveClickCustomName = () => {
    if (selectedPriceData) {
      console.log(`"expriencelevel":["${selectedPriceData._id}"]`);

      const url = `http://localhost:4000/api/v1/therapists/${therapistId}/approve`;

      // Data you are passing to the dispatch method
      const requestData = {
        expriencelevel: [selectedPriceData._id],
        // Add other properties if needed
      };

      axios
        .put(url, requestData)
        .then(response => {
          // Handle the response if needed
          console.log("API response:", response.data);
        })
        .catch(error => {
          // Handle errors if the API request fails
          console.error("API error:", error);
        });
    }
  };

  const handleCancelClickk = () => {
    setSelectedLevelId("");
    setSelectedPriceData(null);
  };

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/clients"
        );
        setClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
    fetchClients();
  }, []);

  useEffect(() => {
    // Automatically select checkboxes for clients in therapist's group
    setSelectedClients(
      clients.filter(client => therapist?.group?.includes(client._id))
    );
  }, [clients, therapist]);

  const handleCheckboxChange = event => {
    const clientId = event.target.name;
    const selectedClient = clients.find(client => client._id === clientId);

    if (event.target.checked) {
      setSelectedClients(prevSelectedClients => [
        ...prevSelectedClients,
        selectedClient,
      ]);
    } else {
      setSelectedClients(prevSelectedClients =>
        prevSelectedClients.filter(client => client._id !== clientId)
      );
    }

    setHasChanges(true);
  };

  const handleSave = () => {
    const selectedIds = selectedClients.map(client => client._id);
    setSelectedGroupIds(selectedIds);
    setHasChanges(false);
    console.log("Selected Group IDs:", selectedIds);

    const url = `http://localhost:4000/api/v1/therapists/${therapistId}/approve`;

    // Data you are passing to the dispatch method
    const requestData = {
      group: selectedIds,
      // Add other properties if needed
    };

    axios
      .put(url, requestData)
      .then(response => {
        // Handle the response if needed
        console.log("API response:", response.data);
      })
      .catch(error => {
        // Handle errors if the API request fails
        console.error("API error:", error);
      });
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

  useEffect(() => {
    // Function to fetch expertises data using Axios
    const fetchExpertises = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/expetises"
        );
        // Assuming the response data is an array of expertises
        setExpertisesData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching expertises:", error);
      }
    };

    // Call the function to fetch expertises
    fetchExpertises();
  }, []);

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

  const handleButtonClick = async () => {
    if (isClickable) {
      try {
        setIsClickable(false); // Disable the button while the request is being made
        const response = await axios.get(
          `http://localhost:4000/api/v1/therapists/${therapistId}/status`
        );
        // Handle the response if needed
      } catch (error) {
        // Handle errors here
      } finally {
        setIsClickable(true); // Re-enable the button after the request is completed
      }
    }
  };

  return (
    <>
      <div className="rounded-image-container" style={{ position: "relative" }}>
        <div className="rounded-image">
          <img src={therapist?.image} alt="Rounded" />
        </div>
      </div>
      <div className="personalDetailsDIV">
        <div
          className="primaryDetailsDiv"
          style={{ width: "36%", marginRight: "-1rem" }}
        >
          <div className="primaryDetalsUpperPart">
            <span className="primaryDetailsTitle" style={{ padding: "1rem" }}>
              PRIMARY DETAILS
            </span>
            <span
              className="editIcon"
              style={{
                padding: "0.1rem",
                margin: "0.2rem",
                borderRadius: "30%",
                width: "4.5rem",
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
                {formatDate(therapist?.dob)}
              </h1>
            </div>
            <div className="primaryDetailsLowerPart1div2">
              <h1 className="fullnameH1">Gender</h1>
              <h1 className="itemsOfPrimaryDetails">{therapist?.gender}</h1>
            </div>
          </div>
        </div>
        <div className="primaryDetailsDiv" style={{ width: "36%" }}>
          <div className="primaryDetalsUpperPart">
            <span className="primaryDetailsTitle" style={{ padding: "1rem" }}>
              CONTACT DETAILS
            </span>
            <span
              className="editIcon"
              style={{
                padding: "0.1rem",
                margin: "0.2rem",
                borderRadius: "30%",
                width: "4.5rem",
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
                {therapist?.emergencymobile}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="addressesDetailsDiv" style={{ marginTop: "4rem" }}>
        <div className="primaryDetalsUpperPart">
          <span className="primaryDetailsTitle" style={{ padding: "1rem" }}>
            ADDRESS
          </span>
          <span
            className="editIcon"
            style={{
              padding: "0.1rem",
              margin: "0.2rem",
              borderRadius: "30%",
              width: "4.5rem",
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
        style={{ width: "80%", marginLeft: "8rem", paddingTop: "2rem" }}
      >
        <div
          className="educationHeader"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ flex: "1", fontSize: "1.5rem", color: "black" }}>
            EDUCATION DETAILS
          </h2>
          <div
            className="editEducationIcon"
            style={{ cursor: "pointer", fontSize: "1rem", color: "#007BFF" }}
            onClick={openEducationForm}
          >
            <span
              className="editIcon"
              style={{
                padding: "0.6rem",
                margin: "0.2rem",
                borderRadius: "30%",
              }}
              onClick={openEducationForm}
            >
              <FaEdit style={{ width: "1.5rem", height: "1.7rem" }} />
              <span className="editText">EDIT</span>
            </span>
          </div>
        </div>
        {therapist?.education.map((item, index) => (
          <div
            className="educationItem"
            key={index}
            style={{ marginBottom: "1rem" }}
          >
            <div>
              <span
                style={{
                  fontWeight: "bold",
                  marginLeft: "0.5rem",
                  fontSize: "1rem",
                  color: "#555",
                }}
              >
                UNIVERSITY / COLLEGE:{" "}
              </span>
              <span
                className="educationLevelText"
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "1rem",
                  color: "#555",
                }}
              >
                {item?.collegeName}
              </span>
            </div>
            <div>
              <span
                style={{
                  fontWeight: "bold",
                  marginLeft: "0.5rem",
                  fontSize: "1rem",
                  color: "#555",
                }}
              >
                Field of Study:{" "}
              </span>
              <span
                className="educationLevelText"
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "1rem",
                  color: "#555",
                }}
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
        <div
          className="editForm"
          style={{
            textAlign: "left",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="editFormHeader">
            <h2>Edit Therapist Details</h2>
            <span
              className="closeIcon"
              onClick={handleCancelClick}
              style={{ cursor: "pointer", color: "#D67449" }}
            >
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
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            />

            <label htmlFor="gender">Gender:</label>
            <div
              className="genderOptions"
              style={{ display: "flex", alignItems: "center", gap: "20px" }}
            >
              <div>
                <input
                  type="radio"
                  id="gender-male"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={e => setGender(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="gender-male">Male</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="gender-female"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={e => setGender(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="gender-female">Female</label>
              </div>
            </div>

            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={e => setDob(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div className="editFormFooter">
            <button
              className="saveButton"
              onClick={handleSaveClick}
              style={{
                backgroundColor: "#D67449",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              className="cancelButton"
              onClick={handleCancelClick}
              style={{
                backgroundColor: "white",
                color: "#D67449",
                border: "1px solid #D67449",
                borderRadius: "4px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {showAddressForm && (
        <div className="editFormContainer" style={{ textAlign: "left" }}>
          <div
            className="editForm"
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <h2>Edit Address</h2>
            <label
              htmlFor="currentAddress"
              style={{
                fontSize: "1rem",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Current Address:
            </label>
            <input
              type="text"
              id="currentAddress"
              value={currentAddress}
              onChange={e => setCurrentAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            />
            <label
              htmlFor="permanentAddress"
              style={{
                fontSize: "1rem",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Permanent Address:
            </label>
            <input
              type="text"
              id="permanentAddress"
              value={permanentAddress}
              onChange={e => setPermanentAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            />
            <div
              className="buttons"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                onClick={handleAddressSaveClick}
                style={{
                  backgroundColor: "#D67449",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  marginRight: "16px",
                }}
              >
                Save
              </button>
              <button
                onClick={handleAddressCancelClick}
                style={{
                  backgroundColor: "white",
                  color: "#D67449",
                  border: "1px solid #D67449",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showContactForm && (
        <div className="modalContainer" style={{ textAlign: "center" }}>
          <div
            className="modal"
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <h2>Edit Contact Details</h2>
            <label
              htmlFor="email"
              style={{
                fontSize: "1rem",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            />

            <label
              htmlFor="mobile"
              style={{
                fontSize: "1rem",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Mobile:
            </label>
            <input
              type="text"
              id="mobile"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            />

            <label
              htmlFor="emergencyContact"
              style={{
                fontSize: "1rem",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Emergency Contact:
            </label>
            <input
              type="text"
              id="emergencyContact"
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            />

            <div
              className="buttonContainer"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="saveButton"
                onClick={handleContactSaveClick}
                style={{
                  backgroundColor: "#D67449",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  marginRight: "16px",
                }}
              >
                Save
              </button>
              <button
                className="cancelButton"
                onClick={() => setShowContactForm(false)}
                style={{
                  backgroundColor: "white",
                  color: "#D67449",
                  border: "1px solid #D67449",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="your-component-container" style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "1.2rem" }}>Select Expertise:</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px", // Adjust the spacing between checkboxes
          }}
        >
          {expertisesData?.map(expertise => (
            <label
              key={expertise?._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                border: "1px solid #ccc",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)", // Add shadow
                padding: "10px", // Increase padding for a better appearance
                borderRadius: "4px",
                fontSize: "0.9rem",
                width: "200px", // Adjust the width as needed
              }}
            >
              <input
                type="checkbox"
                value={expertise?._id}
                checked={selectedExpertises?.some(
                  exp => exp?._id === expertise?._id
                )}
                onChange={handleExpertiseChange}
                style={{ marginRight: "5px" }}
              />
              {expertise?.type[0]}
            </label>
          ))}
        </div>
        <button
          className="submit-button"
          onClick={handleSubmit}
          style={{
            marginTop: "1rem",
            backgroundColor: "#68B545",
            color: "#fff",
            fontSize: "1rem",
          }}
        >
          Submit
        </button>
      </div>

      <div
        style={{
          maxWidth: "38rem",
          margin: "3rem auto",
          padding: "20px",
          border: "1px solid #007BFF",
          borderRadius: "5px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
        >
          Language Selection Form
        </h2>
        <FormControl style={{ width: "100%", marginBottom: "1rem" }}>
          <InputLabel
            htmlFor="language"
            style={{ fontSize: "1rem", color: "#333" }}
          >
            Select Language
          </InputLabel>
          <Select
            id="language"
            multiple
            value={selectedLanguages}
            onChange={handleLanguageChange}
            label="Select Language"
            // style={{ backgroundColor: "rgba(104, 181, 69, 0.25)" }} // Dropdown background color
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="hindi">Hindi</MenuItem>
            <MenuItem value="telugu">Telugu</MenuItem>
            {/* Add more language options */}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLanguageSaveClick}
          style={{
            marginTop: "1rem",
            backgroundColor: "#68B545",
            color: "#fff",
            fontSize: "1rem",
          }}
        >
          Save
        </Button>
      </div>

      <div
        style={{
          maxWidth: "38rem",
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
        >
          Google Meet Link
        </h2>
        {therapist?.meetLink && !isMeetLinkEditing ? (
          <>
            <p
              style={{ fontSize: "1rem", color: "#333", marginBottom: "1rem" }}
            >
              {therapist.meetLink}
            </p>
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#68B545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
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
                width: "100%",
                marginBottom: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#68B545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
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
                fontSize: "1rem",
              }}
              onClick={handleMeetLinkCancel}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <Container
        maxWidth="sm"
        style={{
          marginTop: "50px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
        >
          Select Experience Level
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <Typography
            color="textSecondary"
            style={{
              display: showHint ? "block" : "none",
              fontSize: "1.2rem",
              color: "#333",
            }}
          >
            Selected Experience Level {"->"} {therapist?.level}
          </Typography>
          <Select
            value={selectedLevelId}
            onChange={handleLevelChange}
            fullWidth
            style={{ fontSize: "1rem" }}
          >
            <MenuItem value="" disabled>
              Select a level
            </MenuItem>
            {priceLevels.map(price => (
              <MenuItem key={price._id} value={price.expriencelevel._id}>
                {price.expriencelevel.level}
              </MenuItem>
            ))}
          </Select>
        </div>

        {selectedPriceData && (
          <div>
            <Typography variant="h5" gutterBottom>
              Selected Level: {selectedPriceData.expriencelevel.level}
            </Typography>
            <Typography gutterBottom>
              Session: {selectedPriceData.session}
            </Typography>
            <Typography gutterBottom>
              Session Price: {selectedPriceData.sessionPrice}
            </Typography>
            <Typography gutterBottom>
              Discount Price: {selectedPriceData.discountPrice}
            </Typography>
            <Button
              onClick={handleSaveClickCustomName}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px", fontSize: "1rem" }}
            >
              Save
            </Button>
            <Button
              onClick={handleCancelClick}
              variant="contained"
              color="secondary"
              style={{ fontSize: "1rem" }}
            >
              Cancel
            </Button>
          </div>
        )}
      </Container>

      <div
        style={{
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #007BFF",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
          marginTop: "3rem",
          maxWidth: "38rem",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
        >
          Session Mode
        </h2>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "1rem", color: "#333" }}>
            <input
              type="checkbox"
              value="Online"
              checked={checkboxValues.Online}
              onChange={() => handleSessionModeCheckboxChange("Online")}
              style={{ marginRight: "8px" }}
            />
            Online
          </label>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "1rem", color: "#333" }}>
            <input
              type="checkbox"
              value="Offline"
              checked={checkboxValues.Offline}
              onChange={() => handleSessionModeCheckboxChange("Offline")}
              style={{ marginRight: "8px" }}
            />
            Offline
          </label>
        </div>
        <button
          onClick={handleSessionModeSaveClick}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            backgroundColor: "#68B545",
          }}
        >
          Save
        </button>
      </div>

      <Container
        style={{
          maxWidth: "50rem",
          margin: "3rem auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
        >
          SELECT GROUP
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {clients.map(client => (
            <div
              key={client._id}
              style={{ flexBasis: "25%", marginBottom: "20px" }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedClients.some(
                      selected => selected._id === client._id
                    )}
                    onChange={handleCheckboxChange}
                    name={client._id}
                    color="primary"
                  />
                }
                label={client.name}
                style={{ fontSize: "1rem", marginLeft: "8px" }}
              />
            </div>
          ))}
        </div>

        <Box mt={2} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!hasChanges}
            style={{ fontSize: "1rem", backgroundColor: "#68B545" }}
          >
            Save
          </Button>
        </Box>
      </Container>

      <div className="TimeSlots">
        <h1>Time Slots</h1>
        <div className="date-slots-container">
          {currentSlots?.map((session, index) => (
            <div key={index}>
              <h2>Date: {session?.date}</h2>
              <ul>
                {session?.timeSlots?.map((slot, slotIndex) => (
                  <li key={slotIndex}>
                    {slot.startTime} to {slot.endTime}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pagination" style={{ marginTop: "20px" }}>
          {therapist?.sessions?.length > slotsPerPage && (
            <ul
              style={{
                listStyleType: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {Array.from(
                Array(
                  Math.ceil(therapist?.sessions.length / slotsPerPage)
                ).keys()
              ).map(pageNumber => (
                <li
                  key={pageNumber}
                  className={currentPage === pageNumber + 1 ? "active" : ""}
                  onClick={() => paginate(pageNumber + 1)}
                  style={{
                    margin: "0 5px",
                  }}
                >
                  <a
                    href="#"
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "15px",
                      background: "rgba(104, 181, 69, 0.25)",
                      color: "black",
                      textDecoration: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {pageNumber + 1}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "#fff",
          }}
          onClick={handleButtonClick}
        >
          Approve
        </button>
      </div>
    </>
  );
}

export default TherapistDetails;
