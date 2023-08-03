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

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/categories`)
      .then(response => {
        const fetchedData = response.data;
        setAvailability(fetchedData);
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

  const handleImageChange = async (event) => {
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
    sessions.forEach(session => {
      if (session.date === date) {
        session.timeSlots.forEach(slot => {
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

      <div className="addressesDetailsDiv">
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
          {therapist?.sessions.length > slotsPerPage && (
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
              {slots.length > 0 ? (
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
