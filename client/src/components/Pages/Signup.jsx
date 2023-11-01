import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhoneAlt,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { createUser } from "../redux/Action";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "mobile") {
      // Remove any non-digit characters
      updatedValue = updatedValue.replace(/\D/g, "");

      // Add "91" in front of the phone number if it doesn't start with it
      if (!updatedValue.startsWith("91")) {
        updatedValue = `91${updatedValue}`;
      }
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: updatedValue,
    }));

    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
    if (name === "confirmPassword") {
      setConfirmPasswordTouched(true);
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

  const handleEmailBlur = () => {
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
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.mobile ||
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

    if (formData.mobile.length !== 12) {
      toast.error("Please enter a valid 12-digit phone number.", {
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

    dispatch(createUser(formData));

    setFormData({
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

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
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <div className="form-group">
          <FontAwesomeIcon
            icon={faUser}
            className={`icon ${formData.name ? "active" : ""}`}
          />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <FontAwesomeIcon
            icon={faPhoneAlt}
            className={`icon ${formData.mobile ? "active" : ""}`}
          />
          <input
            type="tel"
            id="phoneNumber"
            name="mobile"
            placeholder="Phone Number"
            value={formData.mobile}
            onChange={handleChange}
            onBlur={handleInputBlur}
            required
          />
        </div>
        <div className="form-group">
          <FontAwesomeIcon
            icon={faEnvelope}
            className={`icon ${formData.email ? "active" : ""}`}
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            required
          />
        </div>
        <div className="form-group">
          <FontAwesomeIcon
            icon={faLock}
            className={`icon ${formData.password ? "active" : ""}`}
          />
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              style={{width:"15rem"}}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className={`toggle-password-icon ${
                formData.password ? "active" : ""
              }`}
              onClick={toggleShowPassword}
            />
          </div>
        </div>
        <div className="form-group">
          <FontAwesomeIcon
            icon={faLock}
            className={`icon ${formData.confirmPassword ? "active" : ""}`}
          />
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            style={{
              borderBottomColor:
                confirmPasswordTouched && !passwordMatch ? "red" : "#e7e7e7",
            }}
            required
          />
          {!passwordMatch && <p className="error">Passwords do not match</p>}
        </div>
        <button type="submit" onClick={handleSubmit}>
          Sign Up
        </button>
        <p>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
