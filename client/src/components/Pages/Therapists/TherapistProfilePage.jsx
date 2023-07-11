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
import "./TherapistProfilePage.css";

const datesPerPage = 8;

function TherapistProfilePage() {
  const dispatch = useDispatch();
  const therapistId = "648c25acf73426520d1ea2b4";
  const therapist = useSelector(state => state.therapist);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDate, setActiveDate] = useState("");
  const [newTime, setNewTime] = useState("");
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

  const timeSlots = [
    "9:00 AM",
    "9:05 AM",
    "9:10 AM",
    "9:15 AM",
    "9:20 AM",
    "9:25 AM",
    "9:30 AM",
    "9:35 AM",
    "9:40 AM",
    "9:45 AM",
    "9:50 AM",
    "9:55 AM",
    "10:00 AM",
    "10:05 AM",
    "10:10 AM",
    "10:15 AM",
    "10:20 AM",
    "10:25 AM",
    "10:30 AM",
    "10:35 AM",
    "10:40 AM",
    "10:45 AM",
    "10:50 AM",
    "10:55 AM",
    "11:00 AM",
    "11:05 AM",
    "11:10 AM",
    "11:15 AM",
    "11:20 AM",
    "11:25 AM",
    "11:30 AM",
    "11:35 AM",
    "11:40 AM",
    "11:45 AM",
    "11:50 AM",
    "11:55 AM",
    "12:00 PM",
    "12:05 PM",
    "12:10 PM",
    "12:15 PM",
    "12:20 PM",
    "12:25 PM",
    "12:30 PM",
    "12:35 PM",
    "12:40 PM",
    "12:45 PM",
    "12:50 PM",
    "12:55 PM",
    "1:00 PM",
    "1:05 PM",
    "1:10 PM",
    "1:15 PM",
    "1:20 PM",
    "1:25 PM",
    "1:30 PM",
    "1:35 PM",
    "1:40 PM",
    "1:45 PM",
    "1:50 PM",
    "1:55 PM",
    "2:00 PM",
    "2:05 PM",
    "2:10 PM",
    "2:15 PM",
    "2:20 PM",
    "2:25 PM",
    "2:30 PM",
    "2:35 PM",
    "2:40 PM",
    "2:45 PM",
    "2:50 PM",
    "2:55 PM",
    "3:00 PM",
    "3:05 PM",
    "3:10 PM",
    "3:15 PM",
    "3:20 PM",
    "3:25 PM",
    "3:30 PM",
    "3:35 PM",
    "3:40 PM",
    "3:45 PM",
    "3:50 PM",
    "3:55 PM",
    "4:00 PM",
    "4:05 PM",
    "4:10 PM",
    "4:15 PM",
    "4:20 PM",
    "4:25 PM",
    "4:30 PM",
    "4:35 PM",
    "4:40 PM",
    "4:45 PM",
    "4:50 PM",
    "4:55 PM",
    "5:00 PM",
    "5:05 PM",
    "5:10 PM",
    "5:15 PM",
    "5:20 PM",
    "5:25 PM",
    "5:30 PM",
    "5:35 PM",
    "5:40 PM",
    "5:45 PM",
    "5:50 PM",
    "5:55 PM",
    "6:00 PM",
    "6:05 PM",
    "6:10 PM",
    "6:15 PM",
    "6:20 PM",
    "6:25 PM",
    "6:30 PM",
    "6:35 PM",
    "6:40 PM",
    "6:45 PM",
    "6:50 PM",
    "6:55 PM",
    "7:00 PM",
    "7:05 PM",
    "7:10 PM",
    "7:15 PM",
    "7:20 PM",
    "7:25 PM",
    "7:30 PM",
    "7:35 PM",
    "7:40 PM",
    "7:45 PM",
    "7:50 PM",
    "7:55 PM",
    "8:00 PM",
    "8:05 PM",
    "8:10 PM",
    "8:15 PM",
    "8:20 PM",
    "8:25 PM",
    "8:30 PM",
    "8:35 PM",
    "8:40 PM",
    "8:45 PM",
    "8:50 PM",
    "8:55 PM",
    "9:00 PM",
    "9:05 PM",
    "9:10 PM",
    "9:15 PM",
    "9:20 PM",
    "9:25 PM",
    "9:30 PM",
    "9:35 PM",
    "9:40 PM",
    "9:45 PM",
    "9:50 PM",
    "9:55 PM",
    "10:00 PM",
    "10:05 PM",
    "10:10 PM",
    "10:15 PM",
    "10:20 PM",
    "10:25 PM",
    "10:30 PM",
    "10:35 PM",
    "10:40 PM",
    "10:45 PM",
    "10:50 PM",
    "10:55 PM",
    "11:00 PM",
  ];

  const handleAddTime = (date, selectedTimeSlot) => {
    // Copy the availability object
    const updatedAvailability = { ...therapist.availability };

    // Check if the date exists in the availability object
    if (updatedAvailability?.hasOwnProperty(date)) {
      // Add the selected time slot to the availability for the specific date
      updatedAvailability[date].push(selectedTimeSlot);

      // Update the therapist's availability in the Redux store or send a request to update the server
      dispatch(
        updateTherapist(therapistId, { availability: updatedAvailability })
      );
    }

    // Reset the activeDate state
    setActiveDate("");
  };

  const handleRemoveTime = (date, time) => {
    // Copy the availability object
    const updatedAvailability = { ...therapist.availability };

    // Check if the date exists in the availability object
    if (updatedAvailability.hasOwnProperty(date)) {
      // Filter out the selected time from the availability for the specific date
      updatedAvailability[date] = updatedAvailability[date].filter(
        t => t !== time
      );

      // Update the therapist's availability in the Redux store or send a request to update the server
      dispatch(
        updateTherapist(therapistId, { availability: updatedAvailability })
      );
    }
  };

  useEffect(() => {
    dispatch(fetchTherapist(therapistId));
  }, []);

  // ...

  const availability = therapist?.availability;
  let dates;
  if (availability != null) {
    dates = Object?.keys(availability);
  } else {
    dates = [];
  }

  // ...

  // Calculate the start and end indexes for the current page
  const startIndex = (currentPage - 1) * datesPerPage;
  const endIndex = startIndex + datesPerPage;

  // Get the dates for the current page
  const datesForCurrentPage = dates.slice(startIndex, endIndex);

  const totalPages = Math.ceil(dates.length / datesPerPage);

  const goToPage = page => {
    setCurrentPage(page);
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

      <div className="availableTimeSlots">
        <div className="booktime-parentcard">
          {dates.length === 0 ? (
            <div className="noAvailability">No availability found.</div>
          ) : (
            <div className="booktime-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => goToPage(index + 1)}
                  style={{ backgroundColor: "#68b545" }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
          <div className="booktime-containerr">
            <div className="booktime-miniContainer">
              {datesForCurrentPage.map(date => (
                <div className="booktime-dateColumn" key={date}>
                  <div className="booktime-dateSelect">{formatDate(date)}</div>
                  {availability[date].map(time => (
                    <div className="booktime-time" key={time}>
                      {time + " "}
                      <FaTimes
                        className="remove-icon"
                        onClick={() => handleRemoveTime(date, time)}
                      />
                    </div>
                  ))}
                  {activeDate === date && (
                    <div className="booktime-addTime">
                      <select
                        value={newTime}
                        onChange={event => setNewTime(event.target.value)}
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map(timeSlot => (
                          <option key={timeSlot} value={timeSlot}>
                            {timeSlot}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleAddTime(date, newTime)}>
                        Add
                      </button>
                    </div>
                  )}
                  {!activeDate && (
                    <div
                      className="booktime-editButtonContainer"
                      onClick={() => setActiveDate(date)}
                    >
                      <div className="booktime-editButton">Edit</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function formatDate(date) {
  const inputDate = new Date(date);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate = `${daysOfWeek[inputDate.getDay()]}, ${
    monthsOfYear[inputDate.getMonth()]
  } ${inputDate.getDate()}`;
  return formattedDate;
}

export default TherapistProfilePage;
