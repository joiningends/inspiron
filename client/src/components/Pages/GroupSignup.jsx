import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PhoneInput from "react-phone-number-input";

import buildingImage from "./corporatebuilding.png";
import userIdC from "./userId.png";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import axios from "axios";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  FormControl,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import telePhone from "./telephoneForSignUppage.png";
import wheel from "./inspironwhitewheel.png";
import wheell from "./inspironwhitewheel2.png";
import lock from "./padlockForSignUpPage.png";
import email from "./emailForSignUpPage.png";
import user from "./userIconsforsignup.png";

const GroupSignUp = () => {
  const { groupId, company } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "91", // Prefix "91" to the phone number
    email: "",
    password: "",
    confirmPassword: "",
    empid: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "empid") {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(
        name === "password" && value === formData.confirmPassword
      );

      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "confirmPassword") {
        setConfirmPasswordTouched(true);
      }
    } else if (name === "mobile" || name === "email" || name === "name") {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleInputFocus = () => {
    setShowPassword(true);
  };

  const handleInputBlur = () => {
    setShowPassword(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      !formData.name ||
      !phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.empid
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#f44336",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "4px",
          padding: "12px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        },
      });
      return;
    }

    const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#f44336",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "4px",
          padding: "12px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        },
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/register/${groupId}`,
        {
          name: formData.name,
          mobile: formattedPhoneNumber,
          email: formData.email,
          password: formData.password,
          empid: formData.empid,
        }
      );

      setFormData({
        name: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
        empid: "",
      });

      setPhoneNumber();

      toast.success("Please verify your mail ID.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "green",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "4px",
          padding: "12px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        },
      });
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("An error occurred while signing up. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#f44336",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "4px",
          padding: "12px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        },
      });
    }
  };

  return (
    <>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          minWidth: "100vw",
          background: "linear-gradient(to bottom, #68B545 70%, #ffffff 50%)",
          fontFamily: "Poppins, sans-serif",
          marginTop: "-2rem",
          position: "relative",
        }}
      >
        <img
          src={wheel}
          alt="wheel"
          className="star-icon"
          style={{
            width: "8vw",
            height: "25vh",
            position: "absolute",
            top: 0,
            left: -10,
            margin: "10px",
          }}
        />
        <img
          src={wheell}
          alt="wheel"
          className="star-icon"
          style={{
            width: "14vw",
            height: "14vh",
            position: "absolute",
            top: -10,
            right: -10,
            margin: "10px",
          }}
        />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} style={{ height: "30rem" }}>
            <FormControl
              style={{
                padding: "30px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                width: "60%",
                marginTop: "4rem",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  textAlign: "center",
                  marginBottom: "30px",
                  color: "#333",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Typography>

              <TextField
                className="form-group"
                variant="standard"
                fullWidth
                style={{ marginBottom: "10px", borderBottom: "none" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={user}
                        alt="user"
                        style={{ height: "1.2em", marginRight: "8px" }}
                      />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  style: {
                    fontFamily: "Poppins, sans-serif",
                    marginBottom: "10px",
                  },
                }}
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Typography
                variant="subtitle1"
                gutterBottom
                style={{
                  color: " rgba(0, 0, 0, 0.6)",
                  fontSize: "0.76rem",
                  marginRight: "17.4rem",
                  whiteSpace: "nowrap",
                }}
              >
                Please enter WhatsApp number here*
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={telePhone}
                  alt="phone icon"
                  style={{
                    height: "1.5rem",
                    width: "1.5rem",
                    marginRight: "8px",
                    marginBottom: "8px",
                  }}
                />
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter WhatsApp number here (Country Name)"
                  style={{
                    height: "40px", // Fixed height
                    width: "calc(100% - 32px)", // Adjusted width to accommodate icon and margin
                    fontSize: "16px",
                    border: "1px solid #E7E7E7",
                    borderRadius: "4px",
                    padding: "10px",
                    marginBottom: "16px", // Add space below
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,
                    style: { fontSize: "16px", color: "#333", padding: "20px" },
                  }}
                  inputStyle={{
                    border: "none", // Remove the additional border inside
                  }}
                />
              </div>
              <TextField
                className="form-group"
                variant="standard"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={email}
                        alt="email"
                        style={{ height: "1.2em", marginRight: "8px" }}
                      />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  style: { fontFamily: "Poppins, sans-serif" },
                }}
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
                required
              />

              <TextField
                className="form-group"
                variant="standard"
                fullWidth
                style={{ marginBottom: "10px", width: "25vw" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={lock}
                        alt="lock"
                        style={{ height: "1.2em", marginRight: "8px" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{
                        border: "1px solid #E7E7E7",
                        height: "10rem",
                        padding: "1.2rem 0",
                      }}
                    >
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  style: {
                    fontFamily: "Poppins, sans-serif",
                  },
                }}
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <TextField
                className="form-group"
                variant="standard"
                fullWidth
                style={{ marginBottom: "10px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={lock}
                        alt="lock"
                        style={{ height: "1.2em", marginRight: "8px" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{
                        border: "1px solid #E7E7E7",
                        height: "10rem",
                        padding: "1.2rem 0",
                      }}
                    >
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  style: { fontFamily: "Poppins, sans-serif" },
                }}
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div className="form-group">
                <img
                  src={userIdC}
                  alt="User ID"
                  className="icon"
                  style={{ width: "24px", height: "24px" }}
                />
                <input
                  type="text"
                  id="empid"
                  name="empid"
                  placeholder="Employee ID"
                  value={formData.empid}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <img
                  src={buildingImage}
                  alt="Corporate Building"
                  className="icon active"
                  style={{ width: "24px", height: "24px" }}
                />

                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Company Name"
                  value={company}
                  readOnly
                />
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTermsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    I accept the{" "}
                    <Link
                      href="https://www.inspirononline.com/terms/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#333",
                        textDecoration: "underline",
                      }}
                    >
                      terms and conditions
                    </Link>
                  </Typography>
                }
              />

              <button type="submit" onClick={handleSubmit}>
                Sign Up
              </button>
              <p>
                Already have an account? <a href="/signin">Sign In</a>
              </p>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer />
    </>
  );
};
export default GroupSignUp;
