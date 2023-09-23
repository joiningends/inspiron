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
import jwt_decode from "jwt-decode";
import "./TimeSlots.css";
import moment from "moment";
import axios from "axios";
import "./TherapistProfilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Typography,
  Container,
  Grid,
} from "@mui/material";

function TherapistProfilePage() {
  const dispatch = useDispatch();
  const [therapistId, setTherapistId] = useState(null);
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

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [reservedSlots, setReservedSlots] = useState(new Set());
  const [cooldownPeriod, setCooldownPeriod] = useState(15); // Cooldown period in minutes
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [slotsPerPage] = useState(6); // Number of slots to display per page
  const [appointmentMode, setAppointmentMode] = useState("online");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [imageUrl, setImageUrl] = useState(therapist?.image);
  const [availability, setAvailability] = useState([]);

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

  const handleSessionModeSave = () => {
    // Replace this with your actual database storage logic
    // For now, we'll just log the selected options
    dispatch(updateTherapist(therapistId, { modeOfSession: selectedOptions }));
  };

  const [selectedLanguages, setSelectedLanguages] = useState(
    therapist?.languages || []
  );
  const [isOutsideCountry, setIsOutsideCountry] = useState(false);

  useEffect(() => {
    setSelectedLanguages(therapist?.languages || []);
    const newCheckboxValues = { Online: false, Offline: false };
    therapist?.modeOfSession?.forEach(option => {
      if (option === "Online") {
        newCheckboxValues.Online = true;
      } else if (option === "Offline") {
        newCheckboxValues.Offline = true;
      }
    });
    setCheckboxValues(newCheckboxValues);
  }, [therapist]);

  const handleLanguageChange = event => {
    setSelectedLanguages(event.target.value);
  };

  const handleCheckboxChange = event => {
    setIsOutsideCountry(event.target.checked);
  };

  const handleLanguageSaveClick = () => {
    dispatch(
      updateTherapist(therapistId, {
        languages: selectedLanguages,
      })
    );
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/categories/center/info`)
      .then(response => {
        const fetchedData = response.data;
        setAvailability(fetchedData.categories);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log(therapist?.image);
  function formatDate(dateString) {
    if (!dateString) return ""; // Return empty string if dateString is undefined or null

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Pad day with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1 to get the correct month
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleImageChange = async event => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    console.log(file);

    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/therapists/${therapistId}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Assuming the response.data.image contains the URL of the uploaded image.
    } catch (error) {
      console.error("Failed to upload image:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const timeSlotDuration = 60; // Time slot duration in minutes

  useEffect(() => {
    // Assuming you have the JWT token stored in local storage under the key "jwtToken"
    const token = localStorage.getItem("token");

    if (token) {
      // Decoding the token
      const decodedToken = jwt_decode(token);

      // Accessing the 'id' from the payload
      const id = decodedToken.userId;

      // Setting the therapistId state with the extracted ID
      setTherapistId(id);
    }
  });

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (therapistId) {
        try {
          // Call the API to fetch therapist data with the therapistId
          await dispatch(fetchTherapist(therapistId));
        } catch (error) {
          // Handle the error here (e.g., show an error message)
          console.error("Error fetching therapist data:", error);
        }
      }
    };

    fetchTherapistData();
  }, [therapistId]);

  console.log(therapist);

  const today = moment().format("YYYY-MM-DD");
  const currentTime = moment().format("HH:mm");

  const handleDateChange = event => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    setReservedSlots(getReservedSlots(selectedDate, therapist?.sessions)); // Update reserved slots for the selected date
  };

  const handleStartTimeChange = event => {
    setStartTime(event.target.value);
  };

  const handleAddSlotClick = () => {
    if (startTime) {
      const endTime = calculateEndTime(startTime);
      const slot = {
        startTime,
        endTime,
        sessionType: appointmentMode,
        location: selectedLocation,
      };

      // Check if the new slot overlaps with any existing slot
      const overlappingSlots = slots.filter(
        existingSlot =>
          moment(existingSlot.startTime, "HH:mm").isSameOrBefore(
            moment(startTime, "HH:mm")
          ) &&
          moment(existingSlot.endTime, "HH:mm").isAfter(
            moment(startTime, "HH:mm")
          )
      );

      if (overlappingSlots.length > 0) {
        const nextAvailableSlot = getNextAvailableSlot(startTime);
        alert(
          `Selected slot overlaps with an existing slot. Please choose a different time. Next available slot: ${formatNextAvailableSlot(
            nextAvailableSlot
          )}`
        );
        return;
      }

      // Check if there is a cooldown period before the new slot
      if (hasCooldownPeriod(startTime)) {
        const nextAvailableSlot = getNextAvailableSlot(startTime);
        alert(
          `There is a cooldown period before the selected start time. Please choose a different time. Next available slot: ${formatNextAvailableSlot(
            nextAvailableSlot
          )}`
        );
        return;
      }

      setSlots([...slots, slot]);
      setStartTime("");
    }
  };

  const calculateEndTime = startTime => {
    const start = moment(startTime, "HH:mm");
    const end = start.clone().add(timeSlotDuration, "minutes").format("HH:mm");
    return end;
  };

  const hasCooldownPeriod = startTime => {
    if (slots.length === 0) {
      return false;
    }

    const lastSlotEndTime = moment(slots[slots.length - 1].endTime, "HH:mm");
    const newSlotStartTime = moment(startTime, "HH:mm");
    const duration = moment.duration(newSlotStartTime.diff(lastSlotEndTime));
    const cooldownMinutes = duration.asMinutes();

    return cooldownMinutes < cooldownPeriod;
  };

  const getNextAvailableSlot = startTime => {
    const lastSlotEndTime = moment(slots[slots.length - 1].endTime, "HH:mm");
    const nextStartTime = lastSlotEndTime
      .clone()
      .add(cooldownPeriod, "minutes");
    const nextEndTime = nextStartTime.clone().add(timeSlotDuration, "minutes");
    const nextSlot = {
      startTime: nextStartTime.format("HH:mm"),
      endTime: nextEndTime.format("HH:mm"),
    };
    return nextSlot;
  };

  const formatNextAvailableSlot = slot => {
    return `${slot.startTime} to ${slot.endTime}`;
  };

  const handleSubmitClick = async () => {
    if (date && slots.length > 0) {
      const sessions = therapist?.sessions;
      let updatedSessions;

      // Check if therapist.sessions is an object or an array
      if (Array.isArray(sessions)) {
        // therapist.sessions is an array, create an object with dates as keys
        updatedSessions = sessions.reduce((acc, session) => {
          acc[moment(session.date).format("YYYY-MM-DD")] = session;
          return acc;
        }, {});
      } else {
        // therapist.sessions is an object or undefined, use an empty object
        updatedSessions = {};
      }

      console.log(updatedSessions);

      // Update the session or add a new one if it doesn't exist for the selected date
      updatedSessions[moment(date).format("YYYY-MM-DD")] = {
        date,
        timeSlots: slots,
      };

      // Convert the updated sessions object back to an array
      const sortedSessions = Object.values(updatedSessions).sort((a, b) =>
        moment(a.date).diff(moment(b.date))
      );

      console.log(sortedSessions);

      const updatedTherapist = { sessions: sortedSessions };
      console.log(updatedTherapist);
      await dispatch(updateTherapist(therapistId, updatedTherapist));

      setDate("");
      setSlots([]);
    }
  };

  const getReservedSlots = (date, sessions) => {
    const reservedSlots = new Set();
    sessions?.forEach(session => {
      if (session.date === date) {
        session?.timeSlots?.forEach(slot => {
          reservedSlots.add(slot.startTime);
        });
      }
    });
    return reservedSlots;
  };

  // Pagination logic
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const therapistSessions = therapist?.sessions || []; // Ensure therapistSessions is an array
  const currentSlots =
    therapistSessions.length > 0
      ? therapistSessions.slice(indexOfFirstSlot, indexOfLastSlot)
      : [];

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleAppointmentModeChange = event => {
    setAppointmentMode(event.target.value);
  };

  const handleLocationChange = event => {
    setSelectedLocation(event.target.value);
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
    // Assuming you have the JWT token stored in local storage under the key "jwtToken"
    const token = localStorage.getItem("token");

    if (token) {
      // Decoding the token
      const decodedToken = jwt_decode(token);

      // Accessing the 'id' from the payload
      const id = decodedToken.userId;

      // Setting the therapistId state with the extracted ID
      setTherapistId(id);
    }
  }, []);

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (therapistId) {
        try {
          // Call the API to fetch therapist data with the therapistId
          await dispatch(fetchTherapist(therapistId));
        } catch (error) {
          // Handle the error here (e.g., show an error message)
          console.error("Error fetching therapist data:", error);
        }
      }
    };

    fetchTherapistData();
  }, [therapistId]);

  return (
    <>
      <div className="rounded-image-container" style={{ position: "relative" }}>
        <div className="rounded-image">
          <img src={therapist?.image} alt="Rounded" />
          <div
            className="edit-button"
            style={{
              position: "absolute",
              top: "calc(100% - 40px)", // Adjust the distance from the top here
              right: "10px",
              background: "white",
              padding: "5px",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faEdit} style={{ fontSize: "16px" }} />
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                position: "absolute",
                width: "100%", // Make the input element cover the whole container
                height: "100%", // Make the input element cover the whole container
                opacity: "0", // Visually hide the input element
                cursor: "pointer",
              }}
            />
          </div>
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

      {showEducationForm && (
        <Modal
          isOpen={showEducationForm}
          onRequestClose={handleCancelEducationClick}
          className="educationFormModal"
          overlayClassName="educationFormOverlay"
        >
          <div
            className="educationForm"
            style={{
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h2>Add Education</h2>
            <div>
              <label>College Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginBottom: "16px",
                }}
              />
              <label>Field of study</label>
              <input
                type="text"
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div
              className="educationFormButtons"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                onClick={handleAddEducation}
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
                Add
              </button>
              <button
                onClick={handleCancelEducationClick}
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
      )}
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #007BFF",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
          marginTop: "3rem",
          width:"38rem"
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
            backgroundColor:"#68B545"
          }}
        >
          Save
        </button>
      </div>

      <div
        style={{
          maxWidth: "500px",
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

        <div className="add-slot-container" style={{ marginTop: "4rem" }}>
          <h2>Add Date and Slots</h2>
          <form>
            <div className="input-container">
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                min={today}
                required
              />
            </div>

            {date && (
              <>
                <div className="input-container">
                  <label>Start Time:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    required
                  />
                </div>

                <div
                  className="input-container"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label style={{ marginBottom: "2.2rem" }}>
                    Mode of Appointment:
                  </label>
                  <div
                    className="radio-group"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="radio"
                        id="online"
                        name="appointmentMode"
                        value="online"
                        checked={appointmentMode === "online"}
                        onChange={handleAppointmentModeChange}
                      />
                      <label htmlFor="online" style={{ marginLeft: "5px" }}>
                        Online
                      </label>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="radio"
                        id="offline"
                        name="appointmentMode"
                        value="online/offline"
                        checked={appointmentMode === "online/offline"}
                        onChange={handleAppointmentModeChange}
                      />
                      <label htmlFor="offline" style={{ marginLeft: "5px" }}>
                        Online/Offline
                      </label>
                    </div>
                  </div>
                </div>

                {appointmentMode === "online/offline" && (
                  <div className="input-container">
                    <label>Location:</label>
                    <select
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      style={{ width: "9rem", padding: "8px" }} // Adjust the width and padding as needed
                    >
                      <option value="">Select a location</option>
                      {availability?.map(item => (
                        <option key={item._id} value={item?.centerName}>
                          {item?.centerAddress} {item?.centerName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div
              className="button-container"
              style={{ marginTop: "2rem", marginRight: "1rem" }}
            >
              <button
                type="button"
                onClick={handleAddSlotClick}
                disabled={!startTime}
                style={{ width: "5rem", fontSize: "0.9rem" }}
              >
                Add Slot
              </button>
            </div>

            <div
              className="selected-slots"
              style={{
                marginLeft: "1rem",
                marginRight: "3rem",
                width: "10rem",
              }}
            >
              <h3 style={{ width: "10rem" }}>Selected Slots:</h3>
              {slots?.length > 0 ? (
                <ul>
                  {slots?.map((slot, index) => (
                    <li key={index}>
                      {slot.startTime} to {slot.endTime}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No slots selected</p>
              )}
            </div>

            {date && slots.length > 0 && (
              <div className="button-container">
                <button
                  type="button"
                  onClick={handleSubmitClick}
                  style={{
                    marginTop: "3rem",
                    width: "8.4rem",
                    fontSize: "0.75rem",
                  }}
                >
                  Submit Slots
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default TherapistProfilePage;
