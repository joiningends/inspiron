import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../redux/Action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "./Signin.css";
import Footer from "./Footer";

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
            onBlur={handleInputBlur}
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
        <p>
          <Link to="/forgotpassword">Forgot Password?</Link>{" "}
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signin;
