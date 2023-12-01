import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RatingIcon from "./starForKnowMorePage.png";
import OnlineIcon from "./online-meetingForKnowMorePage.png";
import TotalSessionIcon from "./interactionsForKnowMorePage.png";
import OfflineIcon from "./meetingImageForKnowMorepage.png";
import ModeOfMeetingIcon from "./meetingForKnowMorePage.png";
import ExpertiseIcon from "./experienceForKnowMorePage.png";
import LanguagesIcon from "./languageforKnowMorePage.png";
import { fetchTherapist } from "../redux/Action";
import Footer from "./Footer";
import { Box } from "@mui/material";
import inspironBackgroundImage from "./inspironBackgroundImage.png";

const Separator = () => (
  <div
    style={{
      borderRight: "1px solid #999",
      height: "100%",
      margin: "0 15px",
    }}
  />
);

const SmallBox = ({ icon, title, content }) => (
  <div
    className="therapy-box"
    style={{
      border: "1px solid #999",
      padding: "10px",
      textAlign: "center",
      borderRadius: "5px",
      marginBottom: "10px",
    }}
  >
    <img
      src={icon}
      alt={`${title} Icon`}
      className="session-icon"
      style={{ height: "30px", width: "30px", marginBottom: "5px" }}
    />
    <Typography
      variant="body2"
      style={{
        fontFamily: "Poppins, sans-serif",
        color: "black",
        fontSize: "0.8rem",
        textAlign: "left",
        fontWeight: "500",
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="body2"
      style={{
        fontFamily: "Poppins, sans-serif",
        color: "#5179BD",
        fontSize: "0.8rem",
        fontWeight: "700",
      }}
    >
      {content}
    </Typography>
  </div>
);

const DoctorProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const therapist = useSelector(state => state.therapist);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const boxStyle = {
    display: "flex",
    backgroundColor: "#68B545",
    color: "white",
    padding: "10px",
    borderRadius: "1rem",
    width: "100%",
  };

  const iconStyle = {
    width: "5rem",
    marginRight: "4px",
  };

  const contentStyle = {
    width: "100%",
    padding: "10px",
    color: "white",
  };

  const borderDivStyle = {
    margin: "0.3rem",
    display: "flex", // Display values right next to each other
    flexWrap: "wrap", // Allow content to wrap onto the next line if it doesn't fit
    color: "white",
  };

  const borderDivStylee = {
    border: "1px solid white", // Separate border for each value
    margin: "0.2rem",
    display: "flex", // Display values right next to each other
    fontSize: "0.8rem",
    padding: "0.2rem",
    color: "white",
    borderRadius: "1rem",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "2rem",
    background: "linear-gradient(90deg, #D67449 0.88%, #5179BD 100%)",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
    marginTop: "3rem",
    borderRadius: "1rem",
    margin: "1rem",
  };

  const textContainerStyle = {
    flex: 1,
    marginRight: "16px",
  };

  const buttonStyle = {
    marginLeft: "16px",
  };

  const titleStyle = {
    fontWeight: 900,
    fontSize: "1.2rem",
  };

  const mainTextStyle = {
    color: "white",
    textAlign: "justify", // Added text justification
    marginRight: "1rem",
    marginLeft: "1rem",
  };

  useEffect(() => {
    const fetchTherapistData = async () => {
      await dispatch(fetchTherapist(id));
      setIsLoading(false);
    };

    fetchTherapistData();
  }, [dispatch, id]);

  useEffect(() => {
    setImageUrl(therapist?.image);
  }, [therapist]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!therapist || Object.keys(therapist).length === 0) {
    return <div>No therapist found.</div>;
  }

  const educationData = therapist.education || [];

  return (
    <>
      <Paper
        elevation={3}
        style={{
          marginTop: "-2rem",
          padding: 20,
          backgroundColor: "#68B545",
          marginBottom: 20,
          position: "relative",
          backgroundImage: `url(${inspironBackgroundImage}), url(${inspironBackgroundImage})`,
          backgroundPosition: "0.19rem 2.5rem, 70.50rem -5rem", // Adjusted positions for each image
          backgroundRepeat: "no-repeat",
          backgroundSize: "20% auto, 20% auto", // Adjusted sizes for each image
        }}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={5} sm={4}>
            <img
              src={imageUrl}
              alt={therapist.name}
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "13rem",
                borderRadius: "25px",
              }}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <div>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: "white",
                  fontSize: "1.5rem",
                  textAlign: "left",
                  fontWeight: "700",
                }}
              >
                {"Hi! I am "}
                {therapist.name}
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: "white",
                  fontSize: "1.25rem",
                  textAlign: "left",
                }}
              >
                {therapist.therapisttype}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: "white",
                  fontSize: "0.8rem",
                  textAlign: "justify",
                  maxWidth: "600px",
                }}
              >
                {therapist.about}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} sm={3} style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              href={`/bookaslot/${therapist?._id}`}
              target="_blank"
              style={{
                width: "40%",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.9rem",
                background:
                  "linear-gradient(90deg, #D67449 10.9%, #5179BD 100%)",
                borderRadius: "1rem",
                padding: "0.6rem",
                color: "white",
              }}
            >
              Book Now
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} style={{ padding: 20, marginTop: "-1rem" }}>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={12} sm={5} style={{ width: "60%" }}>
            {educationData.length > 0 ? (
              <div className="education-container" style={{ width: "70%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "black",
                    fontSize: "1.2rem",
                    textAlign: "left",
                    fontWeight: "700",
                  }}
                >
                  Qualification
                </Typography>
                <div className="education-details">
                  {educationData.map((education, index) => (
                    <div className="education-card" key={index}>
                      <Typography
                        variant="body1"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "1rem",
                          textAlign: "left",
                          color: "#5179BD",
                        }}
                      >
                        {education.collegeName}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          color: "black",
                          fontSize: "0.9rem",
                          textAlign: "left",
                        }}
                      >
                        {education.educationLevel}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Typography
                variant="body1"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: "black",
                  fontSize: "1rem",
                  textAlign: "left",
                }}
              >
                No data to show.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={7}>
            <div
              className="rating-session-container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="rating-section">
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "black",
                    fontSize: "1.2rem",
                    textAlign: "left",
                    fontWeight: "500",
                  }}
                >
                  Rating
                </Typography>
                <Separator />
                <img
                  src={RatingIcon}
                  alt="Rating Icon"
                  className="session-icon"
                  style={{ height: "40px", width: "40px" }}
                />
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#5179BD",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  {therapist.userRating}/5
                </Typography>
              </div>
              <div className="session-info">
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "black",
                    fontSize: "1.2rem",
                    textAlign: "left",
                    fontWeight: "500",
                  }}
                >
                  Offline Sessions
                </Typography>
                <Separator />
                <img
                  src={OfflineIcon}
                  alt="Offline Sessions Icon"
                  className="session-icon"
                  style={{ height: "40px", width: "40px" }}
                />
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#5179BD",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  {therapist.offlineSessionCount}
                </Typography>
              </div>

              <div className="session-info">
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "black",
                    fontSize: "1.2rem",
                    textAlign: "left",
                    fontWeight: "500",
                  }}
                >
                  Online Sessions
                </Typography>
                <Separator />
                <img
                  src={OnlineIcon}
                  alt="Online Sessions Icon"
                  className="session-icon"
                  style={{ height: "40px", width: "40px" }}
                />
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#5179BD",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  {therapist.onlineSessionCount}
                </Typography>
              </div>

              <div className="session-info">
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "black",
                    fontSize: "1.2rem",
                    textAlign: "left",
                    fontWeight: "500",
                  }}
                >
                  Total Sessions
                </Typography>
                <Separator />
                <img
                  src={TotalSessionIcon}
                  alt="Total Sessions Icon"
                  className="session-icon"
                  style={{ height: "40px", width: "40px" }}
                />
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#5179BD",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  {therapist.onlineSessionCount + therapist.offlineSessionCount}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography
            variant="h6"
            gutterBottom
            style={{
              fontFamily: "Poppins, sans-serif",
              color: "black",
              fontSize: "1.2rem",
              textAlign: "left",
              fontWeight: "800", // More weight for the heading
              marginTop: "20px",
              border: "1px solid #68B545",
              borderRadius: "1rem",
              padding: "1rem",
            }}
          >
            {`${therapist.name}'s Offerings`}
          </Typography>
        </Grid>

        {/* Mode of Therapy */}
        <Grid item xs={4} sm={4} style={{ marginLeft: "1rem" }}>
          <div style={boxStyle}>
            <div style={iconStyle}>
              <img
                src={ModeOfMeetingIcon}
                alt="Mode of Therapy Icon"
                style={{ width: "100%" }}
              />
            </div>
            <div style={contentStyle}>
              <Typography
                variant="h6"
                style={{
                  marginBottom: "10px",
                  fontWeight: "600",
                  textAlign: "left",
                  color: "white",
                }}
              >
                Mode of Therapy
              </Typography>

              <div style={borderDivStyle}>
                {therapist.modeOfSession.map((mode, index) => (
                  <div key={index} style={borderDivStylee}>
                    {mode}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>

        {/* Expertise */}
        <Grid item xs={4} sm={4}>
          <div style={boxStyle}>
            <div style={iconStyle}>
              <img
                src={ExpertiseIcon}
                alt="Expertise Icon"
                style={{ width: "100%" }}
              />
            </div>
            <div style={contentStyle}>
              <Typography
                variant="h6"
                style={{
                  marginBottom: "10px",
                  fontWeight: "600",
                  textAlign: "left",
                  color: "white",
                }}
              >
                Expertise
              </Typography>
              <div style={borderDivStyle}>
                {therapist.expertise.map((item, index) => (
                  <div key={index} style={borderDivStylee}>
                    {item.type.join(", ")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>

        {/* Languages Known */}
        <Grid item xs={4} sm={3}>
          <div style={boxStyle}>
            <div style={iconStyle}>
              <img
                src={LanguagesIcon}
                alt="Languages Known Icon"
                style={{ width: "100%" }}
              />
            </div>
            <div style={contentStyle}>
              <Typography
                variant="h6"
                style={{
                  marginBottom: "10px",
                  fontWeight: "600",
                  textAlign: "left",
                  color: "white",
                  width: "100%",
                }}
              >
                Languages Known
              </Typography>
              <div style={borderDivStyle}>
                {therapist.languages.map((language, index) => (
                  <div key={index} style={borderDivStylee}>
                    {language}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      <Box style={containerStyle}>
        <Typography variant="h6" style={{ ...titleStyle, color: "white" }}>
          Connect with all parts of yourself & start new life
        </Typography>
        <Box style={textContainerStyle}>
          <Typography variant="body1" style={{ ...mainTextStyle }}>
            Discovering the right therapist is key to your mental well-being
            journey. Our service ensures a personalized match with experts
            versed in scientific treatment protocols, including psychometric
            screening and multi-modal psychotherapy. We prioritize your unique
            goals, offering support through tailored self-help toolkits like
            podcasts and articles. Trust us to connect you with a therapist who
            understands and meets your individual needs, creating a
            collaborative and effective path towards mental wellness.
          </Typography>
        </Box>
        <Button
          href={`/bookaslot/${therapist?._id}`}
          variant="contained"
          style={{
            ...buttonStyle,
            fontFamily: "Poppins, sans-serif",
            padding: "0.9rem",
            borderRadius: "1rem",
            backgroundColor: "white",
            color: "#D67449",
          }}
        >
          Book Now
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default DoctorProfile;
