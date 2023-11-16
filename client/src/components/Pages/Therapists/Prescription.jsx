import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import _ from "lodash";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TherapistDetails from "../Admin/TherapistDetails";
import Footer from "../Footer";

function Prescription() {
  const { id } = useParams();
  const { therapistId } = useParams();
  const [editMode, setEditMode] = useState(true);
  const [showPdfButton, setShowPdfButton] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState({
    name: "--",
    age: "--",
    mobile: "--",
    gender: "--",
  });
  const [diagnosis, setDiagnosis] = useState("");
  const [description, setDescription] = useState("");
  const [medicineData, setMedicineData] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
  });
  const [medicineList, setMedicineList] = useState([]);
  const [labTestList, setLabTestList] = useState([]);
  const [selectedLabTest, setSelectedLabTest] = useState("");
  const [selectedLabTests, setSelectedLabTests] = useState([]);
  const [therapistData, setTherapistData] = useState(null);
  console.log(therapistData);

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/therapists/${therapistId}`
        );
        setTherapistData(response.data);
      } catch (error) {
        console.error("Error fetching therapist data:", error);
      }
    };

    fetchTherapistData();
  }, [therapistId]);

  const storedUserId = localStorage.getItem("userId");
  console.log(storedUserId);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/appointments/${id}`
        );
        setAppointmentData(response.data);

        const userId = response.data?.user?._id;

        setUserId(userId);
        if (userId) {
          const userResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/users/${userId}`
          );
          setUserData(userResponse.data);
          setUserEmail(userResponse.data.email);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAppointmentData();

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/medicence`)
      .then(response => {
        setMedicineList(response.data);
      })
      .catch(error => {
        console.error("Error fetching medicine list:", error);
      });

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/labtests`)
      .then(response => {
        setLabTestList(response.data);
      })
      .catch(error => {
        console.error("Error fetching lab test list:", error);
      });
  }, [id]);

  useEffect(() => {
    const handleResize = _.debounce(() => {
      console.log("Window resized");
    }, 300);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSave = () => {
    setEditMode(false);
    setShowPdfButton(true);
  };
  console.log(therapistData?.education);

  let educationLevel = "";
  if (therapistData?.education?.length > 0) {
    const lastItem =
      therapistData?.education[therapistData?.education?.length - 1];
    educationLevel = lastItem.educationLevel;
    console.log("Education Level of the last element: " + educationLevel);
  } else {
    educationLevel = "-";
    console.log(therapistData?.education);
  }

  const handleProvidePdf = () => {
    console.log("hi");
    const dataToSend = {
      diagnosis: diagnosis,
      description: description,
      medicineData: medicineData,
      selectedLabTest: selectedLabTest,
    };

    console.log(diagnosis, description, selectedLabTest);

    const doc = new jsPDF({
      compress: true, // Enable PDF compression
    });
    const margin = 10;
    let currentY = margin;

    doc.setFontSize(12);
    doc.text(`Psychiatrist Name: ${therapistData?.name}`, margin, currentY);
    currentY += 10;
    doc.text(`Education Level: ${educationLevel}`, margin, currentY);
    currentY += 10;

    doc.setFontSize(18);
    doc.text("Medical Prescription", 105, currentY);
    currentY += 10;

    doc.setFontSize(14);
    doc.text("User Information", margin, currentY);
    currentY += 10;
    const userTableData = [
      ["Name:", userData.name],
      ["Age:", userData.age],
      ["Phone Number:", userData.mobile],
      ["Gender:", userData.gender],
    ];
    doc.autoTable({
      startY: currentY,
      body: userTableData,
      theme: "grid",
      styles: { cellPadding: 2, fontSize: 12, cellWidth: "auto" },
    });

    currentY += doc.autoTable.previous.finalY - 25;
    doc.setFontSize(14);
    doc.text("Diagnosis", margin, currentY);
    currentY += 5;
    doc.setFontSize(12);

    const splitText = doc.splitTextToSize(diagnosis, 190);
    doc.text(splitText, margin, currentY);

    currentY += doc.getTextDimensions(splitText).h + 10;

    doc.setFontSize(14);
    doc.text("Description", margin, currentY);
    currentY += 5;
    doc.setFontSize(12);

    const splitDescription = doc.splitTextToSize(description, 190);
    doc.text(splitDescription, margin, currentY);

    currentY += doc.getTextDimensions(splitDescription).h + 10;

    doc.setFontSize(14);
    doc.text("Medicine List", margin, currentY);
    const medicineTableData = medicineData.map((medicine, index) => [
      `Medicine ${index + 1}`,
      medicine.name,
      medicine.dosage,
      medicine.frequency,
      medicine.instructions,
    ]);
    doc.autoTable({
      startY: currentY + 10,
      body: medicineTableData,
      theme: "striped",
      styles: { cellPadding: 2, fontSize: 12, cellWidth: "auto" },
      head: [["#", "Name", "Dosage", "Frequency", "Instructions"]],
    });

    currentY += doc.autoTable.previous.finalY + 5;
    doc.setFontSize(14);
    doc.text("Lab Tests", margin, currentY);
    const labTestTableData = selectedLabTests.map((labTest, index) => [
      labTest,
    ]);
    doc.autoTable({
      startY: currentY + 5,
      body: labTestTableData,
      theme: "striped",
      styles: { cellPadding: 2, fontSize: 12, cellWidth: "auto" },
      head: [["Lab Test Name"]],
    });

    currentY += doc.autoTable.previous.finalY + 5;

    const watermarkWidth = 40;
    const watermarkHeight = 40;
    const watermarkXCoordinate = watermarkWidth - 10;
    const watermarkYCoordinate = 90 + watermarkHeight - 10;
    doc.addImage(
      therapistData?.sign,
      "PNG",
      watermarkXCoordinate,
      watermarkYCoordinate,
      watermarkWidth,
      watermarkHeight,
      "", // Image format
      "FAST", // Image compression: try "SLOW" for higher quality
      72 // DPI (dots per inch): lower DPI can reduce file size
    );

    const pdfData = doc.output("datauristring");

    // Create a link to download the PDF locally
    const downloadLink = document.createElement("a");
    downloadLink.href = pdfData;
    downloadLink.download = "medical_prescription.pdf";
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    // Trigger the download link and remove it
    downloadLink.click();
    document.body.removeChild(downloadLink);

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/eprescriptions/${therapistId}/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      }
    )
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log("Data sent successfully:", data);
        // Handle the response data as needed
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle any errors that occurred during the fetch
      });
  };

  const tableCellStyle = {
    borderBottom: "none",
  };

  const handleAddMedicine = () => {
    if (
      newMedicine.name === "" ||
      newMedicine.dosage === "" ||
      newMedicine.frequency === "" ||
      newMedicine.instructions === ""
    ) {
      alert("Please fill in all fields for the medicine.");
      return;
    }

    setMedicineData([...medicineData, { ...newMedicine }]);
    setNewMedicine({
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
    });
  };

  const handleRemoveMedicine = indexToRemove => {
    const updatedMedicineData = medicineData.filter(
      (_, index) => index !== indexToRemove
    );
    setMedicineData(updatedMedicineData);
  };

  const handleAddLabTest = () => {
    if (!selectedLabTest) {
      alert("Please select a lab test to add.");
      return;
    }

    setSelectedLabTests([...selectedLabTests, selectedLabTest]);
    setSelectedLabTest("");
  };

  const handleRemoveLabTest = labTestToRemove => {
    const updatedLabTests = selectedLabTests.filter(
      labTest => labTest !== labTestToRemove
    );
    setSelectedLabTests(updatedLabTests);
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5">User Information</Typography>
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={tableCellStyle}>Name</TableCell>
                    <TableCell style={tableCellStyle}>Age</TableCell>
                    <TableCell style={tableCellStyle}>Phone Number</TableCell>
                    <TableCell style={tableCellStyle}>Gender</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell style={tableCellStyle}>
                      {userData.name}
                    </TableCell>
                    <TableCell style={tableCellStyle}>{userData.age}</TableCell>
                    <TableCell style={tableCellStyle}>
                      {userData.mobile}
                    </TableCell>
                    <TableCell style={tableCellStyle}>
                      {userData.gender}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={3}>
              <TextField
                label="Diagnosis"
                variant="outlined"
                fullWidth
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
              />
            </Box>
            <Box mt={3}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Box>
            <Typography variant="h5" style={{ marginTop: "20px" }}>
              Medicine List
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine Name</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Instructions</TableCell>
                    {editMode && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicineData.map((medicine, index) => (
                    <TableRow key={index}>
                      <TableCell>{medicine.name}</TableCell>
                      <TableCell>{medicine.dosage}</TableCell>
                      <TableCell>{medicine.frequency}</TableCell>
                      <TableCell>{medicine.instructions}</TableCell>
                      {editMode && (
                        <TableCell>
                          <Button
                            onClick={() => handleRemoveMedicine(index)}
                            color="secondary"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {editMode && (
              <Box mt={3}>
                <Typography variant="h6">Add Medicine</Typography>
                <Select
                  label="Medicine Name"
                  variant="outlined"
                  fullWidth
                  value={newMedicine.name}
                  onChange={e =>
                    setNewMedicine({ ...newMedicine, name: e.target.value })
                  }
                >
                  <MenuItem value="">Select Medicine</MenuItem>
                  {medicineList.map(medicine => (
                    <MenuItem key={medicine._id} value={medicine.name}>
                      {medicine.name}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Dosage"
                  variant="outlined"
                  fullWidth
                  value={newMedicine.dosage}
                  onChange={e =>
                    setNewMedicine({ ...newMedicine, dosage: e.target.value })
                  }
                />
                <TextField
                  label="Frequency"
                  variant="outlined"
                  fullWidth
                  value={newMedicine.frequency}
                  onChange={e =>
                    setNewMedicine({
                      ...newMedicine,
                      frequency: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Instructions"
                  variant="outlined"
                  fullWidth
                  value={newMedicine.instructions}
                  onChange={e =>
                    setNewMedicine({
                      ...newMedicine,
                      instructions: e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                  onClick={handleAddMedicine}
                >
                  Add Medicine
                </Button>
              </Box>
            )}
            <Typography variant="h5" style={{ marginTop: "5%" }}>
              Lab Tests
            </Typography>
            {editMode && (
              <Box mt={3}>
                <Select
                  label="Select Lab Test"
                  variant="outlined"
                  fullWidth
                  value={selectedLabTest}
                  onChange={e => setSelectedLabTest(e.target.value)}
                >
                  <MenuItem value="">Select Lab Test</MenuItem>
                  {labTestList.map(labTest => (
                    <MenuItem key={labTest._id} value={labTest.name}>
                      {labTest.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                  onClick={handleAddLabTest}
                >
                  Add Lab Test
                </Button>
              </Box>
            )}
            <div style={{ height: "200px", overflowY: "scroll" }}>
              <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Lab Test Name</TableCell>
                      {editMode && <TableCell>Action</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedLabTests.map((labTest, index) => (
                      <TableRow key={index}>
                        <TableCell>{labTest}</TableCell>
                        {editMode && (
                          <TableCell>
                            <Button
                              onClick={() => handleRemoveLabTest(labTest)}
                              color="secondary"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {editMode && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={handleSave}
              >
                Save
              </Button>
            )}
            {showPdfButton && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={handleProvidePdf}
              >
                Provide PDF
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Prescription;
