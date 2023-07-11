import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { FaSearch } from "react-icons/fa";
import inspironLogo from "../components/Pages/inspironLogo.png";

function NavBar() {
  const [click, setClick] = useState(false);
  const storedToken = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = storedToken !== null && storedUser !== null;
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);

  const handleSignOut = () => {
    // Remove token and user info from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

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
                to="/admin-Dashboard"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                AdminD
              </NavLink>
            </li>
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
                Therapist
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
