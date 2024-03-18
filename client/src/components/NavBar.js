import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Drawer, ListItemButton } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import yourLogo from "./Pages/Artboard 2.png";
import axios from "axios";

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("role");

  const isLoggedIn = storedToken !== null && storedUser !== null;
  const navigate = useNavigate();
  const userRole = storedUser ? JSON.parse(storedUser) : null;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("groupid");
    localStorage.removeItem("assessment");
    localStorage.removeItem("therapists");
    localStorage.removeItem("therapistsData");
    navigate("/login");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  let groupId = localStorage.getItem("groupid");
  const [dataCompany, setDataCompany] = useState(false);
  console.log(dataCompany);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only make the request if groupId is not null or undefined
        if (groupId !== null) {
          // Remove quotes around groupId
          const groupVal = groupId.replace(/"/g, "");

          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/clients/group/${groupVal}`
          );
          console.log(response);
          // Handle the successful response here
          setDataCompany(response.data.companypayment);
        }
      } catch (error) {
        // Handle errors here
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [groupId]);

  const empid = JSON.parse(localStorage.getItem("empid"));
  const shouldShowComponent = empid === null;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const linkStyle = {
    textDecoration: "none",
    color: "white",
    padding: "10px 20px",
    backgroundColor: "#D67449",
    borderRadius: "1rem",
    transition: "background-color 0.3s, color 0.3s",
    ":hover": {
      backgroundColor: "#E0E0E0",
      color: "#68B545",
    },
  };

  const activeLinkStyle = {
    backgroundColor: "#D67449",
    color: "#68B545",
  };

  return (
    <Box sx={{ flexGrow: 1 }} style={{ marginBottom: "2rem" }}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            <NavLink to="/" style={{ textDecoration: "none", color: "black" }}>
              <div
                style={{
                  width: "150px",
                  height: "60px", // Set the desired height
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // Center the image horizontally
                  overflow: "hidden", // Hide any overflow from the image
                }}
              >
                <img
                  src={yourLogo}
                  alt="Your Logo"
                  style={{
                    width: "20rem", // Take up 100% of the container width
                    height: "auto", // Automatically adjust the height
                    objectFit: "contain", // Use 'contain' to fit the image within the container
                  }}
                />
              </div>
            </NavLink>
          </Typography>

          <List
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              gap: 2,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {isLoggedIn && userRole === "user" && (
              <>
                <nav>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ display: "inline", marginRight: "10px" }}>
                      <NavLink
                        to="/"
                        style={linkStyle}
                        activeStyle={activeLinkStyle}
                      >
                        Home
                      </NavLink>
                    </li>
                    <li style={{ display: "inline", marginRight: "10px" }}>
                      <NavLink
                        to="/assessment"
                        style={linkStyle}
                        activeStyle={activeLinkStyle}
                      >
                        Assessment
                      </NavLink>
                    </li>
                    <li style={{ display: "inline", marginRight: "10px" }}>
                      <NavLink
                        to="/FindTherapist"
                        style={linkStyle}
                        activeStyle={activeLinkStyle}
                      >
                        Find Therapist
                      </NavLink>
                    </li>
                    <li style={{ display: "inline", marginRight: "10px" }}>
                      <NavLink
                        to="/Profile"
                        style={linkStyle}
                        activeStyle={activeLinkStyle}
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li style={{ display: "inline", marginRight: "10px" }}>
                      <NavLink
                        to="/Appointments"
                        style={linkStyle}
                        activeStyle={activeLinkStyle}
                      >
                        Appointments
                      </NavLink>
                    </li>
                    {!dataCompany && (
                      <li style={{ display: "inline", marginRight: "10px" }}>
                        <NavLink
                          to="/PendingPayments"
                          style={linkStyle}
                          activeStyle={activeLinkStyle}
                        >
                          Pending Payment
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </nav>
              </>
            )}
            {isLoggedIn && userRole === "therapist" && (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/appointment"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Appointment"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/profile"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Profile"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/therapists"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Dashboard"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/patientPage"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Patient Page"
                  />
                </ListItemButton>
              </>
            )}
            {isLoggedIn && userRole === "admin" && (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/admin-Create-Assessment"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Create Assessment"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-Dashboard"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Therapists"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-patient-details"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Patient Page"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Group"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Group"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-setting"
                  selected
                  sx={{ "&.Mui-selected": { color: "#68B545" } }}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Setting"
                  />
                </ListItemButton>
              </>
            )}
          </List>
          <List
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              gap: 2,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <ListItemButton
              component={isLoggedIn ? NavLink : "div"}
              to={isLoggedIn ? "/login" : "/signin"}
              onClick={isLoggedIn ? handleSignOut : handleSignIn}
            >
              <ListItemIcon>
                {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: "body2",
                  whiteSpace: "nowrap",
                  color: "#68B545",
                }}
                primary={isLoggedIn ? "Sign Out" : "Login"}
              />
            </ListItemButton>
          </List>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="temporary"
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <List style={{ width: "13rem" }}>
            {isLoggedIn && userRole === "user" && (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Home"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/assessment"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Assessment"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/FindTherapist"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Find Your Therapist"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Profile"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Profile"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Appointments"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Appointments"
                  />
                </ListItemButton>
                {dataCompany && (
                  <ListItemButton
                    component={NavLink}
                    to="/PendingPayments"
                    onClick={handleDrawerToggle}
                  >
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        variant: "body2",
                        whiteSpace: "nowrap",
                        color: "#68B545",
                      }}
                      primary="Pending Payment"
                    />
                  </ListItemButton>
                )}
              </>
            )}
            {isLoggedIn && userRole === "therapist" && (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/appointment"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Appointment"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/profile"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Profile"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/therapists"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Dashboard"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/patientPage"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Patient Page"
                  />
                </ListItemButton>
              </>
            )}
            {isLoggedIn && userRole === "admin" && (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/admin-Create-Assessment"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Create Assessment"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-Dashboard"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Therapists"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-patient-details"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#68B545",
                    }}
                    primary="Patient Page"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Group"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "white",
                      backgroundColor: "#68B545",
                    }}
                    primary="Group"
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-setting"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                      color: "#68B545",
                    }}
                    primary="Setting"
                  />
                </ListItemButton>
              </>
            )}
          </List>
          <List>
            <ListItemButton
              component={isLoggedIn ? NavLink : "div"}
              to={isLoggedIn ? "/login" : "/signin"}
              onClick={isLoggedIn ? handleSignOut : handleSignIn}
            >
              <ListItemIcon>
                {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  variant: "body2",
                  whiteSpace: "nowrap",
                  color: "#68B545",
                }}
                primary={isLoggedIn ? "Sign Out" : "Login"}
              />
            </ListItemButton>
          </List>
        </Drawer>
      </Box>
    </Box>
  );
}

export default NavBar;
