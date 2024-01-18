import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import * as isoCountries from "i18n-iso-countries";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import Flag from "react-country-flag";

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
  InputLabel,
} from "@mui/material";
import { createUser } from "../redux/Action";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import wheel from "./inspironwhitewheel.png";
import wheell from "./inspironwhitewheel2.png";
import telePhone from "./telephoneForSignUppage.png";
import lock from "./padlockForSignUpPage.png";
import email from "./emailForSignUpPage.png";
import user from "./userIconsforsignup.png";
const Signup = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAccept: true,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState();

  const handleChange = e => {
    const { name, value } = e.target;

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

  const handleSubmit = e => {
    e.preventDefault();

    // Check for required fields and valid phone number length
    if (
      !formData.name ||
      !phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
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

    // Remove non-numeric characters from the phone number
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, "");

    console.log(formattedPhoneNumber)

    dispatch(
      createUser({
        ...formData,
        mobile: formattedPhoneNumber,
      })
    );

    // Clear form data after submission
    setFormData({
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setPhoneNumber();

    // Show success message or perform other actions after submission
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
  };

  return (
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                marginTop: "20px",
                backgroundColor: "#ff7f50",
                color: "white",
                borderRadius: "6px",
              }}
              onClick={handleSubmit}
              disabled={!isTermsAccepted}
            >
              Sign Up
            </Button>

            <p
              style={{
                textAlign: "center",
                marginTop: "15px",
                fontSize: "14px",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/signin"
                style={{
                  color: "#ff7f50",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            </p>
          </FormControl>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default Signup;
