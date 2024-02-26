import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../redux/Action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "./Signin.css";
import wheel from "./inspironwhitewheel.png";
import wheell from "./inspironwhitewheel2.png";
import Footer from "./Footer";
import lock from "./padlockForSignUpPage.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import email from "./emailForSignUpPage.png";

const Signin = () => {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputFocus = () => {
    setShowPassword(true);
  };

  const handleInputBlur = () => {
    setShowPassword(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#ff7f50",
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
      console.log(formData);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log(response);
      if (response.ok) {
        const data = await response.json();

        toast.success("Login successful.", {
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
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", JSON.stringify(data.role));
        localStorage.setItem("empid", JSON.stringify(data.empid));
        localStorage.setItem("groupid", JSON.stringify(data.groupid));
        localStorage.setItem("userId", JSON.stringify(data.userId));
        localStorage.setItem("token", data.token);

        const userRole = localStorage.getItem("role");
        const parsedUserRole = JSON.parse(userRole);

        setFormData({
          email: "",
          password: "",
        });

        const savedGroupid = JSON.parse(localStorage.getItem("groupid"));
        const redirectPath = savedGroupid === null ? "/" : "/";

        if (parsedUserRole === "user") {
          window.location.href = "/";
        } else if (parsedUserRole === "therapist") {
          window.location.href = "/therapists";
        } else if (parsedUserRole === "admin") {
          window.location.href = "/admin-Dashboard";
        }
      } else {
        toast.error(
          "Login failed. Please check your credentials and try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              background: "#ff7f50",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "4px",
              padding: "12px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#ff7f50",
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
    <div className="signin-container">
      <img
        src={wheel}
        alt="wheel"
        className="star-icon"
        style={{
          width: "10vw",
          height: "25vh",
          position: "absolute",
          top: 0,
          left: -10,
          margin: "10px",
          zIndex:1,
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
          zIndex:1,
        }}
      />
      <div className="signin-form" style={{zIndex:"100"}}>
        <h2>Sign In</h2>
        <div className="form-group">
          <img
            src={email}
            alt="email"
            className={`icon ${formData.email ? "active" : ""}`}
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleInputBlur}
            required
          />
        </div>
        <div className="form-group">
          <img
            src={lock}
            alt="lock"
            className={`icon ${formData.password ? "active" : ""}`}
          />
          <div style={{ position: "relative", width: "80vw" }}>
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
              style={{ width: "100%", paddingRight: "2.5rem" }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8 rem", // Adjust the font size based on viewport width
              }}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
        </div>
        <button type="submit" onClick={handleSubmit}>
          Sign In
        </button>
        <p>
          Don't have an account? <a href="/login">Sign Up</a>
        </p>
        <p>
          <Link to="/forgotpassword">Forgot Password?</Link>{" "}
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signin;
