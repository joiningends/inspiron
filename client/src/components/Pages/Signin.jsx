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

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await fetch("http://localhost:8080/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Login successful, extract and store user information and token
        const data = await response.json();
        const { user, token, role } = data;

        // Store the user information and token in localStorage or other secure storage mechanisms
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", JSON.stringify(role));
        localStorage.setItem("token", token);
        // Clear the form data
        setFormData({
          email: "",
          password: "",
        });

        // Redirect to the "/FindTherapist" page
        window.location.href = "/FindTherapist";
      } else {
        // Login failed
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
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
