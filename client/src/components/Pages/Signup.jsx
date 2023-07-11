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

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createUser(formData)); // Dispatch the createUser action with the form data
    console.log(formData);

    // Clear the form data
    setFormData({
      name: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
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
            className={`icon ${formData.phoneNumber ? "active" : ""}`}
          />
          <input
            type="tel"
            id="phoneNumber"
            name="mobile"
            placeholder="Phone Number"
            value={formData.mobile}
            onChange={handleChange}
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
        <button type="submit" onClick={handleSubmit}>
          Sign Up
        </button>
        <p>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
