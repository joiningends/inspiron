import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import "./SettingPage.css";

function SettingPage() {
  const [centerName, setCenterName] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionCoolOffTime, setSessionCoolOffTime] = useState(0);
  const [sessionExtensionTime, setSessionExtensionTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [centers, setCenters] = useState([]);

  const handleEditClick = index => {
    setIsEditing(true);
    const center = centers[index];
    setCenterName(center.centerName);
    setCenterAddress(center.centerAddress);
    setContactNo(center.contactNo);
  };

  const handleCreateClick = () => {
    const newCenter = {
      centerName,
      centerAddress,
      contactNo,
    };
    setCenters([...centers, newCenter]);
    setCenterName("");
    setCenterAddress("");
    setContactNo("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setCenterName("");
    setCenterAddress("");
    setContactNo("");
  };

  const handleRemoveClick = index => {
    const newCenters = centers.filter((_, i) => i !== index);
    setCenters(newCenters);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} className="setting-paper">
        <Typography variant="h4" gutterBottom className="setting-title">
          Center Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              label="Center Name"
              value={centerName}
              onChange={e => setCenterName(e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              label="Center Address"
              value={centerAddress}
              onChange={e => setCenterAddress(e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              label="Contact No"
              value={contactNo}
              onChange={e => setContactNo(e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
        {isEditing ? (
          <div className="button-container">
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleCreateClick}
              className="save-button"
            >
              Create
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelClick}
              className="cancel-button"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            Add Center
          </Button>
        )}
        {centers.length > 0 && (
          <div className="table-container">
            <Typography variant="h6" gutterBottom>
              Center List
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Center Name</TableCell>
                    <TableCell>Center Address</TableCell>
                    <TableCell>Contact No</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centers.map((center, index) => (
                    <TableRow key={index}>
                      <TableCell>{center.centerName}</TableCell>
                      <TableCell>{center.centerAddress}</TableCell>
                      <TableCell>{center.contactNo}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveClick(index)}
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

      <Paper elevation={3} className="setting-paper">
        <Typography variant="h4" gutterBottom className="setting-title">
          Session Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              label="Session Duration"
              type="number"
              value={sessionDuration}
              onChange={e => setSessionDuration(e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              label="Session Cool Off Time"
              type="number"
              value={sessionCoolOffTime}
              onChange={e => setSessionCoolOffTime(e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={4} className="input-field">
            <TextField
              fullWidth
              label="Session Extension Time"
              type="number"
              value={sessionExtensionTime}
              onChange={e => setSessionExtensionTime(e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Add Time Settings */}
    </Container>
  );
}

export default SettingPage;
