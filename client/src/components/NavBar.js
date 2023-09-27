import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { FaSearch } from "react-icons/fa";
import inspironLogo from "../components/Pages/inspironLogo.png";

function NavBar() {
  const [click, setClick] = useState(false);
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("role");

  const isLoggedIn = storedToken !== null && storedUser !== null;
  const navigate = useNavigate();
  const userRole = storedUser ? JSON.parse(storedUser) : null;
  console.log(userRole);
  // userRole=JSON.parse(userRole)
  console.log(isLoggedIn);

  const handleClick = () => setClick(!click);

  const handleSignOut = () => {
    // Remove token and user info from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("groupid");
    localStorage.removeItem("assessment");
    console.log(localStorage.getItem("groupid"));
    localStorage.removeItem("therapists");
    localStorage.removeItem("therapistsData");

    // Redirect to login page
    navigate("/login");
  };
  const empid = JSON.parse(localStorage.getItem("empid"));

  // Check if empid is null or has a value
  const shouldShowComponent = empid === null;

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            <span
              style={{ backgroundColor: "#68B545", display: "inline-block" }}
            >
              <img
                src={inspironLogo}
                alt="logo"
                style={{ objectFit: "contain", width: "10rem", height: "3rem" }}
              />
            </span>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            {/* Common routes visible to all users */}
            {isLoggedIn && userRole === "user" && (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/assessment"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Assessment
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/FindTherapist"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Find Your Therapist
                    <FaSearch className="search-icon" />
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/Profile"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/Appointments"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Appointments
                  </NavLink>
                </li>
                {shouldShowComponent && (
                  <li className="nav-item">
                    <NavLink
                      exact
                      to="/PendingPayments"
                      activeClassName="active"
                      className="nav-links"
                      onClick={handleClick}
                    >
                      Pending Payment
                    </NavLink>
                  </li>
                )}
              </>
            )}

            {/* Routes visible to "therapist" user role */}
            {isLoggedIn && userRole === "therapist" && (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/appointment"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Appointment
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/profile"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/therapists"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/patientPage"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Patient Page
                  </NavLink>
                </li>
              </>
            )}

            {/* Routes visible to "admin" user role */}
            {isLoggedIn && userRole === "admin" && (
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/admin-Create-Assessment"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Create Assessment
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/admin-Dashboard"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Admin Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/admin-patient-details"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Patient Page
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/Group"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Group
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/admin-setting"
                    activeClassName="active"
                    className="nav-links"
                    onClick={handleClick}
                  >
                    Setting
                  </NavLink>
                </li>
              </>
            )}

            {/* Render Login or Sign Out based on login status */}
            <li className="nav-item">
              {isLoggedIn ? (
                <NavLink
                  exact
                  to="/login"
                  activeClassName="active"
                  className="nav-links"
                  onClick={() => {
                    handleSignOut();
                    handleClick();
                  }}
                >
                  Sign Out
                </NavLink>
              ) : (
                <NavLink
                  exact
                  to="/login"
                  activeClassName="active"
                  className="nav-links"
                  onClick={handleClick}
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>

          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
