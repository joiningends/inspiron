import React, { useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import axios from "axios";

const RatingSystem = ({ userId, lastTherapist }) => {
  const [open, setOpen] = useState(true);
  const [userRating, setUserRating] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
  };

  const handleRatingSubmit = () => {
    // Handle the rating submission here
    const therapistId = lastTherapist; // Replace with the actual therapist ID

    const data = {
      rating: userRating,
    };

    axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/${therapistId}/${userId}/update-rating`,
        data
      )
      .then(response => {
        console.log("Rating submitted:", userRating);
        handleClose();
      })
      .catch(error => {
        console.error("Error submitting rating:", error);
      });
  };

  const handleCancel = () => {
    // Handle the cancel action here
    const therapistId = lastTherapist; // Replace with the actual therapist ID

    axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/${therapistId}/${userId}/update-rating`
      )
      .then(response => {
        console.log("Rating canceled");
        handleClose();
      })
      .catch(error => {
        console.error("Error canceling rating:", error);
      });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <Box p={2}>
          <Typography variant="h6">
            Rate your experience with our therapist.
          </Typography>
          <Rating
            name="user-rating"
            value={userRating}
            precision={0.5}
            onChange={handleRatingChange}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            sx={{ fontSize: "2rem", mt: 2 }}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRatingSubmit}
              style={{
                marginRight: "10px",
                backgroundColor: "#68B545",
                color: "white",
              }}
            >
              Submit Rating
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              style={{
                marginRight: "10px",
                backgroundColor: "#D67449",
                color: "white",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default RatingSystem;
