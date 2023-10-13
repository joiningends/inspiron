import React, { useState, useEffect } from "react";
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import "./Profile.css";

// Import icons for react-datepicker
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1877f2",
    },
  },
});

const ProfileContainer = styled("div")({
  padding: theme.spacing(3),
  maxWidth: "600px",
  margin: "0 auto",
  border: "1px solid #ccc",
  borderRadius: "10px",
  backgroundColor: "white",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const Title = styled(Typography)({
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  color: "#1877f2",
  textAlign: "center",
});

const FieldContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  width: "100%",
  marginBottom: theme.spacing(2),
});

const InputLabel = styled("strong")({
  marginBottom: theme.spacing(1),
  fontSize: "20px",
  color: "#333",
});

const InputField = styled(TextField)({
  marginBottom: theme.spacing(1),
});

const DisabledInputField = styled(TextField)({
  marginBottom: theme.spacing(1),
  backgroundColor: "#f5f5f5",
  pointerEvents: "none",
  color: "#777",
});

const Actions = styled("div")({
  marginTop: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
});

function Profile() {
  const [isEditing, setIsEditing] = useState(true);
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const currentDate = new Date();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));

    if (userId) {
      const apiUrl = `${process.env.REACT_APP_SERVER_URL}/users/${userId}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(userData => {
          setName(userData?.name || "");
          setEmail(userData?.email || "");
          setDob(
            userData?.socioeconomic?.dateOfBirth
              ? new Date(userData.socioeconomic.dateOfBirth)
              : null
          );
          setAge(userData?.age || "");
          setGender(userData?.gender || "");
          setMobileNumber(userData?.mobile ? userData.mobile.toString() : "");
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleUpdateClick = () => {
    if (!isValidPhoneNumber(mobileNumber)) {
      toast.error("Please enter a valid mobile number!", {
        position: "bottom-right",
      });
      return;
    }

    if (!dob) {
      toast.error("Please select a valid date of birth!", {
        position: "bottom-right",
      });
      return;
    }

    const userId = JSON.parse(localStorage.getItem("userId"));
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/users/${userId}`;

    const updatedUserData = {
      name,
      email,
      socioeconomic: { dateOfBirth: dob.toISOString() },
      age,
      gender,
      mobile: parseInt(mobileNumber, 10),
    };

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then(response => response.json())
      .then(responseJson => {
        setIsEditing(false);
        toast.success("Profile updated successfully!", {
          position: "bottom-right",
        });
      })
      .catch(error => {
        console.error("Error updating user data:", error);
        toast.error("Failed to update profile. Please try again later.", {
          position: "bottom-right",
        });
      });
  };

  const handleChangeMobileNumber = e => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setMobileNumber(numericValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <ProfileContainer>
        <Title variant="h4" style={{ color: "#D67449" }}>
          Edit Profile
        </Title>
        <FieldContainer>
          <InputLabel>Name:</InputLabel>
          <DisabledInputField
            variant="outlined"
            fullWidth
            value={name}
            readOnly
          />
        </FieldContainer>
        <FieldContainer>
          <InputLabel style={{ marginTop: "1rem" }}>Date of Birth:</InputLabel>
          <DatePicker
            selected={dob}
            onChange={date => setDob(date)}
            dateFormat={dob ? "dd-MM-yyyy" : "dd-MM-yyyy"}
            maxDate={currentDate}
            disabled={!isEditing}
            customInput={
              <InputField
                variant="outlined"
                fullWidth
                endAdornment={<CalendarTodayIcon />}
              />
            }
          />
        </FieldContainer>
        <FieldContainer>
          <InputLabel>Gender:</InputLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={gender}
            onChange={e => setGender(e.target.value)}
            disabled={!isEditing}
          >
            <FormControlLabel
              value="Male"
              control={<Radio />}
              label="Male"
              disabled={!isEditing}
            />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
              disabled={!isEditing}
            />
          </RadioGroup>
        </FieldContainer>
        <FieldContainer>
          <InputLabel>Email:</InputLabel>
          <DisabledInputField
            variant="outlined"
            fullWidth
            value={email}
            readOnly
          />
          <FieldContainer style={{ marginTop: "1rem" }}>
            <InputLabel>Mobile Number:</InputLabel>
            <InputField
              variant="outlined"
              fullWidth
              value={mobileNumber}
              onChange={handleChangeMobileNumber}
              disabled={!isEditing}
            />
          </FieldContainer>
        </FieldContainer>

        {isEditing && (
          <Actions>
            <Button
              variant="contained"
              onClick={handleUpdateClick}
              style={{
                backgroundColor: "#D67449",
                color: "white",
              }}
            >
              Update
            </Button>
          </Actions>
        )}
        <ToastContainer
          autoClose={2000}
          style={{
            color: "white",
          }}
        />
      </ProfileContainer>
    </ThemeProvider>
  );
}

function isValidPhoneNumber(phoneNumber) {
  const mobileNumberRegex = /^[6-9]\d{9}$/;
  return mobileNumberRegex.test(phoneNumber);
}

export default Profile;
