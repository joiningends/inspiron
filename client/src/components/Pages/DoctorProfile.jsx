import React, { useState, useEffect } from "react";
import "./DoctorProfile.css";
import Education from "./Education";
import achiv from "./achiv.png";
import add from "./add.png";
import minus from "./minus.png";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import LanguageIcon from "@mui/icons-material/Language";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorIcon from "@mui/icons-material/DesktopWindows";
import { FaHeart, FaThumbsUp, FaClock, FaSmile } from "react-icons/fa";
import Footer from "./Footer";

import Button from "@material-ui/core/Button";

import { fetchTherapist, fetchTherapists } from "../redux/Action";

const containerStyle = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
};

const infoBoxStyle = {
  padding: "16px",
  minWidth: "150px",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#68B545", // Background color
  color: "white", // Text color
};

const titleStyle = {
  fontSize: "1.2rem",
  marginBottom: "10px",
};

const listStyle = {
  listStyleType: "none",
  padding: 0,
};

const listItemStyle = {
  fontSize: "1rem",
  margin: "5px 0",
};

const iconStyle = {
  fontSize: "2rem",
};

const DoctorProfile = () => {
  const { id } = useParams(); // Access the therapist ID from the URL parameter
  const dispatch = useDispatch();
  const therapist = useSelector(state => state.therapist);
  const [imageUrl, setImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [availableSession, setAvailableSession] = useState("");

  console.log(therapist);

  const containerStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: "100%",
    overflow: "hidden",

  };
  
  const cardStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "2rem",
    backgroundColor: "#68B545",
    height: "auto",
    width: "90vw",
    maxWidth: "80rem",
    margin: "0 auto",
    marginBottom: "20px",
  };
  
  const imgDivStyle = {
    width: "250px",
    height: "250px",
    overflow: "hidden",
    borderRadius: "2rem",
  };
  
  const doctorImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };
  

  const aboutDivStyle = {
    paddingLeft: "16px",
  };

  const headingStyle = {
    fontWeight: "bold",
  };

  const designationStyle = {
    color: "#777", // You can adjust the color as needed
  };

  const bookNowButtonStyle = {
    color: "white",
    textDecoration: "none",
    borderRadius: "3rem",
  };

  useEffect(() => {
    const fetchTherapistData = async () => {
      await dispatch(fetchTherapist(id)); // Fetch the therapist using the ID
      setIsLoading(false);
    };

    fetchTherapistData();
  }, []);

  useEffect(() => {
    setImageUrl(therapist?.image);
    setAvailableSession(
      therapist?.onlineSessionCount + therapist?.offlineSessionCount
    );
  }, [therapist]);

  const [showOfferings, setShowOfferings] = useState(true);

  const toggleOfferings = () => {
    setShowOfferings(!showOfferings);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!therapist || Object.keys(therapist).length === 0) {
    return <div>No therapist found.</div>;
  }

  return (
    <>
      <Paper style={cardStyle}>
        <div style={{ ...imgDivStyle, width: "40rem" }}>
          <img
            src={imageUrl}
            style={{ ...doctorImgStyle}}
            alt="Therapist"
          />
        </div>
        <div style={aboutDivStyle}>
          <Typography variant="h5" style={headingStyle}>
            {therapist?.name}
          </Typography>
          <Typography variant="body2" style={designationStyle}>
            {therapist?.designation}
          </Typography>
          <Typography variant="body2">{therapist?.about}</Typography>
          <Link to={`/bookaslot/${therapist?._id}`} style={bookNowButtonStyle}>
            <Button
              variant="contained"
              color="primary"
              style={{
                background:
                  "linear-gradient(90deg, #D67449 0.88%, #5179BD 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "3rem",
              }}
            >
              BOOK NOW
            </Button>
          </Link>
        </div>
      </Paper>
      <div className="container2">
        <Education className="education" educationData={therapist?.education} />
        <div className="profileDetails">
          <span>
            <FaHeart className="profileIcons" />
          </span>
          <span className="subDetails">
            <h3>{therapist?.userRating.toFixed(1)}/5</h3>
          </span>
          <span className="lastUserDetailRow">User Rating</span>
        </div>
        <div className="profileDetails">
          <span>
            <FaClock className="profileIcons" />
          </span>
          <span>
            <h3 className="subDetails">{therapist?.offlineSessionCount}</h3>
          </span>
          <span className="lastUserDetailRow">Available Offline Session</span>
        </div>
        <div className="profileDetails">
          <span>
            <FaClock className="profileIcons" />
          </span>
          <span>
            <h3 className="subDetails">{therapist?.onlineSessionCount}</h3>
          </span>
          <span className="lastUserDetailRow">Available Online Sessions</span>
        </div>
        <div className="profileDetails">
          <span>
            <FaClock className="profileIcons" />
          </span>
          <span>
            <h3 className="subDetails">{availableSession}</h3>
          </span>
          <span className="lastUserDetailRow">Total Available Session</span>
        </div>
      </div>
      <div className="achievement-container">
        {therapist?.achievements.map((achievement, index) => (
          <div className="achievement-item" key={index}>
            <div className="achievement-img">
              <img className="img" src={achiv} alt="Achievement" />
            </div>
            <span className="des">{achievement.description}</span>
          </div>
        ))}
      </div>
      <div
        className={`offering ${showOfferings ? "active" : ""}`}
        style={{ width: "90vw" }}
        onClick={toggleOfferings}
      >
        <span className="offeringtext">{therapist?.name}'s offerings</span>
        <span>
          <img
            className="addMinusimg"
            src={showOfferings ? minus : add}
            alt={showOfferings ? "Minus" : "Add"}
          />
        </span>
      </div>

      <div
        className={`allOfferings ${showOfferings ? "show" : ""}`}
        style={{
          width: "90vw",
          display: "grid",
          placeItems: "center",
          marginLeft: "7vw",
        }}
      >
        <Grid
          container
          spacing={2}
          style={{ ...containerStyle, margin: "auto" }}
        >
          <Grid item xs={4}>
            <Paper style={infoBoxStyle}>
              <LanguageIcon style={iconStyle} />
              <Typography variant="h6" style={titleStyle}>
                Languages Known
              </Typography>
              <ul style={listStyle}>
                {therapist.languages.map((language, index) => (
                  <li key={index} style={listItemStyle}>
                    {language}
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper style={infoBoxStyle}>
              <EmojiObjectsIcon style={iconStyle} />
              <Typography variant="h6" style={titleStyle}>
                Expertise
              </Typography>
              <ul style={listStyle}>
                {therapist.expertise.map((expertise, index) => (
                  <li key={index} style={listItemStyle}>
                    {expertise.type.join(", ")}
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper style={infoBoxStyle}>
              <MonitorIcon style={iconStyle} />
              <Typography variant="h6" style={titleStyle}>
                Mode Of Session
              </Typography>
              <ul style={listStyle}>
                {therapist.modeOfSession.map((mode, index) => (
                  <li key={index} style={listItemStyle}>
                    {mode}
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <div
        className="booknowBtnLayout"
        style={{ marginTop: "3rem", width: "90vw" }}
      >
        <div className="booknowBtnLayout1">
          <h3 className="booknowBtnLayouttextheading">
            Connect with all parts of yourself & start new life
          </h3>
        </div>
        <div className="booknowBtnLayout2">
          <p className="booknowBtnLayoutp">
            Discovering the right therapist is key to your mental well-being
            journey. Our service ensures a personalized match with experts
            versed in scientific treatment protocols, including psychometric
            screening and multi-modal psychotherapy. We prioritize your unique
            goals, offering support through tailored self-help toolkits like
            podcasts and articles. Trust us to connect you with a therapist who
            understands and meets your individual needs, creating a
            collaborative and effective path towards mental wellness.
          </p>
        </div>
        <div className="booknowBtnLayout3">
          <Link
            to={`/bookaslot/${therapist._id}`}
            className="therapist-know-more-button"
            style={{
              backgroundColor: "#FFFFFF",
              textDecoration: "none",
              color: "#D67449",
              borderRadius: "2rem",
            }}
          >
            BOOK NOW
          </Link>
        </div>
      </div>
      <Footer style={{ marginTop: "3rem" }} />
    </>
  );
};

export default DoctorProfile;
