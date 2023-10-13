import React, { useState, useEffect } from "react";
import "./FirstSessionNotes.css";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  RadioGroup,
  FormControl,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SociodemographicForm() {
  const [fullName, setFullName] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  console.log(appointmentDetails?.socioeconomic?.json);
  const [age, setAge] = useState(appointmentDetails?.socioeconomic?.json?.Age);
  const [gender, setGender] = useState(
    appointmentDetails?.socioeconomic?.json?.Gender
  );
  const [pronouns, setPronouns] = useState(
    appointmentDetails?.socioeconomic?.json
  );
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [address, setAddress] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [socioeconomicStatus, setSocioeconomicStatus] = useState("");
  const [informantName, setInformantName] = useState("");
  const [relationshipWithPatient, setRelationshipWithPatient] = useState("");
  const [durationOfStay, setDurationOfStay] = useState("");
  const [information, setInformation] = useState("");
  const [religionEthnicity, setReligionEthnicity] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [reference, setReference] = useState("");
  const [languagesKnown, setLanguagesKnown] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${id}`)
      .then(response => response.json())
      .then(data => {
        setAppointmentDetails(data);
        setFullName(data?.name);
        console.log(data);
        // Retrieve therapist details
      })
      .catch(error =>
        console.error("Error retrieving appointment details:", error)
      );
  }, [id]);

  const handleLanguagesKnownChange = e => {
    const selectedLanguage = e.target.value;
    if (e.target.checked) {
      // Add the selected language to the array
      setLanguagesKnown(prevLanguages => [...prevLanguages, selectedLanguage]);
    } else {
      // Remove the selected language from the array
      setLanguagesKnown(prevLanguages =>
        prevLanguages.filter(language => language !== selectedLanguage)
      );
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    // Perform form validation
    if (
      fullName === "" ||
      age === "" ||
      gender === "" ||
      pronouns === "" ||
      height === "" ||
      weight === "" ||
      address === "" ||
      contactDetails === "" ||
      emergencyContactName === "" ||
      emergencyContactNumber === "" ||
      education === "" ||
      occupation === "" ||
      socioeconomicStatus === "" ||
      informantName === "" ||
      relationshipWithPatient === "" ||
      durationOfStay === "" ||
      information === "" ||
      religionEthnicity === "" ||
      dateOfBirth === "" ||
      maritalStatus === "" ||
      reference === "" ||
      languagesKnown.length === 0
    ) {
      // Display an error message if any field is empty
      toast.error("Please fill in all the required fields.");
      return;
    }

    // Create JSON object from form data
    const json = {
      "Full Name": fullName,
      Age: age,
      Gender: gender,
      Pronouns: pronouns,
      "Height (in CM)": height,
      "Weight (in Kg)": weight,
      "Full Address": address,
      "Contact Details": contactDetails,
      "Emergency Contact Name": emergencyContactName,
      "Emergency Contact Number": emergencyContactNumber,
      Education: education,
      Occupation: occupation,
      "Socioeconomic Status": socioeconomicStatus,
      "Informant Name": informantName,
      "Relationship with Patient": relationshipWithPatient,
      "Duration of Stay with Patient": durationOfStay,
      Information: information,
      "Religion/Ethnicity": religionEthnicity,
      "Date of Birth": dateOfBirth,
      "Languages Known": languagesKnown,
      "Marital Status": maritalStatus,
      Reference: reference,
    };

    console.log("Form JSON:", json);
    // Reset the form fields

    const dataToSend = {
      socioeconomic: { json },
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/${id}/sess`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Form submitted successfully");

      console.log("POST Request Response:", response.data);
    } catch (error) {
      console.error("Error sending POST request:", error.message);
      toast.error("Form submission failed");
    }
  };

  return (
    <>
      <form className="sociodemographic-form" onSubmit={handleFormSubmit}>
        <h3>Sociodemographic Details</h3>
        <label>
          Full Name:
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </label>
        <label>
          Age:
          <select value={age} onChange={e => setAge(e.target.value)} required>
            <option value="">Select Age</option>
            {Array.from({ length: 100 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Gender:
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="transgender">Transgender</option>
            <option value="preferNotToSay">Prefer not to say</option>
          </select>
        </label>
        <label>
          Pronouns:
          <select
            value={pronouns}
            onChange={e => setPronouns(e.target.value)}
            required
          >
            <option value="">Select Pronouns</option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
            <option value="noPronouns">No pronouns</option>
          </select>
        </label>
        <label>
          Height (in CM):
          <input
            type="text"
            value={height}
            onChange={e => setHeight(e.target.value)}
            required
          />
        </label>
        <label>
          Weight (in Kg):
          <input
            type="text"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            required
          />
        </label>
        <label>
          Full Address:
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          Contact Details:
          <input
            type="text"
            value={contactDetails}
            onChange={e => setContactDetails(e.target.value)}
            required
          />
        </label>
        <label>
          Emergency Contact Name:
          <input
            type="text"
            value={emergencyContactName}
            onChange={e => setEmergencyContactName(e.target.value)}
            required
          />
        </label>
        <label>
          Emergency Contact Number:
          <input
            type="text"
            value={emergencyContactNumber}
            onChange={e => setEmergencyContactNumber(e.target.value)}
            required
          />
        </label>
        <label>
          Education:
          <textarea
            value={education}
            onChange={e => setEducation(e.target.value)}
            required
          />
        </label>
        <label>
          Occupation:
          <input
            type="text"
            value={occupation}
            onChange={e => setOccupation(e.target.value)}
            required
          />
        </label>
        <label>
          Socioeconomic Status:
          <select
            value={socioeconomicStatus}
            onChange={e => setSocioeconomicStatus(e.target.value)}
            required
          >
            <option value="">Select SocioeconomicStatus</option>
            <option value="lower">Lower</option>
            <option value="middle">Middle</option>
            <option value="upper">Upper</option>
          </select>
        </label>
        <label>
          Informant Name:
          <input
            type="text"
            value={informantName}
            onChange={e => setInformantName(e.target.value)}
            required
          />
        </label>
        <label>
          Relationship with Patient:
          <select
            value={relationshipWithPatient}
            onChange={e => setRelationshipWithPatient(e.target.value)}
            required
          >
            <option value="">Select Relationship</option>
            <option value="parents">Parents</option>
            <option value="relative">Relative</option>
            <option value="cousin">Cousin</option>
            <option value="friends">Friends</option>
            <option value="colleague">Colleague</option>
          </select>
        </label>
        <label>
          Duration of Stay with Patient:
          <select
            value={durationOfStay}
            onChange={e => setDurationOfStay(e.target.value)}
            required
          >
            <option value="">Select Duration of Stay</option>
            <option value="hindu">2 days</option>
          </select>
        </label>
        <label>
          Information:
          <select
            value={information}
            onChange={e => setInformation(e.target.value)}
            required
          >
            <option value="">Select Information</option>
            <option value="reliable">Reliable</option>
            <option value="adequate">Adequate</option>
            <option value="questionable">Questionable</option>
          </select>
        </label>
        <label>
          Religion/Ethnicity:
          <select
            value={religionEthnicity}
            onChange={e => setReligionEthnicity(e.target.value)}
            required
          >
            <option value="">Select Religion/Ethnicity</option>
            <option value="hindu">Hindu</option>
            <option value="muslim">Muslim</option>
            <option value="christian">Christian</option>
            <option value="jain">Jain</option>
            <option value="others">Others</option>
          </select>
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
            required
          />
        </label>
        <label style={{ display: "block", textAlign: "center" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Languages Known:
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="english"
                checked={languagesKnown.includes("english")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              English
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="hindi"
                checked={languagesKnown.includes("hindi")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              Hindi
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="telugu"
                checked={languagesKnown.includes("telugu")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              Telugu
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="marathi"
                checked={languagesKnown.includes("marathi")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              Marathi
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="kannada"
                checked={languagesKnown.includes("kannada")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              Kannada
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="tamil"
                checked={languagesKnown.includes("tamil")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              Tamil
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="other"
                checked={languagesKnown.includes("other")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              Other
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                marginBottom: "0.5rem",
                flexBasis: "25%",
              }}
            >
              <input
                type="checkbox"
                value="foreignLanguage"
                checked={languagesKnown.includes("foreignLanguage")}
                onChange={handleLanguagesKnownChange}
                style={{ marginRight: "0.3rem" }}
              />
              Foreign Language
            </label>
          </div>
        </label>

        <label>
          Marital Status:
          <select
            value={maritalStatus}
            onChange={e => setMaritalStatus(e.target.value)}
            required
          >
            <option value="">Select Marital Status</option>
            <option value="married">Married</option>
            <option value="unmarried">Unmarried</option>
            <option value="single">Single</option>
            <option value="relationship">In a relationship</option>
          </select>
        </label>
        <label>
          Reference:
          <select
            value={reference}
            onChange={e => setReference(e.target.value)}
            required
          >
            <option value="">Select Reference</option>
            <option value="doctor">Doctor</option>
            <option value="familyFriend">Family &amp; friend</option>
            <option value="socialMedia">Social media</option>
            <option value="googleSearch">Google search</option>
            <option value="employeeReference">Employee reference</option>
            <option value="clientReference">Client reference</option>
          </select>
        </label>
        <button
          type="submit"
          style={{ backgroundColor: "#D67449", color: "white" }}
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </>
  );
}

const onsetOptions = [
  "Acute (Sudden)",
  "Abrupt (Few hours to few days)",
  "Sub-acute (Few days to few weeks)",
  "Insidious (Few weeks to few months)",
];

function ChiefComplaintsForm() {
  const [fetchedData, setFetchedData] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [selectedOnset, setSelectedOnset] = useState(null);
  const [showOnsetPopup, setShowOnsetPopup] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/headings`)
      .then(response => setFetchedData(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const isFirstQuestion = currentQuestionIndex === 0;
    setIsPrevDisabled(isFirstQuestion);
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    if (showOnsetPopup) {
      setShowOnsetPopup(false);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (showOnsetPopup) {
      setShowOnsetPopup(false);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleOptionChange = optionId => {
    const updatedResponses = [...userResponses];
    const response = updatedResponses[currentQuestionIndex] || {};
    const selectedOptions = response.selectedOptions || [];

    if (selectedOptions.includes(optionId)) {
      selectedOptions.splice(selectedOptions.indexOf(optionId), 1);
    } else {
      selectedOptions.push(optionId);
    }

    updatedResponses[currentQuestionIndex] = {
      ...response,
      selectedOptions,
    };
    setUserResponses(updatedResponses);
  };

  const handleCommentChange = (optionId, comment) => {
    const updatedResponses = [...userResponses];
    const response = updatedResponses[currentQuestionIndex] || {};
    updatedResponses[currentQuestionIndex] = {
      ...response,
      optionComments: {
        ...response.optionComments,
        [optionId]: comment,
      },
    };
    setUserResponses(updatedResponses);
  };

  const handleSubmit = async () => {
    const formattedResponses = fetchedData.map((questionData, index) => {
      const selectedOptionIds = userResponses[index]?.selectedOptions || [];
      const selectedOptions = selectedOptionIds.map(optionId => {
        const selectedOption = questionData.options.find(
          option => option._id === optionId
        );
        return selectedOption ? selectedOption.text : "";
      });

      const optionComments = userResponses[index]?.optionComments || {};
      const formattedOptionComments = Object.keys(optionComments).reduce(
        (acc, optionId) => {
          const optionName = questionData.options.find(
            option => option._id === optionId
          )?.text;
          if (optionName) {
            acc[optionName] = optionComments[optionId];
          }
          return acc;
        },
        {}
      );

      return {
        question: questionData.name,
        selectedOptions,
        optionComments: formattedOptionComments,
      };
    });

    const result = [
      ...formattedResponses,
      {
        question: "Onset",
        selectedOptions: [selectedOnset],
        optionComments: {},
      },
    ];

    const dataToSen = JSON.stringify(result, null, 2);

    const dataToSend = {
      chief: {
        result, // Wrap the data under the "chief" field
      },
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/${id}/sess`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Form submitted successfully");
      console.log("PUT Request Response:", response.data);
    } catch (error) {
      console.error("Error sending PUT request:", error.message);
      toast.error("Form submission failed");
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: "20px" }}>
          {showOnsetPopup ? (
            <>
              <Typography variant="h5">Select Onset</Typography>
              <Grid container spacing={2}>
                {onsetOptions.map((option, index) => (
                  <Grid item key={index} xs={12}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedOnset === option}
                          onChange={() => setSelectedOnset(option)}
                        />
                      }
                      label={option}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowOnsetPopup(false)}
                  style={{
                    backgroundColor: "#D67449",
                    color: "white",
                  }}
                >
                  Next
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5">
                {fetchedData[currentQuestionIndex]?.name}
              </Typography>
              <Grid container spacing={2}>
                {fetchedData[currentQuestionIndex]?.options.map(
                  (option, index) => (
                    <Grid item key={`${option._id}-${index}`} xs={12}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={userResponses[
                              currentQuestionIndex
                            ]?.selectedOptions.includes(option._id)}
                            onChange={() => handleOptionChange(option._id)}
                          />
                        }
                        label={option.text}
                      />
                      {userResponses[
                        currentQuestionIndex
                      ]?.selectedOptions.includes(option._id) && (
                        <TextField
                          label="Comment"
                          variant="outlined"
                          value={
                            userResponses[currentQuestionIndex]
                              ?.optionComments?.[option._id] || ""
                          }
                          onChange={e =>
                            handleCommentChange(option._id, e.target.value)
                          }
                          style={{ marginTop: "10px" }}
                          fullWidth
                        />
                      )}
                    </Grid>
                  )
                )}
              </Grid>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePrevQuestion}
                  disabled={isPrevDisabled}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #D67449",
                    color: "white",
                  }}
                >
                  Previous
                </Button>
                {currentQuestionIndex < fetchedData.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextQuestion}
                    style={{ backgroundColor: "#D67449", color: "white" }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    style={{ backgroundColor: "#D67449", color: "white" }}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
      <ToastContainer />
    </>
  );
}

const HistoryOfPresentingIllnessForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // Start with -1 to show onset popup
  const [selectedOptions, setSelectedOptions] = useState({});
  const [personalComments, setPersonalComments] = useState({});
  const [onsetSelection, setOnsetSelection] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch questions from the API
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/illnesses`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions(prevSelectedOptions => {
      const prevSelected = prevSelectedOptions[questionId] || [];
      if (prevSelected.includes(optionId)) {
        // Deselect the option
        return {
          ...prevSelectedOptions,
          [questionId]: prevSelected.filter(id => id !== optionId),
        };
      } else {
        // Select the option
        return {
          ...prevSelectedOptions,
          [questionId]: [...prevSelected, optionId],
        };
      }
    });

    setPersonalComments(prevPersonalComments => ({
      ...prevPersonalComments,
      [optionId]: prevPersonalComments[optionId] || "",
    }));
  };

  const handlePersonalCommentChange = (optionId, comment) => {
    setPersonalComments(prevPersonalComments => ({
      ...prevPersonalComments,
      [optionId]: comment,
    }));
  };

  const handleOnsetSelection = event => {
    setOnsetSelection(event.target.value);
  };

  const handlePopupClose = () => {
    setCurrentQuestionIndex(0); // Move to the first question after closing the popup
  };

  const handleNext = () => {
    if (currentQuestionIndex === -1) {
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0 && onsetSelection === null) {
      setCurrentQuestionIndex(-1); // Go back to onset popup
    } else if (currentQuestionIndex === 0 && onsetSelection !== null) {
      setOnsetSelection(null); // Clear onset selection
      setCurrentQuestionIndex(-1); // Go back to onset popup
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const result = [];
    if (onsetSelection !== null) {
      result.push({
        question: "Onset",
        option: onsetSelection,
        comment: personalComments["onset"] || "",
      });
    }
    questions.forEach(question => {
      const selectedOptionIds = selectedOptions[question._id] || [];
      const comments = selectedOptionIds.map(optionId => ({
        option: question.options.find(option => option._id === optionId).text,
        comment: personalComments[optionId] || "",
      }));
      if (comments.length > 0) {
        result.push({
          question: question.name,
          options: comments,
        });
      } else if (
        question.options.length === 0 &&
        personalComments[question._id]
      ) {
        result.push({
          question: question.name,
          comment: personalComments[question._id],
        });
      }
    });

    try {
      const dataToSen = JSON.stringify(result, null, 2); // JSON.stringify to format the data
      console.log(dataToSen);

      const dataToSend = {
        illness: {
          result, // Wrap the data under the "chief" field
        },
      };
      console.log(dataToSend);

      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/${id}/sess`,
        {
          illness: { result },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Form submitted successfully");
      console.log("PUT Request Response:", response.data);
    } catch (error) {
      console.error("Error sending PUT request:", error.message);
      toast.error("Form submission failed");
    }
  };

  if (currentQuestionIndex === -1) {
    // Show onset popup
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">Onset</Typography>
          <Typography variant="body1">
            Please select the onset type that best describes the illness:
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="onset-options"
              value={onsetSelection || ""}
              onChange={handleOnsetSelection}
            >
              <FormControlLabel
                value="Acute"
                control={<Radio />}
                label="Acute (Sudden)"
              />
              <FormControlLabel
                value="Abrupt"
                control={<Radio />}
                label="Abrupt (Few hours to few days)"
              />
              <FormControlLabel
                value="Sub-acute"
                control={<Radio />}
                label="Sub-acute (Few days to few weeks)"
              />
              <FormControlLabel
                value="Insidious"
                control={<Radio />}
                label="Insidious (Few weeks to few months)"
              />
            </RadioGroup>
          </FormControl>
          <Button
            disabled={onsetSelection === null}
            onClick={handlePopupClose}
            style={{
              backgroundColor: "#D67449",
              color: "white",
            }}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>No more questions.</div>;
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5">{currentQuestion.name}</Typography>
          {currentQuestion.options.length === 0 ? (
            <TextField
              label="Comment"
              multiline
              rows={3}
              fullWidth
              value={personalComments[currentQuestion._id] || ""}
              onChange={event =>
                handlePersonalCommentChange(
                  currentQuestion._id,
                  event.target.value
                )
              }
              variant="outlined"
              margin="dense"
            />
          ) : (
            <form>
              {currentQuestion.options.map(option => (
                <div key={option._id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedOptions[currentQuestion._id]?.includes(
                            option._id
                          ) || false
                        }
                        onChange={() =>
                          handleOptionChange(currentQuestion._id, option._id)
                        }
                      />
                    }
                    label={option.text}
                  />
                  {selectedOptions[currentQuestion._id]?.includes(
                    option._id
                  ) && (
                    <TextField
                      label={`Personal Comment for ${option.text}`}
                      multiline
                      rows={2}
                      fullWidth
                      value={personalComments[option._id] || ""}
                      onChange={event =>
                        handlePersonalCommentChange(
                          option._id,
                          event.target.value
                        )
                      }
                      variant="outlined"
                      margin="dense"
                    />
                  )}
                </div>
              ))}
            </form>
          )}
          <Button
            disabled={currentQuestionIndex === 0 && onsetSelection === null}
            onClick={handlePrevious}
            style={{
              backgroundColor: "white",
              border: "1px solid #D67449",
              color: "white",
              marginRight: "1rem",
            }}
          >
            Previous
          </Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#D67449",
                color: "white",
              }}
            >
              Submit
            </Button>
          ) : (
            <Button
              disabled={
                currentQuestion.options.length > 0 &&
                !selectedOptions[currentQuestion._id]?.length
              }
              onClick={handleNext}
              style={{
                backgroundColor: "#D67449",
                color: "white",
              }}
            >
              Next
            </Button>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
};

function FirstSessionNotes() {
  const [activeForm, setActiveForm] = useState("");

  const openForm = formName => {
    setActiveForm(formName);
  };

  const renderForm = () => {
    if (activeForm === "sociodemographic") {
      return <SociodemographicForm />;
    } else if (activeForm === "chiefComplaints") {
      return <ChiefComplaintsForm />;
    } else if (activeForm === "historyOfPresentingIllness") {
      return <HistoryOfPresentingIllnessForm />;
    }

    return null;
  };

  return (
    <div>
      <h2>First Session Notes</h2>
      <div className="button-container">
        <button
          onClick={() => openForm("sociodemographic")}
          className={
            activeForm === "sociodemographic"
              ? "active-session-button"
              : "session-button"
          }
        >
          Sociodemographic Details
        </button>
        <button
          onClick={() => openForm("chiefComplaints")}
          className={
            activeForm === "chiefComplaints"
              ? "active-session-button"
              : "session-button"
          }
        >
          Chief Complaints
        </button>
        <button
          onClick={() => openForm("historyOfPresentingIllness")}
          className={
            activeForm === "historyOfPresentingIllness"
              ? "active-session-button"
              : "session-button"
          }
        >
          History of Presenting Illness
        </button>
      </div>
      {renderForm()}
    </div>
  );
}

export default FirstSessionNotes;
