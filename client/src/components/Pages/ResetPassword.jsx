import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setSubmitted(false);
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== repeatPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Password validation and reset logic
    // ... rest of the code ...

    // Clear form fields after submission
    setNewPassword("");
    setRepeatPassword("");
    setSubmitted(true);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
              required
            />
          </div>
          {submitted && <p className="success">Password reset successfully.</p>}
          <button type="submit">Reset Password</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
