import React, { useState, useEffect } from "react";
import "./DoctorProfile.css";
import Education from "./Education";
import achiv from "./achiv.png";
import add from "./add.png";
import minus from "./minus.png";
import video from "./monitor.png";
import arrow from "./arrow.png";
import favorite from "./favorite.svg";
import thubmsup from "./thumbs-up.png";
import clock from "./clock.png";
import happy from "./emoji-happy.png";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapist, fetchTherapists } from "../redux/Action";

const DoctorProfile = () => {
  const { id } = useParams(); // Access the therapist ID from the URL parameter
  const dispatch = useDispatch();
  const therapist = useSelector(state => state.therapist);
  const [imageUrl, setImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTherapistData = async () => {
      await dispatch(fetchTherapist(id)); // Fetch the therapist using the ID
      setIsLoading(false);
    };

    fetchTherapistData();
  }, []);

  useEffect(() => {
    setImageUrl(therapist?.image);
    console.log(therapist?.image);
    console.log("hello");
  }, [therapist]);

  console.log(therapist);

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
      <div className="container1">
        <div
          className="imgDiv"
          style={{ width: "10rem", height: "12rem", overflow: "hidden" }}
        >
          <img
            src={`data:${imageUrl?.contentType};base64,${imageUrl?.data}`}
            className="doctorImg"
            alt="Rounded"
          />
        </div>

        <div className="aboutDiv">
          <h5 className="heading">{therapist?.name}</h5>
          <span className="designation">{therapist?.designation}</span>
          <p className="aboutDoctor">{therapist?.about}</p>
        </div>
        <div className="profile-div2">
          <Link
            to={`/bookaslot/${therapist?._id}`}
            className="therapist-know-more-button"
            style={{
              background: "linear-gradient(90deg, #D67449 10.9%, #5179BD 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "3rem",
            }}
          >
            BOOK NOW
          </Link>
        </div>
      </div>
      <div className="container2">
        <Education className="education" educationData={therapist?.education} />
        <div className="profileDetails">
          <span>
            <img src={favorite} className="profileIcons" alt="Favorite" />
          </span>
          <span className="subDetails">
            <h3>{therapist?.userRating}/5</h3>
          </span>
          <span className="lastUserDetailRow">User Rating</span>
        </div>
        <div className="profileDetails">
          <span>
            <img src={thubmsup} className="profileIcons" alt="Thumbs Up" />
          </span>
          <span>
            <h3 className="subDetails">{therapist?.usersRecommended.length}</h3>
          </span>
          <span className="lastUserDetailRow">User Recommended</span>
        </div>
        <div className="profileDetails">
          <span>
            <img src={clock} className="profileIcons" alt="Clock" />
          </span>
          <span>
            <h3 className="subDetails">{therapist?.availableSessions}</h3>
          </span>
          <span className="lastUserDetailRow">Available Sessions</span>
        </div>
        <div className="profileDetails">
          <span>
            <img src={happy} className="profileIcons" alt="Happy" />
          </span>
          <span>
            <h3 className="subDetails">{therapist?.userReviews.length}</h3>
          </span>
          <span className="lastUserDetailRow">User Reviews</span>
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
        onClick={toggleOfferings}
      >
        <span className="offeringtext">Ashutosh's offerings</span>
        <span>
          <img
            className="addMinusimg"
            src={showOfferings ? minus : add}
            alt={showOfferings ? "Minus" : "Add"}
          />
        </span>
      </div>

      <div className={`allOfferings ${showOfferings ? "show" : ""}`}>
        <div className="mode">
          <span>
            <img src={video} alt="Video" />
          </span>
          <div>
            <div className="mode1">
              <h3 className="modeTitle">Mode of Therapy</h3>
              <span className="modeImg">
                <img src={arrow} className="modeImage" alt="Arrow" />
              </span>
            </div>
            <div className="modeChoice">
              {therapist?.modeOfSession.map((mode, index) => (
                <span className="session-mode" key={index}>
                  {mode}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="booknowBtnLayout" style={{ marginTop: "3rem" }}>
        <div className="booknowBtnLayout1">
          <h3 className="booknowBtnLayouttextheading">
            Connect with all parts of yourself & start new life
          </h3>
        </div>
        <div className="booknowBtnLayout2">
          <p className="booknowBtnLayoutp">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            perferendis deleniti illum necessitati voluptates ipsum, ratione
            dolorum veritatis minus mollitia placeat.
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
    </>
  );
};

export default DoctorProfile;
