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
                <ListItemButton
                  component={NavLink}
                  to="/"
                  sx={{ color: "#D67449", fontSize:"1rem",minWidth: "auto", width: "80px" }}
                >
                  <ListItemText
                    primary="Home"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/assessment"
                  sx={{ color: "#D67449", minWidth: "auto", width: "100px" }}
                >
                  <ListItemText
                    primary="Assessment"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/FindTherapist"
                  sx={{ color: "#D67449", minWidth: "auto", width: "200px" }}
                >
                  <ListItemIcon>
                    <SearchIcon
                      fontSize="small"
                      style={{ marginRight: "5px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Find&nbsp;Therapist"
                    primaryTypographyProps={{
                      variant: "body2",
                      whiteSpace: "nowrap",
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Profile"
                  sx={{ color: "#D67449", minWidth: "auto", width: "100px" }}
                >
                  <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Appointments"
                  sx={{ color: "#D67449", minWidth: "auto", width: "120px" }}
                >
                  <ListItemText
                    primary="Appointments"
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItemButton>
                {shouldShowComponent && (
                  <ListItemButton
                    component={NavLink}
                    to="/PendingPayments"
                    sx={{ color: "#D67449", minWidth: "auto", width: "140px" }}
                  >
                    <ListItemText
                      primary="Pending&nbsp;Payment"
                      primaryTypographyProps={{
                        variant: "body2",
                        whiteSpace: "nowrap",
                      }}
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
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Appointment" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/profile"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/therapists"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/patientPage"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Patient Page" />
                </ListItemButton>
              </>
            )}
            {isLoggedIn && userRole === "admin" && (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/admin-Create-Assessment"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Assessment" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-Dashboard"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Therapists" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-patient-details"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Patient Page" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Group"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Group" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-setting"
                  selected
                  sx={{ "&.Mui-selected": { color: "#D67449" } }}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Setting" />
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
              to={isLoggedIn ? "/login" : null}
              onClick={isLoggedIn ? handleSignOut : null}
            >
              <ListItemIcon>
                {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
              </ListItemIcon>
              <ListItemText primary={isLoggedIn ? "Sign Out" : "Login"} />
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
          <List>
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
                  <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/assessment"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Assessment" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/FindTherapist"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Find Your Therapist" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Profile"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Appointments"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Appointments" />
                </ListItemButton>
                {shouldShowComponent && (
                  <ListItemButton
                    component={NavLink}
                    to="/PendingPayments"
                    onClick={handleDrawerToggle}
                  >
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText primary="Pending Payment" />
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
                  <ListItemText primary="Appointment" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/profile"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/therapists"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/patientPage"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Patient Page" />
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
                  <ListItemText primary="Create Assessment" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-Dashboard"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Therapists" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-patient-details"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Patient Page" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/Group"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Group" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin-setting"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Setting" />
                </ListItemButton>
              </>
            )}
          </List>
          <List>
            <ListItemButton
              component={isLoggedIn ? NavLink : "div"}
              to={isLoggedIn ? "/login" : null}
              onClick={isLoggedIn ? handleSignOut : null}
            >
              <ListItemIcon>
                {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
              </ListItemIcon>
              <ListItemText primary={isLoggedIn ? "Sign Out" : "Login"} />
            </ListItemButton>
          </List>
        </Drawer>
      </Box>
    </Box>
  );
}

export default NavBar;
