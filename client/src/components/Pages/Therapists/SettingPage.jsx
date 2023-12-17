import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Divider,
  tableRowClasses,
} from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import DetailsIcon from "@mui/icons-material/Details";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import Footer from "../Footer";
import "./SettingPage.css";

function SettingPage() {
  const [centerName, setCenterName] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [centerCity, setCenterCity] = useState("");
  const [centerPinCode, setCenterPinCode] = useState("");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(
    sessionInfo?.categories[0]?.sessionDuration
  );
  const [sessionDurationPsych, setSessionDurationPsych] = useState(
    sessionInfo?.categories[1]?.sessionDuration
  );
  const [sessionCoolOffTime, setSessionCoolOffTime] = useState(
    sessionInfo?.categories[0]?.timeBetweenSessions
  );
  const [sessionCoolOffTimePsych, setSessionCoolOffTimePsych] = useState(
    sessionInfo?.categories[1]?.timeBetweenSessions
  );
  const [isCenterEditing, setIsCenterEditing] = useState(false);
  const [isSessionEditing, setIsSessionEditing] = useState(false);
  const [isSessionEditingPsych, setIsSessionEditingPsych] = useState(false);
  const [isExperienceEditing, setIsExperienceEditing] = useState(false);
  const [isExperienceFormVisible, setIsExperienceFormVisible] = useState(false);
  const [centers, setCenters] = useState([]);
  const [experienceLevelName, setExperienceLevelName] = useState("");
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [experienceFormData, setExperienceFormData] = useState({
    sessionNumber: "",
    sessionPrice: "",
    discountSessionPrice: "",
  });

  console.log(sessionInfo);
  console.log(experienceLevels);

  const [experienceTableData, setExperienceTableData] = useState([]);
  const [detailsIndex, setDetailsIndex] = useState(null);
  const [selectedExperienceDetails, setSelectedExperienceDetails] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expertise, setExpertise] = useState("");
  const [expertiseList, setExpertiseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [medicineListFile, setMedicineListFile] = useState(null);
  const [labTestListFile, setLabTestListFile] = useState(null);

  const [medicineList, setMedicineList] = useState([]);
  // State to control the visibility of the popup dialog
  const [openDialog, setOpenDialog] = useState(false);

  const [labTestList, setLabTestList] = useState([]);
  // State to control the visibility of the lab test list popup dialog
  const [openLabTestDialog, setOpenLabTestDialog] = useState(false);

  // Function to handle the "View Lab Test List" button click
  const viewLabTestList = async () => {
    try {
      // Fetch data from the lab tests API
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/labtests`
      );
      // Set the fetched data to the state
      setLabTestList(response.data);
      // Open the lab test list popup dialog
      setOpenLabTestDialog(true);
    } catch (error) {
      console.error("Error fetching lab test list:", error);
    }
  };

  // Function to close the lab test list popup dialog
  const handleCloseLabTestDialog = () => {
    setOpenLabTestDialog(false);
  };

  // Function to handle the "View Medicine List" button click
  const viewMedicineList = async () => {
    try {
      // Fetch data from the API
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/medicence`
      );
      // Set the fetched data to the state
      setMedicineList(response.data);
      // Open the popup dialog
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching medicine list:", error);
    }
  };

  // Function to close the popup dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleMedicineListUpload = async e => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      // Create a new FormData object
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Make a POST request to your backend API endpoint for uploading medicine lists
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/medicence`,
          formData
        );

        if (response.status === 201) {
          // Handle a successful response, e.g., show a success message
          alert("Medicine List uploaded successfully");
        } else {
          // Handle other response statuses, e.g., display an error message
          alert("Error uploading Medicine List");
        }

        console.log(response);
      } catch (error) {
        // Handle any errors, e.g., display an error message
        console.error("Error uploading Medicine List:", error);
        alert("Error uploading Medicine List");
      }
    }
  };

  const handleLabTestListUpload = async e => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      // Create a new FormData object
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Make a POST request to your backend API endpoint for uploading medicine lists
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/labtests`,
          formData
        );

        if (response.status === 201) {
          // Handle a successful response, e.g., show a success message
          alert("Lab test List uploaded successfully");
        } else {
          // Handle other response statuses, e.g., display an error message
          alert("Error uploading Medicine List");
        }

        console.log(response);
      } catch (error) {
        // Handle any errors, e.g., display an error message
        console.error("Error uploading Medicine List:", error);
        alert("Error uploading Medicine List");
      }
    }
  };

  const handleEditChiefNote = () => {
    // Add your logic for editing Chief-First Session Note here
    const editChiefNoteUrl = "/edit_add-questions";

    // Open a new window or tab with the specified URL
    window.open(editChiefNoteUrl, "_blank");
  };

  const handleEditIllnessNote = () => {
    // Add your logic for editing Illness-First Session Note here
    const editChiefNoteUrl = "/edit_add-question01";

    // Open a new window or tab with the specified URL
    window.open(editChiefNoteUrl, "_blank");
  };

  useEffect(() => {
    // Fetch data from the API
    fetch(`${process.env.REACT_APP_SERVER_URL}/expetises`)
      .then(response => response.json())
      .then(data => {
        // Extract "type" values from the API response and update the state
        const types = data.map(item => ({
          id: item._id,
          type: item.type[0],
        }));
        setExpertiseList(types);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array ensures the API call runs only once

  const handleExpertiseChange = e => {
    setExpertise(e.target.value);
  };

  const handleAddExpertise = () => {
    if (expertise.trim() !== "") {
      // Prepare the data for the POST request
      const postData = {
        type: [expertise],
      };

      // Make the POST request to add expertise
      fetch(`${process.env.REACT_APP_SERVER_URL}/expetises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then(response => response.json())
        .then(data => {
          // Update the expertise list with the newly added item
          setExpertiseList([
            ...expertiseList,
            { id: data._id, type: data.type[0] },
          ]);
          setExpertise("");
        })
        .catch(error => {
          console.error("Error adding expertise:", error);
        });
    }
  };

  const handleRemoveExpertise = id => {
    // Make the DELETE request to remove expertise
    fetch(`${process.env.REACT_APP_SERVER_URL}/expetises/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Update the expertise list by filtering out the deleted item
        const updatedList = expertiseList.filter(item => item.id !== id);
        setExpertiseList(updatedList);
      })
      .catch(error => {
        console.error("Error deleting expertise:", error);
      });
  };

  useEffect(() => {
    // Make the API request when the component mounts
    fetch(`${process.env.REACT_APP_SERVER_URL}/categories/session/info`)
      .then(response => response.json())
      .then(data => {
        // Update state with the fetched data and set loading to false
        setSessionInfo(data);
        setSessionDuration(data?.categories[0]?.sessionDuration);
        setSessionCoolOffTime(data?.categories[0]?.timeBetweenSessions);
        setSessionCoolOffTimePsych(data?.categories[1]?.timeBetweenSessions);
        setSessionDurationPsych(data?.categories[1]?.sessionDuration);
        setLoading(false);
        setError(null);
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch and update error state
        setSessionInfo(null);
        setLoading(false);
        setError(error.message);
      });
  }, []);

  console.log(selectedExperienceDetails);

  const [selectedExperienceLevelId, setSelectedExperienceLevelId] =
    useState(""); // Define the selectedExperienceLevelId variable
  const handleEditCenterClick = index => {
    setIsCenterEditing(true);
    const center = centers[index];
    setCenterName(center.centerName);
    setCenterAddress(center.centerAddress);
    setContactNo(center.contactNo);
    setCenterCity(center.centerCity);
    setCenterPinCode(center.centerPinCode);
  };

  const handleDetailsClick = async (index, id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/prices/${id}`
      );
      setSelectedExperienceDetails(response.data);
      console.log(response.data);
      setDetailsIndex(index);
    } catch (error) {
      console.error("Error fetching experience level details:", error);
    }
  };

  console.log(experienceLevels);

  const handleCreateCenterClick = async () => {
    const newCenter = {
      centerName,
      centerAddress,
      contactNo,
      city: centerCity,
      pin: centerPinCode,
    };

    console.log(newCenter);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCenter),
        }
      );

      if (response.ok) {
        // Handle successful response
        console.log("Center created successfully!");

        // Update the local state with the new center
        setCenters([...centers, newCenter]);

        // Clear the input fields and exit editing mode
        setCenterName("");
        setCenterAddress("");
        setContactNo("");
        setCenterCity("");
        setCenterPinCode("");
        setIsCenterEditing(false);
      } else {
        // Handle error response
        console.error("Error creating center");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  useEffect(() => {
    async function fetchCenters() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/categories/center/info`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setCenters(data?.categories);
        } else {
          console.error("Failed to fetch centers data");
        }
      } catch (error) {
        console.error("An error occurred while fetching centers data:", error);
      }
    }

    fetchCenters();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  const handleCancelCenterClick = () => {
    setIsCenterEditing(false);
    setCenterName("");
    setCenterAddress("");
    setContactNo("");
    setCenterCity("");
    setCenterPinCode("");
  };

  const handleRemoveCenterClick = async index => {
    try {
      // Assuming centers is an array of objects and each object has a unique _id
      const centerToRemove = centers[index];

      // Send a DELETE request to the API with the _id of the center to be removed
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/categories/${centerToRemove._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // Set the appropriate content type
            // You may need to include any authentication headers if required by your API
          },
        }
      );

      if (response.ok) {
        // If the DELETE request is successful, update the state to remove the center
        const newCenters = centers.filter((_, i) => i !== index);
        setCenters(newCenters);
      } else {
        // Handle errors if the DELETE request fails
        console.error("Failed to remove center");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const validateContactNo = value => /^\d{10}$/.test(value);
  const validatePinCode = value => /^\d+$/.test(value);

  const handleEditSessionClick = () => {
    setIsSessionEditing(true);
  };

  const handleEditSessionClickPsych = () => {
    setIsSessionEditingPsych(true);
  };

  const handleSaveSessionClick = async id => {
    // const updateData = async () => {
    //   try {
    //     const response = await axios.put('${process.env.REACT_APP_SERVER_URL}/categories/session/info', dataToUpdate);
    //     console.log('PUT request successful:', response.data);
    //     // Handle success or perform any necessary actions here
    //   } catch (error) {
    //     console.error('Error making PUT request:', error);
    //     // Handle error or display an error message here
    //   }
    // };

    const sessionSettingsData = {
      sessionDuration,
      timeBetweenSessions: sessionCoolOffTime,
      extendsession: 30,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/categories/update-session/64edce0080fb2f1db3822f15`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionSettingsData),
        }
      );

      if (response.ok) {
        // Handle successful response
        console.log("Session settings saved successfully!");
      } else {
        // Handle error response
        console.error("Error saving session settings");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const handleSaveSessionClickPsych = async id => {
    // const updateData = async () => {
    //   try {
    //     const response = await axios.put('${process.env.REACT_APP_SERVER_URL}/categories/session/info', dataToUpdate);
    //     console.log('PUT request successful:', response.data);
    //     // Handle success or perform any necessary actions here
    //   } catch (error) {
    //     console.error('Error making PUT request:', error);
    //     // Handle error or display an error message here
    //   }
    // };

    const sessionSettingsData = {
      sessionDurationPsych,
      timeBetweenSessions: sessionCoolOffTimePsych,
      extendsession: 30,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/categories/update-session/65742d64c3d4e5e731131b2a`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionSettingsData),
        }
      );

      if (response.ok) {
        // Handle successful response
        console.log("Session settings saved successfully!");
      } else {
        // Handle error response
        console.error("Error saving session settings");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const handleCancelSessionClick = () => {
    setIsSessionEditing(false);
  };

  const handleCancelSessionClickPsych = () => {
    setIsSessionEditingPsych(false);
  };

  const handleExperienceFormSubmit = async e => {
    e.preventDefault();
    if (
      experienceFormData.sessionNumber &&
      experienceFormData.sessionPrice &&
      experienceFormData.discountSessionPrice
    ) {
      setIsExperienceFormVisible(false);
      const newExperienceEntry = {
        sessionNumber: experienceFormData.sessionNumber,
        sessionPrice: experienceFormData.sessionPrice,
        discountSessionPrice: experienceFormData.discountSessionPrice,
      };

      try {
        // Send a POST request to the API
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/prices`,
          {
            expriencelevel: selectedExperienceLevelId,
            session: newExperienceEntry.sessionNumber,
            sessionPrice: newExperienceEntry.sessionPrice,
            discountPrice: newExperienceEntry.discountSessionPrice,
          }
        );
        console.log(selectedExperienceLevelId);
        // Handle the response, e.g., update the UI or show a success message
        console.log("POST request successful:", response.data);
        // Update the experience table data
        setExperienceTableData([...experienceTableData, newExperienceEntry]);
      } catch (error) {
        // Handle errors, e.g., show an error message
        console.error("POST request failed:", error);
      }
    }
  };

  const handleRemoveExperienceLevel = async (index, experienceId) => {
    try {
      // Make an HTTP DELETE request to the API endpoint
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/expriences/${experienceId}`
      );

      // If the request is successful, remove the experience level from the state
      const newExperienceLevels = experienceLevels.filter(
        (_, i) => i !== index
      );
      setExperienceLevels(newExperienceLevels);
      window.location.reload();
    } catch (error) {
      // Handle errors here, e.g., show an error message to the user
      console.error("Error removing experience level:", error);
    }
  };

  const handleRemoveExperienceLevelDetail = index => {
    const newExperienceTableData = experienceTableData.filter(
      (_, i) => i !== index
    );
    setExperienceTableData(newExperienceTableData);
  };

  const handleEditExperienceLevel = (index, experienceLevelId) => {
    setSelectedExperienceLevelId(experienceLevelId);
    console.log(experienceLevelId);
    console.log("hello");
    setIsExperienceEditing(true);
    setIsExperienceFormVisible(true); // Add this line
    setExperienceFormData({
      sessionNumber: "",
      sessionPrice: "",
      discountSessionPrice: "",
    });
  };

  const handleAddExperienceLevel = async () => {
    if (experienceLevelName.trim() !== "") {
      setExperienceLevels([...experienceLevels, experienceLevelName]);
      setExperienceLevelName("");

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/expriences`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              level: experienceLevelName.trim(),
            }),
          }
        );

        if (response.ok) {
          console.log("Experience level added successfully");
          window.location.reload();
        } else {
          console.error("Failed to add experience level");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch experience levels from the API
    fetch(`${process.env.REACT_APP_SERVER_URL}/expriences`)
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched experience levels
        setExperienceLevels(data);
      })
      .catch(error => {
        console.error("Error fetching experience levels:", error);
      });
  }, []);

  const handleExperinceDetailsRemove = async itemId => {
    try {
      // Make a DELETE request to the API
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/prices/${itemId}`
      );

      // Check if the DELETE request was successful (status code 200)
      if (response.status === 200) {
        window.location.reload();
      } else {
        // Handle other status codes or errors
        console.error("Failed to delete item");
      }
    } catch (error) {
      // Handle network errors or exceptions
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Paper elevation={3} className="setting-paper">
          <h2
            style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
          >
            Center Settings
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={4} className="input-field">
              <TextField
                fullWidth
                label="Center Name"
                value={centerName}
                onChange={e => setCenterName(e.target.value)}
                disabled={!isCenterEditing}
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <TextField
                fullWidth
                label="Center Address"
                value={centerAddress}
                onChange={e => setCenterAddress(e.target.value)}
                disabled={!isCenterEditing}
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <TextField
                fullWidth
                label="Contact No"
                value={contactNo}
                onChange={e => setContactNo(e.target.value)}
                disabled={!isCenterEditing}
                error={!validateContactNo(contactNo)}
                helperText={
                  !validateContactNo(contactNo) ? "Invalid contact number" : ""
                }
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <TextField
                fullWidth
                label="City"
                value={centerCity}
                onChange={e => setCenterCity(e.target.value)}
                disabled={!isCenterEditing}
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <TextField
                fullWidth
                label="Pin Code"
                value={centerPinCode}
                onChange={e => setCenterPinCode(e.target.value)}
                disabled={!isCenterEditing}
                error={!validatePinCode(centerPinCode)}
                helperText={
                  !validatePinCode(centerPinCode) ? "Invalid pin code" : ""
                }
              />
            </Grid>
          </Grid>
          {isCenterEditing ? (
            <div className="button-container">
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleCreateCenterClick}
                className="save-button"
                disabled={
                  !validateContactNo(contactNo) ||
                  !validatePinCode(centerPinCode)
                }
                style={{ backgroundColor: "#D67449", color: "white" }}
              >
                Create
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelCenterClick}
                className="cancel-button"
                style={{
                  backgroundColor: "white",
                  color: "#D67449",
                  border: "1px solid #D67449",
                  marginLeft: "1rem",
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsCenterEditing(true)}
              className="edit-button"
              style={{ backgroundColor: "#D67449" }}
            >
              Add Center
            </Button>
          )}
          {centers.length > 0 && (
            <div className="table-container">
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "black",
                }}
              >
                Center List
              </h2>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Center Name</TableCell>
                      <TableCell>Center Address</TableCell>
                      <TableCell>Contact No</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Pin Code</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {centers.map((center, index) => (
                      <TableRow key={index}>
                        <TableCell>{center.centerName}</TableCell>
                        <TableCell>{center.centerAddress}</TableCell>
                        <TableCell>{center.contactNo}</TableCell>
                        <TableCell>{center.city}</TableCell>
                        <TableCell>{center.pin}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemoveCenterClick(index)}
                            style={{
                              backgroundColor: "white",
                              color: "#D67449",
                              border: "1px solid #D67449",
                              marginLeft: "1rem",
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </Paper>
        <Paper
          elevation={3}
          className="setting-paper"
          style={{ marginTop: "2rem" }}
        >
          <h2
            style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
          >
            Therapist Session Settings
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={4} className="input-field">
              <InputLabel
                htmlFor="therapist-session-duration"
                style={{ marginBottom: "0.5rem" }}
              >
                Session Duration
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                id="therapist-session-duration"
                value={sessionDuration}
                onChange={e => setSessionDuration(e.target.value)}
                disabled={!isSessionEditing}
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <InputLabel
                htmlFor="therapist-cool-off-time"
                style={{ marginBottom: "0.5rem" }}
              >
                Session Cool Off Time
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                id="therapist-cool-off-time"
                onChange={e => setSessionCoolOffTime(e.target.value)}
                value={sessionCoolOffTime}
                disabled={!isSessionEditing}
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <TextField
                fullWidth
                label="Session Extension Time (in min)"
                type="number"
                value={30}
                disabled
                style={{ marginTop: "1.8rem" }}
              />
            </Grid>
          </Grid>
          {isSessionEditing ? (
            <div className="button-container">
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSessionClick}
                className="save-button"
                style={{ backgroundColor: "#D67449", color: "white" }}
              >
                Save Session Settings
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelSessionClick}
                className="cancel-button"
                style={{
                  backgroundColor: "white",
                  color: "#D67449",
                  border: "1px solid #D67449",
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditSessionClick}
              className="edit-button"
              style={{ backgroundColor: "#D67449", color: "white" }}
            >
              Edit Session Settings
            </Button>
          )}
        </Paper>

        <Paper
          elevation={3}
          className="setting-paper"
          style={{ marginTop: "2rem" }}
        >
          <h2
            style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
          >
            Psychiatrist Session Settings
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={4} className="input-field">
              <InputLabel
                htmlFor="session-duration"
                style={{ marginBottom: "0.5rem" }}
              >
                Session Duration
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                id="session-duration"
                value={sessionDurationPsych}
                onChange={e => setSessionDurationPsych(e.target.value)}
                disabled={!isSessionEditingPsych}
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <InputLabel
                htmlFor="cool-off-time"
                style={{ marginBottom: "0.5rem" }}
              >
                Session Cool Off Time
              </InputLabel>
              <TextField
                fullWidth
                type="number"
                id="cool-off-time"
                onChange={e => setSessionCoolOffTimePsych(e.target.value)}
                value={sessionCoolOffTimePsych}
                disabled={!isSessionEditingPsych}
              />
            </Grid>
            <Grid item xs={4} className="input-field">
              <TextField
                fullWidth
                label="Session Extension Time (in min)"
                type="number"
                value={30}
                disabled
                style={{ marginTop: "1.8rem" }}
              />
            </Grid>
          </Grid>
          {isSessionEditingPsych ? (
            <div className="button-container">
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSessionClickPsych}
                className="save-button"
                style={{ backgroundColor: "#D67449", color: "white" }}
              >
                Save Session Settings
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelSessionClickPsych}
                className="cancel-button"
                style={{
                  backgroundColor: "white",
                  color: "#D67449",
                  border: "1px solid #D67449",
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditSessionClickPsych}
              className="edit-button"
              style={{ backgroundColor: "#D67449", color: "white" }}
            >
              Edit Session Settings
            </Button>
          )}
        </Paper>

        <Paper
          elevation={3}
          className="setting-paper"
          style={{ marginTop: "2rem" }}
        >
          <h2
            style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
          >
            Experience Levels
          </h2>
          {isExperienceFormVisible ? (
            <Dialog
              open={isExperienceFormVisible}
              onClose={() => setIsExperienceFormVisible(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Add Experience Level</DialogTitle>
              <DialogContent>
                <form onSubmit={handleExperienceFormSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className="input-field">
                      <TextField
                        fullWidth
                        label="Session Number"
                        type="number"
                        value={experienceFormData.sessionNumber}
                        onChange={e =>
                          setExperienceFormData({
                            ...experienceFormData,
                            sessionNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className="input-field">
                      <TextField
                        fullWidth
                        label="Session Price"
                        type="number"
                        value={experienceFormData.sessionPrice}
                        onChange={e =>
                          setExperienceFormData({
                            ...experienceFormData,
                            sessionPrice: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className="input-field">
                      <TextField
                        fullWidth
                        label="Discount Session Price"
                        type="number"
                        value={experienceFormData.discountSessionPrice}
                        onChange={e =>
                          setExperienceFormData({
                            ...experienceFormData,
                            discountSessionPrice: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                  </Grid>
                  <DialogActions>
                    <Button
                      onClick={() => setIsExperienceFormVisible(false)}
                      style={{ backgroundColor: "#D67449", color: "white" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ backgroundColor: "#D67449", color: "white" }}
                    >
                      Add
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6} className="input-field">
                <TextField
                  fullWidth
                  label="New Level"
                  value={experienceLevelName}
                  onChange={e => setExperienceLevelName(e.target.value)}
                  disabled={!isExperienceEditing}
                />
              </Grid>
              <Grid item xs={6}>
                {isExperienceEditing ? (
                  <Button
                    variant="contained"
                    onClick={handleAddExperienceLevel}
                    className="add-button"
                    disabled={experienceLevelName.trim() === ""}
                    style={{ backgroundColor: "#D67449", color: "white" }}
                  >
                    Add
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsExperienceEditing(true)}
                    className="edit-button"
                    style={{ backgroundColor: "#D67449", color: "white" }}
                  >
                    Edit Experience Levels
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
          {experienceLevels.length > 0 && (
            <div className="table-container">
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "black",
                }}
              >
                Experience Levels
              </h2>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Level Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {experienceLevels.map((level, index) => (
                      <TableRow key={index}>
                        <TableCell>{level.level}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() =>
                              handleEditExperienceLevel(index, level._id)
                            }
                            style={{
                              backgroundColor: "#D67449",
                              color: "white",
                              border: "0px solid",
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() =>
                              handleRemoveExperienceLevel(0, level._id)
                            }
                            style={{
                              backgroundColor: "white",
                              color: "#D67449",
                              border: "1px solid #D67449",
                              marginLeft: "1rem",
                            }}
                          >
                            Remove
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<DetailsIcon />}
                            onClick={() => handleDetailsClick(index, level._id)}
                            style={{
                              backgroundColor: "white",
                              color: "#D67449",
                              border: "1px solid #D67449",
                              marginLeft: "1rem",
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          <Dialog
            open={detailsIndex !== null}
            onClose={() => {
              setDetailsIndex(null);
              setSelectedExperienceDetails(null);
            }}
            fullWidth
            maxWidth="md" // Increase the maximum width for better layout
          >
            {detailsIndex !== null && (
              <>
                <DialogTitle>Experience Level Details</DialogTitle>
                <DialogContent>
                  {selectedExperienceDetails && (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Session Number</TableCell>
                            <TableCell>Session Price</TableCell>
                            <TableCell>Discount Session Price</TableCell>
                            <TableCell>Action</TableCell>{" "}
                            {/* New "Action" column */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedExperienceDetails.map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>{detail.session}</TableCell>
                              <TableCell>{detail.sessionPrice}</TableCell>
                              <TableCell>{detail.discountPrice}</TableCell>
                              <TableCell>
                                <button
                                  onClick={() =>
                                    handleExperinceDetailsRemove(detail._id)
                                  }
                                >
                                  Remove
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDetailsIndex(null)}>Close</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Paper>

        <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
          <Paper
            elevation={3}
            style={{ padding: "16px", marginBottom: "16px" }}
          >
            <h1 style={{ textAlign: "center", marginBottom: "16px" }}>
              Add Expertise
            </h1>
            <TextField
              label="Expertise"
              variant="outlined"
              value={expertise}
              onChange={handleExpertiseChange}
              fullWidth
              style={{ marginBottom: "16px" }}
            />
            <Button
              variant="contained"
              onClick={handleAddExpertise}
              fullWidth
              style={{
                color: "white",
                backgroundColor: "#D67449",
              }}
            >
              Add
            </Button>
          </Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} style={{ textAlign: "center" }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  expertiseList.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleRemoveExpertise(item.id)}
                        >
                          <DeleteIcon style={{ color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Box
          boxShadow={3}
          p={3}
          style={{ marginTop: "3rem", width: "95%", marginLeft: "1.5rem" }}
        >
          <h2>Edit First Session Note</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditChiefNote}
            style={{ marginRight: "1rem" }}
          >
            Edit Chief-First Session Note
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEditIllnessNote}
          >
            Edit Illness-First Session Note
          </Button>
        </Box>

        <Container maxWidth="md" style={{ marginTop: "3rem" }}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                color: "black",
              }}
            >
              Upload Files
            </h2>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="uploadMedicineList">
                  <input
                    type="file"
                    accept=".xlsx"
                    id="uploadMedicineList"
                    style={{ display: "none" }}
                    onChange={handleMedicineListUpload}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      color: "white",
                      backgroundColor: "#D67449",
                    }}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Medicine List
                  </Button>
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  onClick={viewMedicineList}
                  startIcon={<DescriptionIcon />}
                  style={{
                    color: "white",
                    backgroundColor: "#D67449",
                  }}
                >
                  View Medicine List
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="uploadLabTestList">
                  <input
                    type="file"
                    accept=".xlsx"
                    id="uploadLabTestList"
                    style={{ display: "none" }}
                    onChange={handleLabTestListUpload}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    style={{
                      color: "white",
                      backgroundColor: "#D67449",
                    }}
                  >
                    Upload Lab Test List
                  </Button>
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  onClick={viewLabTestList}
                  startIcon={<DescriptionIcon />}
                  style={{
                    color: "white",
                    backgroundColor: "#D67449",
                  }}
                >
                  View Lab Test List
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
          <DialogTitle>Medicine List</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No.</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Loop through the medicineList state and display the data in table rows */}
                  {medicineList.map((medicine, index) => (
                    <TableRow key={medicine._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{medicine.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              style={{ backgroundColor: "#D67449", color: "white" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openLabTestDialog}
          onClose={handleCloseLabTestDialog}
          maxWidth="md"
        >
          <DialogTitle>Lab Test List</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No.</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Loop through the labTestList state and display the data in table rows */}
                  {labTestList?.map((labTest, index) => (
                    <TableRow key={labTest._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{labTest.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLabTestDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
}

export default SettingPage;
