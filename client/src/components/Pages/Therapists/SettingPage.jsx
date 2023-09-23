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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import DetailsIcon from "@mui/icons-material/Details";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

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
  const [sessionCoolOffTime, setSessionCoolOffTime] = useState(
    sessionInfo?.categories[0]?.timeBetweenSessions
  );
  const [isCenterEditing, setIsCenterEditing] = useState(false);
  const [isSessionEditing, setIsSessionEditing] = useState(false);
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

  const handleMedicineListUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setMedicineListFile(file);
    }
  };

  const handleLabTestListUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setLabTestListFile(file);
    }
  };

  const viewMedicineList = () => {
    if (medicineListFile) {
      // Handle viewing the medicine list here, e.g., parsing the Excel file.
      alert("Viewing Medicine List");
    } else {
      alert("Please upload a Medicine List file first");
    }
  };

  const viewLabTestList = () => {
    if (labTestListFile) {
      // Handle viewing the lab test list here, e.g., parsing the Excel file.
      alert("Viewing Lab Test List");
    } else {
      alert("Please upload a Lab Test List file first");
    }
  };

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:4000/api/v1/expetises")
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
      fetch("http://localhost:4000/api/v1/expetises", {
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
    fetch(`http://localhost:4000/api/v1/expetises/${id}`, {
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
    fetch("http://localhost:4000/api/v1/categories/session/info")
      .then(response => response.json())
      .then(data => {
        // Update state with the fetched data and set loading to false
        setSessionInfo(data);
        setSessionDuration(data?.categories[0]?.sessionDuration);
        setSessionCoolOffTime(data?.categories[0]?.timeBetweenSessions);
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
        `http://localhost:4000/api/v1/prices/${id}`
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
      const response = await fetch("http://localhost:4000/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCenter),
      });

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
          "http://localhost:4000/api/v1/categories/center/info"
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

  const handleRemoveCenterClick = index => {
    const newCenters = centers.filter((_, i) => i !== index);
    setCenters(newCenters);
  };

  const validateContactNo = value => /^\d{10}$/.test(value);
  const validatePinCode = value => /^\d+$/.test(value);

  const handleEditSessionClick = () => {
    setIsSessionEditing(true);
  };

  const handleSaveSessionClick = async id => {
    // const updateData = async () => {
    //   try {
    //     const response = await axios.put('http://localhost:4000/api/v1/categories/session/info', dataToUpdate);
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
        `http://localhost:4000/api/v1/categories/update-session/64bad3d92b8b7b3b420212f5`,
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
          "http://localhost:4000/api/v1/prices",
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

  const handleRemoveExperienceLevel = index => {
    const newExperienceLevels = experienceLevels.filter((_, i) => i !== index);
    setExperienceLevels(newExperienceLevels);
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
          "http://localhost:4000/api/v1/expriences",
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
    fetch("http://localhost:4000/api/v1/expriences")
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched experience levels
        setExperienceLevels(data);
      })
      .catch(error => {
        console.error("Error fetching experience levels:", error);
      });
  }, []);

  return (
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
                !validateContactNo(contactNo) || !validatePinCode(centerPinCode)
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
                          startIcon={<EditIcon />}
                          onClick={() => handleEditCenterClick(index)}
                          style={{ backgroundColor: "#D67449", color: "white" }}
                        >
                          Edit
                        </Button>
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
          Session Settings
        </h2>
        <Grid container spacing={2}>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              type="number"
              value={sessionDuration}
              onChange={e => setSessionDuration(e.target.value)}
              disabled={!isSessionEditing}
            />
          </Grid>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              type="number"
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
                          onClick={() => handleRemoveExperienceLevel(index)}
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedExperienceDetails.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{detail.session}</TableCell>
                            <TableCell>{detail.sessionPrice}</TableCell>
                            <TableCell>{detail.discountPrice}</TableCell>
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
      <Paper
        elevation={3}
        className="setting-paper"
        style={{ marginTop: "2rem" }}
      >
        <h2
          style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
        >
          Session Settings
        </h2>
        <Grid container spacing={2}>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              type="number"
              value={sessionDuration}
              onChange={e => setSessionDuration(e.target.value)}
              disabled={!isSessionEditing}
            />
          </Grid>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              type="number"
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
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
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

      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <h2
            style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "black" }}
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
                disabled={!medicineListFile}
                startIcon={<DescriptionIcon />}
                style={{
                  color: "white",
                  backgroundColor: "#D67449",
                }}
              >
                View List
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
                disabled={!labTestListFile}
                startIcon={<DescriptionIcon />}
                style={{
                  color: "white",
                  backgroundColor: "#D67449",
                }}
              >
                View List
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Container>
  );
}

export default SettingPage;
