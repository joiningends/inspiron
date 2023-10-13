import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

function ResetPasswordPage() {
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewPasswordChange = e => {
    setNewPassword(e.target.value);
    setSubmitted(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const resetToken = token;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        toast.success("Password set successfully.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred while resetting the password.");
    }

    setNewPassword("");
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Set New Password</h2>
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
          {submitted && <p className="success">Password set successfully.</p>}
          <button type="submit">Save</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ResetPasswordPage;
