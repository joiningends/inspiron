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
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import axios from "axios";

const GroupSignUp = () => {
  const { groupId, company } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    empid: "", // Add the new field
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;

    // Only update the state if the value is a digit
    if (name === "mobile" && isNaN(value)) {
      return; // Ignore non-digit input
    }

    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      if (name === "password" || name === "confirmPassword") {
        setPasswordMatch(updatedData.password === updatedData.confirmPassword);
      }
      if (name === "confirmPassword") {
        setConfirmPasswordTouched(true);
      }
      return updatedData;
    });
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

    // Check if all fields are completely filled
    if (
      !formData.name ||
      !formData.mobile ||
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

    // Check if the phone number has exactly 10 digits
    if (formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.", {
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

    // Check if the email is in the correct format
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
      // Send the registration data to the server
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/register/${groupId}`,
        {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password,
          empid: formData.empid,
        }
      );

      // Clear the form data
      setFormData({
        name: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
        empid: "",
      });

      // Show success message using toast
      toast.success("Successfully signed up!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#68b545",
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

  const isValidPhoneNumber = phone => {
    // Basic validation: check if the phone number has exactly 10 digits
    return /^\d{10}$/.test(phone);
  };

  const handlePhoneNumberBlur = () => {
    const validPhoneNumber = isValidPhoneNumber(formData.mobile);
    if (!validPhoneNumber) {
      toast.error("Please enter a valid 10-digit phone number.", {
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

  const isValidEmail = email => {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailBlur = () => {
    const validEmail = isValidEmail(formData.email);
    if (!validEmail) {
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
            className={`icon ${formData.phoneNumber ? "active" : ""}`}
          />
          <input
            type="tel"
            id="phoneNumber"
            name="mobile"
            placeholder="Phone Number"
            value={formData.mobile}
            onChange={handleChange}
            onBlur={handlePhoneNumberBlur}
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
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className={`toggle-password-icon ${
              formData.password ? "active" : ""
            }`}
            onClick={toggleShowPassword}
          />
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
        <div className="form-group">
          <FontAwesomeIcon
            icon={faAddressCard}
            className={`icon ${formData.empid ? "active" : ""}`}
          />
          <input
            type="text"
            id="empid"
            name="empid"
            placeholder="Employee ID" // Change the placeholder to "Employee ID"
            value={formData.empid}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <FontAwesomeIcon
            icon={faBuilding}
            className={`icon ${company ? "active" : ""}`}
          />
          <input
            type="text"
            id="company"
            name="company"
            placeholder="Company Name"
            value={company}
            readOnly // Set the input as readOnly to make it non-editable
          />
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

export default GroupSignUp;
