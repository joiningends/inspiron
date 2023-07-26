import React, { useState } from "react";
import "./FirstSessionNotes.css";

function SociodemographicForm() {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [pronouns, setPronouns] = useState("");
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
  const handleFormSubmit = e => {
    e.preventDefault();

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
    setFullName("");
    setAge("");
    setGender("");
    setPronouns("");
    setHeight("");
    setWeight("");
    setAddress("");
    setContactDetails("");
    setEmergencyContactName("");
    setEmergencyContactNumber("");
    setEducation("");
    setOccupation("");
    setSocioeconomicStatus("");
    setInformantName("");
    setRelationshipWithPatient("");
    setDurationOfStay("");
    setInformation("");
    setReligionEthnicity("");
    setDateOfBirth("");
    setLanguagesKnown([]);
    setMaritalStatus("");
    setReference("");
  };

  return (
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
      <button type="submit">Submit</button>
    </form>
  );
}

function ChiefComplaintsForm() {
  const [step, setStep] = useState(1);
  const [onset, setOnset] = useState("");

  const handleOnsetChange = event => {
    setOnset(event.target.value);
  };

  const [formData, setFormData] = useState({
    question1: { selectedOptions: [], comments: {} },
    question2: { selectedOptions: [], comments: {} },
    question3: { selectedOptions: [], comments: {} },
    question4: { selectedOptions: [], comments: {} },
    question5: { selectedOptions: [], comments: {} },
    question6: { selectedOptions: [], comments: {} },
    question7: { selectedOptions: [], comments: {} },
    question8: { selectedOptions: [], comments: {} },
    question9: { selectedOptions: [], comments: {} },
    question10: { selectedOptions: [], comments: {} },
    question11: { selectedOptions: [], comments: {} },
    question12: { selectedOptions: [], comments: {} },
    question13: { selectedOptions: [], comments: {} },
  });

  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleOptionChange = (question, selectedOptions) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [question]: {
        ...prevFormData[question],
        selectedOptions,
      },
    }));
  };

  const handleCommentChange = (question, optionId, comment) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [question]: {
        ...prevFormData[question],
        comments: {
          ...prevFormData[question].comments,
          [optionId]: comment,
        },
      },
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Create JSON object from form data
    const json = {
      onset,
      ...formData,
    };

    // Modify the JSON object to include question text for selected options
    const modifiedJson = Object.entries(json).reduce((acc, [key, value]) => {
      if (key.startsWith("question")) {
        const question = questions.find(q => q.id === key);
        if (Array.isArray(value.selectedOptions)) {
          const selectedOptionsWithText = value.selectedOptions.map(
            optionId => {
              const option = question.options.find(o => o.id === optionId);
              return {
                id: option.id,
                label: option.label,
                comment: value.comments[option.id],
              };
            }
          );
          acc[question.questionText] = selectedOptionsWithText;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log("Form JSON:", modifiedJson);
    // Reset the form
    setOnset("");
    setFormData({
      question1: { selectedOptions: [], comments: {} },
      question2: { selectedOptions: [], comments: {} },
      question3: { selectedOptions: [], comments: {} },
      question4: { selectedOptions: [], comments: {} },
      question5: { selectedOptions: [], comments: {} },
      question6: { selectedOptions: [], comments: {} },
      question7: { selectedOptions: [], comments: {} },
      question8: { selectedOptions: [], comments: {} },
      question9: { selectedOptions: [], comments: {} },
      question10: { selectedOptions: [], comments: {} },
      question11: { selectedOptions: [], comments: {} },
      question12: { selectedOptions: [], comments: {} },
      question13: { selectedOptions: [], comments: {} },
    });
  };

  // Define the questions and options
  const questions = [
    {
      id: "question1",
      questionText: "1. Depressive symptoms",
      options: [
        { id: "option1", label: "Sadness" },
        { id: "option2", label: "Tearfulness/ Crying spells" },
        { id: "option3", label: "Low levels of Energy/Tiredness/exhaustion" },
        { id: "option4", label: "Disturbed concentration" },
        {
          id: "option5",
          label:
            "Sexual Function- low levels of libido/ withdrawal/ lack of interest",
        },
        { id: "option6", label: "Guilt" },
        { id: "option7", label: "Psychomotor agitation/ Restlessness" },
        { id: "option8", label: "Decreased increased in activities" },
        { id: "option9", label: "Low motivation" },
        { id: "option10", label: "Helplessness" },
        { id: "option11", label: "Hopelessness" },
        { id: "option12", label: "Poor confidence" },
        { id: "option13", label: "Poor Self-esteem" },
        { id: "option14", label: "Irritability" },
        { id: "option15", label: "Social Withdrawal" },
      ],
    },
    {
      id: "question2",
      questionText: "2. Mania",
      options: [
        { id: "option1", label: "Impulsivity" },
        { id: "option2", label: "Grandiosity" },
        { id: "option3", label: "Recklessness" },
        { id: "option4", label: "Excessive energy" },
        { id: "option5", label: "Increased spending beyond means" },
        { id: "option6", label: "Talkativeness" },
        { id: "option7", label: "Racing thoughts" },
        { id: "option8", label: "Hyper-sexuality" },
        { id: "option9", label: "Wandering behavior" },
      ],
    },
    {
      id: "question3",
      questionText: "3. Anxiety",
      options: [
        { id: "option1", label: "Racing heartbeat" },
        { id: "option2", label: "Sweating" },
        { id: "option3", label: "Shortness of breath" },
        { id: "option4", label: "Sense of doom" },
        { id: "option5", label: "Increased startle response" },
        { id: "option6", label: "GI discomfort" },
        { id: "option7", label: "Dizziness" },
        { id: "option8", label: "Numbness" },
        { id: "option9", label: "Tingling sensations" },
        {
          id: "option10",
          label:
            "Oversensitivity to topics and events related to death and sickness",
        },
      ],
    },
    {
      id: "question4",
      questionText: "4. OCD symptoms",
      options: [
        { id: "option1", label: "Checking" },
        { id: "option2", label: "Cleaning" },
        { id: "option3", label: "Organising behavior" },
        { id: "option4", label: "Slowness in activities" },
        { id: "option5", label: "Repetitive thinking and actions" },
      ],
    },
    {
      id: "question5",
      questionText: "5. Physical symptoms",
      options: [
        { id: "option1", label: "Multiple physical complaints" },
        { id: "option2", label: "Excessive health concerns" },
        {
          id: "option3",
          label: "Multiple consultations with health professionals",
        },
        { id: "option4", label: "Multiple investigations" },
        { id: "option5", label: "Headache" },
      ],
    },
    {
      id: "question6",
      questionText: "6. Psychosis symptoms",
      options: [
        { id: "option1", label: "Suspiciousness" },
        { id: "option2", label: "Difficulty in trusting people" },
        { id: "option3", label: "Fearfulness" },
        { id: "option4", label: "Angry and assaultive behavior" },
        { id: "option5", label: "Irritability" },
        { id: "option6", label: "Talking or laughing to self" },
        { id: "option7", label: "Hearing voices" },
        { id: "option8", label: "Seeing things that are not there" },
        { id: "option9", label: "Asocial behavior" },
        { id: "option10", label: "Minimal talk" },
        { id: "option11", label: "Indecisive behavior" },
      ],
    },
    {
      id: "question7",
      questionText: "7. Personality traits",
      options: [
        { id: "option1", label: "Lying" },
        { id: "option2", label: "Stealing" },
        { id: "option3", label: "Addictions" },
        { id: "option4", label: "Intolerance to criticism" },
        { id: "option5", label: "Manipulative behavior" },
        { id: "option6", label: "Threatening behavior" },
        { id: "option7", label: "Denial" },
        { id: "option8", label: "Blaming others" },
        { id: "option9", label: "Victimization/ Self-loathing" },
        { id: "option10", label: "Self-esteem: Poor/ High" },
        { id: "option11", label: "Grandiosity" },
        { id: "option12", label: "Self-harm" },
        { id: "option13", label: "Dramatic behavior" },
        { id: "option14", label: "Attention seeking" },
        { id: "option15", label: "Lack of empathy" },
        { id: "option16", label: "Impulsive" },
        { id: "option17", label: "Anger outbursts" },
        { id: "option18", label: "Unstable emotional response" },
      ],
    },
    {
      id: "question8",
      questionText: "8. Deliberate self-harm",
      options: [
        { id: "option1", label: "Deliberately harming self" },
        { id: "option2", label: "Suicidal ideation and attempts" },
      ],
    },
    {
      id: "question9",
      questionText: "9. Appetite",
      options: [
        { id: "option1", label: "Increased" },
        { id: "option2", label: "Decreased: Skipping meals/reduced quantity" },
        { id: "option3", label: "Binge eating" },
      ],
    },
    {
      id: "question10",
      questionText: "10. Sleep",
      options: [
        { id: "option1", label: "Increased- more than 8 hours" },
        { id: "option2", label: "Decreased- less than 7 hours" },
        { id: "option3", label: "Difficulty in falling asleep" },
        { id: "option4", label: "Nightmares or bad dreams" },
        { id: "option5", label: "Early morning awakening" },
      ],
    },
    {
      id: "question11",
      questionText: "11. Sexual dysfunction",
      options: [
        { id: "option1", label: "Discharge" },
        { id: "option2", label: "Pain" },
        { id: "option3", label: "Preoccupation/ Obsession" },
        { id: "option4", label: "Erectile Dysfunction" },
        { id: "option5", label: "Low levels of libido" },
      ],
    },
    {
      id: "question12",
      questionText: "12. Headaches/pains",
      options: [
        { id: "option1", label: "Onset: acute or chronic" },
        { id: "option2", label: "Intolerance to sound and light" },
        { id: "option3", label: "Associated with vomiting and giddiness" },
        { id: "option4", label: "Fever" },
        { id: "option5", label: "Radiating to other parts of the body" },
        { id: "option6", label: "Episodic or continuous" },
      ],
    },
    {
      id: "question13",
      questionText: "13. Cognitive functions",
      options: [
        { id: "option1", label: "Poor Concentration" },
        {
          id: "option2",
          label: "Difficulty making decisions or solving problems",
        },
        { id: "option3", label: "Forgetfulness" },
        { id: "option4", label: "Confused" },
        { id: "option5", label: "Brain fog" },
      ],
    },
  ];

  return (
    <form
      className="multi-step-form"
      style={{
        marginTop: "3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {step <= questions.length + 1 && (
        <>
          {step === 1 && (
            <>
              <h3>Onset: (single choice) - mandatory</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="onset"
                      value="Acute (Sudden)"
                      checked={onset === "Acute (Sudden)"}
                      onChange={handleOnsetChange}
                      required
                    />
                    Acute (Sudden)
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="onset"
                      value="Abrupt (Few hours to few days)"
                      checked={onset === "Abrupt (Few hours to few days)"}
                      onChange={handleOnsetChange}
                    />
                    Abrupt (Few hours to few days)
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="onset"
                      value="Sub-acute (Few days to few weeks)"
                      checked={onset === "Sub-acute (Few days to few weeks)"}
                      onChange={handleOnsetChange}
                    />
                    Sub-acute (Few days to few weeks)
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="onset"
                      value="Insidious (Few weeks to few months)"
                      checked={onset === "Insidious (Few weeks to few months)"}
                      onChange={handleOnsetChange}
                    />
                    Insidious (Few weeks to few months)
                  </label>
                </li>
              </ul>
              <div className="button-container">
                <button type="button" onClick={handleNextStep}>
                  Next
                </button>
              </div>
            </>
          )}
          {step > 1 && (
            <>
              <h3>{questions[step - 2].questionText}</h3>
              <ul
                className="options-container"
                style={{ listStyle: "none", padding: 0 }}
              >
                {questions[step - 2].options.map(option => (
                  <li key={option.id} style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        value={option.id}
                        checked={formData[
                          `question${step - 1}`
                        ].selectedOptions.includes(option.id)}
                        onChange={e => {
                          const selectedOptions = e.target.checked
                            ? [
                                ...formData[`question${step - 1}`]
                                  .selectedOptions,
                                e.target.value,
                              ]
                            : formData[
                                `question${step - 1}`
                              ].selectedOptions.filter(
                                optionId => optionId !== e.target.value
                              );
                          handleOptionChange(
                            `question${step - 1}`,
                            selectedOptions
                          );
                        }}
                      />
                      {option.label}
                    </label>
                    {formData[`question${step - 1}`].selectedOptions.includes(
                      option.id
                    ) && (
                      <textarea
                        value={
                          formData[`question${step - 1}`].comments[option.id] ||
                          ""
                        }
                        onChange={e =>
                          handleCommentChange(
                            `question${step - 1}`,
                            option.id,
                            e.target.value
                          )
                        }
                        placeholder="Enter comment"
                      />
                    )}
                  </li>
                ))}
              </ul>
              <div className="button-container">
                {step > 2 && (
                  <button type="button" onClick={handlePrevStep}>
                    Previous
                  </button>
                )}
                {step < questions.length + 1 ? (
                  <button type="button" onClick={handleNextStep}>
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="submit-button"
                  >
                    Submit
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </form>
  );
}

function HistoryOfPresentingIllnessForm() {
  // Form logic and state for History of Presenting Illness form
  const [step, setStep] = useState(1);
  const [onset, setOnset] = useState("");

  const handleOnsetChange = event => {
    setOnset(event.target.value);
  };

  const [formData, setFormData] = useState({
    question1: { selectedOptions: [], comments: {} },
    question2: { selectedOptions: [], comments: {} },
    question3: { comment: "" },
    question4: { comment: "" },
    question5: { comment: "" },
    question6: { comment: "" },
    question7: { comment: "" },
    question8: { comment: "" },
  });

  const handleNextStep = () => {
    if (step < questions.length) {
      if (
        step <= 3 ||
        (step > 3 && formData[`question${step}`]?.comment !== undefined)
      ) {
        setStep(prevStep => prevStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleMultiSelectOptionChange = (question, selectedOptions) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [question]: {
        ...prevFormData[question],
        selectedOptions: [...selectedOptions],
      },
    }));
  };

  const handleCommentChange = (question, optionId, comment) => {
    setFormData(prevFormData => {
      let updatedFormData = { ...prevFormData };

      if (
        question === "question1" ||
        question === "question4" ||
        question === "question5" ||
        question === "question6"
      ) {
        updatedFormData[question].comment = comment;
      } else if (question === "question2" || question === "question3") {
        const updatedComments = {
          ...updatedFormData[question].comments,
          [optionId]: {
            ...updatedFormData[question].comments?.[optionId],
            comment: comment,
          },
        };

        updatedFormData[question] = {
          ...updatedFormData[question],
          comments: updatedComments,
        };
      }

      return updatedFormData;
    });
  };

  const handleCommentChangeQ1 = comment => {
    setFormData(prevFormData => ({
      ...prevFormData,
      question1: {
        ...prevFormData.question1,
        comment: comment,
      },
    }));
  };

  const handleCommentChangeQ4 = comment => {
    setFormData(prevFormData => ({
      ...prevFormData,
      question4: {
        ...prevFormData.question4,
        comment: comment,
      },
    }));
  };

  const handleCommentChangeQ5 = comment => {
    setFormData(prevFormData => ({
      ...prevFormData,
      question5: {
        ...prevFormData.question5,
        comment: comment,
      },
    }));
  };

  const handleCommentChangeQ6 = comment => {
    setFormData(prevFormData => ({
      ...prevFormData,
      question6: {
        ...prevFormData.question6,
        comment: comment,
      },
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const currentQuestion = questions[step - 2];
    const questionText = currentQuestion.questionText;

    // Create JSON object from form data
    const json = {
      onset,
      questionText,
      ...formData,
    };

    console.log("Form JSON:", json);

    // Reset the form
    setOnset("");
    setFormData({
      question1: { selectedOptions: [], comments: {} },
      question2: { selectedOptions: [], comments: {} },
      question3: { comment: "" },
      question4: { comment: "" },
      question5: { comment: "" },
      question6: { comment: "" },
      question7: { comment: "" },
      question8: { comment: "" },
    });
  };

  const questions = [
    {
      id: "question1",
      questionText: "Genetic & Family history of mental health conditions",
      options: [],
    },
    {
      id: "question2",
      questionText: "Childhood & Adolescents",
      options: [
        "Exposure to Death or loss",
        "Financial difficulties",
        "Bullying",
        "Academics",
        "Learning difficulty",
        "Poor concentration",
        "Physical, verbal, sexual abuse",
        "Domestic violence",
        "Witnessing violence",
        "Separation",
        "Neglect",
        "Natural catastrophe",
        "Accident",
        "War",
        "Terrorism",
        "Discrimination- religion, ethnicity, racism, body shaming",
        "Exposure to substance use",
        "Unhealthy relationships",
        "Pandemic",
      ],
    },
    {
      id: "question3",
      questionText: "Adulthood",
      options: [
        "Increased responsibilities",
        "Financial difficulties",
        "Poor job satisfaction",
        "Marriage & relationship",
        "Fertility & pregnancy",
        "Body image issues",
        "Poor career choice",
        "Work-life balance",
        "Abuse – physical, verbal, emotional, sexual",
        "Marital rape",
        "Lack of employment",
        "Concerns with attachment or finding a suitable partner",
        "Death or loss",
      ],
    },
    {
      id: "question4",
      questionText: "Geriatric",
      options: [],
    },
    {
      id: "question5",
      questionText: "Physical illness",
      options: [],
    },
    {
      id: "question6",
      questionText: "Psychological illness",
      options: [],
    },
  ];

  return (
    <form
      className="multi-step-form"
      onSubmit={handleSubmit}
      style={{ marginTop: "3rem" }}
    >
      {step > 1 && (
        <>
          <h3>{questions[step - 2].questionText}</h3>
          {questions[step - 2].options.length > 0 ? (
            <ul className="options-container">
              {/* Options for multi-select questions */}
              {questions[step - 2].options.map(option => (
                <li key={option}>
                  <label>
                    <input
                      type="checkbox"
                      value={option}
                      checked={
                        formData[
                          questions[step - 2].id
                        ]?.selectedOptions?.includes(option) || false
                      }
                      onChange={e => {
                        const selectedOptions = e.target.checked
                          ? [
                              ...(formData[questions[step - 2].id]
                                ?.selectedOptions || []),
                              e.target.value,
                            ]
                          : formData[
                              questions[step - 2].id
                            ]?.selectedOptions?.filter(
                              selectedOption =>
                                selectedOption !== e.target.value
                            );
                        handleMultiSelectOptionChange(
                          questions[step - 2].id,
                          selectedOptions
                        );
                      }}
                    />
                    {option}
                  </label>
                  {formData[questions[step - 2].id]?.selectedOptions?.includes(
                    option
                  ) && (
                    <textarea
                      value={
                        formData[questions[step - 2].id]?.comments?.[option]
                          ?.comment || ""
                      }
                      onChange={e =>
                        handleCommentChange(
                          questions[step - 2].id,
                          option,
                          e.target.value
                        )
                      }
                      placeholder="Enter comment"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <textarea
              value={formData[questions[step - 2].id]?.comment || ""}
              onChange={e =>
                handleCommentChange(
                  questions[step - 2].id,
                  null,
                  e.target.value
                )
              }
              placeholder="Enter comment"
            />
          )}

          <div className="button-container">
            {step > 1 && (
              <button type="button" onClick={handlePrevStep}>
                Previous
              </button>
            )}
            {step < questions.length && (
              <button type="button" onClick={handleNextStep}>
                Next
              </button>
            )}
            {step === questions.length && (
              <button type="submit" className="submit-button">
                Submit
              </button>
            )}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h3>Onset:</h3>
          <ul>
            <li>
              <label>
                <input
                  type="radio"
                  name="onset"
                  value="Acute (Sudden)"
                  checked={onset === "Acute (Sudden)"}
                  onChange={handleOnsetChange}
                />
                Acute (Sudden)
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="onset"
                  value="Abrupt (Few hours to few days)"
                  checked={onset === "Abrupt (Few hours to few days)"}
                  onChange={handleOnsetChange}
                />
                Abrupt (Few hours to few days)
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="onset"
                  value="Sub-acute (Few days to few weeks)"
                  checked={onset === "Sub-acute (Few days to few weeks)"}
                  onChange={handleOnsetChange}
                />
                Sub-acute (Few days to few weeks)
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="onset"
                  value="Insidious (Few weeks to few months)"
                  checked={onset === "Insidious (Few weeks to few months)"}
                  onChange={handleOnsetChange}
                />
                Insidious (Few weeks to few months)
              </label>
            </li>
          </ul>
          <div className="button-container">
            {step < questions.length + 1 && (
              <button type="button" onClick={handleNextStep}>
                Next
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
}

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
