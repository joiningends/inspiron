import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../redux/Action";
import "./Signin.css";

const Signin = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
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
    console.log(formData);

    // Check if token and user exist in localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      // Check if the email matches
      // Redirect to "/home" page
      window.location.href = "/FindTherapist";
      return; // Stop further execution after redirecting
    } else {
      // User or token not found in localStorage
      console.log("User or token not found in localStorage");
    }

    // Dispatch the login action with the form data
    dispatch(login(formData));

    // Clear the form data
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>Sign In</h2>
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
            // icon={showPassword ? faEyeSlash : faEye}
            className={`toggle-password-icon ${
              formData.password ? "active" : ""
            }`}
            onClick={toggleShowPassword}
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Sign In
        </button>
        <p>
          Don't have an account? <a href="/login">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
