import React, { useState, useEffect } from "react";
import "./BookTime.css";
import MyImg from "./myimg.jpg";
import favorite from "./white-star.png";
import thubmsup from "./like-white.png";
import clock from "./white-clock.png";
import happy from "./white-happy.png";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapist } from "../redux/Action";

const datesPerPage = 8; // Set the desired number of dates per page

function BookTime() {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams(); // Access the therapist ID from the URL parameter
  const dispatch = useDispatch();
  const therapist = useSelector(state => state.therapist);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTherapist(id)); // Fetch the therapist using the ID
  }, [dispatch, id]);

  useEffect(() => {
    if (therapist !== null) {
      setIsLoading(false);
    }
  }, [therapist]);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching the therapist data
  }

  console.log(therapist);

  if (!therapist) {
    return <div>No therapist found.</div>; // Display a message if therapist is empty
  }

  const availability = therapist.availability;
  const dates = Object.keys(availability);

  // Calculate the start and end indexes for the current page
  const startIndex = (currentPage - 1) * datesPerPage;
  const endIndex = startIndex + datesPerPage;

  // Get the dates for the current page
  const datesForCurrentPage = dates.slice(startIndex, endIndex);

  const totalPages = Math.ceil(dates.length / datesPerPage);

  const goToPage = page => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="booktime-container1">
        <div className="booktime-imgDiv">
          <img
            src={therapist.image}
            className="booktime-doctorImg"
            alt="Therapist"
          />
        </div>
        <div className="booktime-aboutDiv">
          <div className="booktime-containerr2">
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={favorite}
                  className="booktime-profileIcons"
                  alt="Favorite"
                />
              </span>
              <span className="booktime-subDetails">
                <h3>{therapist.userRating}/5</h3>
              </span>
              <span className="booktime-lastUserDetailRow">User Rating</span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={thubmsup}
                  className="booktime-profileIcons"
                  alt="Thumbs Up"
                />
              </span>
              <span>
                <h3 className="subDetails">
                  {therapist.usersRecommended.length}
                </h3>
              </span>
              <span
                className="lastUserDetailRow"
                style={{ textAlign: "center" }}
              >
                User Recommended
              </span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={clock}
                  className="booktime-profileIcons"
                  alt="Clock"
                />
              </span>
              <span>
                <h3 className="subDetails">{therapist.availableSessions}</h3>
              </span>
              <span className="lastUserDetailRow">Available Sessions</span>
            </div>
            <div className="booktime-profileDetails">
              <span>
                <img
                  src={happy}
                  className="booktime-profileIcons"
                  alt="Happy"
                />
              </span>
              <span>
                <h3 className="subDetails">{therapist.userReviews.length}</h3>
              </span>
              <span className="lastUserDetailRow1">User Reviews</span>
            </div>
          </div>
        </div>
      </div>
      <div className="booktime-parentcard">
        <span className="booktime-title">
          Book Your Session With {therapist.name}
        </span>
        {dates.length === 0 ? (
          <div className="noAvailability">No availability found.</div>
        ) : (
          <div className="booktime-pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => goToPage(index + 1)}
                style={{ backgroundColor: "#68b545" }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
        <div className="booktime-containerr">
          <div className="booktime-miniContainer">
            {datesForCurrentPage.map(date => (
              <div className="booktime-dateColumn" key={date}>
                <div className="booktime-dateSelect">{formatDate(date)}</div>
                {availability[date].map(time => (
                  <div className="booktime-time" key={time}>
                    {time}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="booknowBtnLayout">
        <div className="booknowBtnLayout1">
          <h3 className="booknowBtnLayouttextheading">
            Looking for a different services or therapist?
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
            to={`/FindTherapist`}
            className="therapist-know-more-button"
            style={{
              backgroundColor: "#FFFFFF",
              textDecoration: "none",
              color: "#D67449",
              borderRadius: "2rem",
            }}
          >
            CLICK HERE
          </Link>
        </div>
      </div>
    </>
  );
}

function formatDate(date) {
  const inputDate = new Date(date);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate = `${daysOfWeek[inputDate.getDay()]}, ${
    monthsOfYear[inputDate.getMonth()]
  } ${inputDate.getDate()}`;
  return formattedDate;
}

export default BookTime;
