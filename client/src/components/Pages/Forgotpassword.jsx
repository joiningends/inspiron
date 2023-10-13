import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submittedWithoutValue, setSubmittedWithoutValue] = useState(false);

  const handleEmailChange = e => {
    setEmail(e.target.value);
    setSubmittedWithoutValue(false); // Clear the warning when user starts typing
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email) {
      setSubmittedWithoutValue(true);
      return;
    }

    // Send a request to the backend API for password recovery
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success("Password reset email sent.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Failed to send password reset email.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        <p>
          Please enter your email address to receive instructions on how to
          reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          {submittedWithoutValue && (
            <p className="warning">Please fill in the email field.</p>
          )}
          <button type="submit">Send Reset Email</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
