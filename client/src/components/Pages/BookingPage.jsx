import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const containerStyle = {
  padding: "20px",
  borderRadius: "10px",
  margin: "20px auto",
  maxWidth: "600px",
  background: "linear-gradient(to bottom, #68B545, #5179BD)",
  boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)",
  color: "#fff",
  fontFamily: "'Roboto', sans-serif",
};

const headerStyle = {
  background: "#fff",
  color: "#5179BD",
  padding: "10px 20px",
  borderRadius: "10px 10px 0 0",
  fontFamily: "'Montserrat', sans-serif",
};

const buttonStyle = {
  background: "#68B545",
  color: "#fff",
  marginTop: "20px",
  transition: "background 0.3s ease-in-out",
  "&:hover": {
    background: "#4C9141",
  },
};

function BookingPage() {
  const { therapistId, appointmentId } = useParams();
  const [therapistData, setTherapistData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDiscountedPrice, setSelectedDiscountedPrice] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [error, setError] = useState(null);
  console.log(appointmentData);

  const [razorpayOptions, setRazorpayOptions] = useState({
    key: "rzp_test_9RNyyq8jjMD11V",
    amount: 0,
    currency: "INR",
    name: "Inspiron",
    description: "Therapy Session Booking",
    image: "https://your-therapy-center.com/logo.png",
    order_id: "",
    handler: response => {
      console.log(response);

      // Check if the payment was successful
      if (response.razorpay_payment_id) {
        alert("Payment successful!");

        // Continue with the API request and other logic as needed
        fetch(`${process.env.REACT_APP_SERVER_URL}/payments/verify/${appointmentId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // You can add other headers as needed
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })
          .then(apiResponse => apiResponse.json())
          .then(data => {
            console.log("API Response:", data);
            // Handle the API response as needed

            // After successful payment and API processing, open a new page
            window.open(`/sessionIsBooked/${appointmentId}`, "_self"); // "_self" opens it in the same tab
          })
          .catch(error => {
            console.error("Error hitting the API:", error);
            // Handle errors if necessary
          });

        setSelectedPaymentMode("online");
        setOpenPaymentDialog(false);
      } else {
        // Payment failed, show a popup with a message and an option to retry
        const shouldRetry = window.confirm(
          "Payment failed. Do you want to retry?"
        );
        if (shouldRetry) {
          // You can perform any retry logic here
          // For example, you can reset the payment options and reopen the payment dialog
          setRazorpayOptions({
            ...razorpayOptions,
            amount: selectedOption.discountPrice * 100, // Adjust the amount if needed
          });
          // Open the Razorpay payment gateway again
          const razorpay = new window.Razorpay(razorpayOptions);
          razorpay.open();
        } else {
          // Handle the case where the user chooses not to retry
          // You can close the payment dialog or take other actions as needed
          setOpenPaymentDialog(false);
        }
      }
    },
  });

  useEffect(() => {
    const therapistApiUrl = `${process.env.REACT_APP_SERVER_URL}/therapists/${therapistId}`;
    fetch(therapistApiUrl)
      .then(response => response.json())
      .then(responseData => {
        setTherapistData(responseData);
        setExperienceLevel(responseData?.expriencelevel[0].expriencelevel);
      })
      .catch(error => {
        console.error("Error fetching therapist data:", error);
      });
  }, [therapistId]);

  useEffect(() => {
    if (experienceLevel) {
      const priceApiUrl = `${process.env.REACT_APP_SERVER_URL}/prices/${experienceLevel}`;
      fetch(priceApiUrl)
        .then(response => response.json())
        .then(responseData => {
          setPriceData(responseData);
        })
        .catch(error => {
          console.error("Error fetching price data:", error);
        });
    }
  }, [experienceLevel]);

  const handleOptionChange = event => {
    const selectedOptionId = event.target.value;
    setSelectedOptionId(selectedOptionId);

    const selectedOptionData = priceData.find(
      option => option._id === selectedOptionId
    );

    if (selectedOptionData) {
      setSelectedOption(selectedOptionData);
      setSelectedDiscountedPrice(selectedOptionData.discountPrice);
      setIsNextDisabled(false);

      setRazorpayOptions({
        ...razorpayOptions,
        amount: selectedOptionData.discountPrice * 100,
      });
    }
  };
  console.log(appointmentId);

  const calculateDiscount = (sessionPrice, discountPrice) => {
    const discount = ((sessionPrice - discountPrice) / sessionPrice) * 100;
    return Math.round(discount);
  };

  const handleNextClick = () => {
    if (selectedOptionId) {
      const payload = {
        priceId: selectedOptionId,
      };

      fetch(`${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}/price`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData);
          setApiResponse(responseData);
          setOpenPaymentDialog(true);
        })
        .catch(error => {
          console.error("Error sending PUT request:", error);
        });
    }
  };

  const handlePaymentModeChange = event => {
    setSelectedPaymentMode(event.target.value);
  };

  const handlePaymentDialogClose = () => {
    setOpenPaymentDialog(false);

    if (selectedPaymentMode === "online") {
      fetch(`${process.env.REACT_APP_SERVER_URL}/payments/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: razorpayOptions.amount / 100,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.data.id);
          console.log(data);

          // Customize the appearance of the Razorpay payment form
          const razorpayOptionsWithTheme = {
            ...razorpayOptions,
            order_id: data.data.id,
            theme: {
              color: "#68B545", // Set the color scheme to your preferred color
              image: "https://your-therapy-center.com/logo.png", // Replace with your logo URL
              customization: {
                styles: {
                  // Customize the styles of Razorpay form elements
                  display: {
                    // Customize styles for form elements
                    card: {
                      backgroundColor: "#FFF", // Background color of the card input
                      padding: "10px", // Adjust padding
                    },
                    // Add more styles for other elements as needed
                  },
                },
              },
            },
            notes: {
              description: "Therapy Session Payment", // Add a description
              instructions:
                "Please complete the payment to book your therapy session.", // Payment instructions
            },
            modal: {
              // Customize the appearance of the payment button
              confirm_btn: {
                color: "#FFF", // Text color of the button
                background_color: "#68B545", // Background color of the button
                border_color: "#4C9141", // Border color of the button
                label: "Pay Now", // Button label
              },
            },
          };

          setRazorpayOptions(razorpayOptionsWithTheme);

          // Uncomment this section when you want to open the Razorpay payment gateway
          const razorpay = new window.Razorpay(razorpayOptionsWithTheme);
          razorpay.open();
        })
        .catch(error => {
          console.error("Error creating Razorpay order:", error);
        });
    } else if (selectedPaymentMode === "offline") {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}/payment/${therapistId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "Offline",
          }),
        }
      )
        .then(response => response.json())
        .then(responseData => {
          console.log(responseData);
          window.open(`/sessionIsBooked/${appointmentId}`, "_self");
        })
        .catch(error => {
          console.error("Error updating payment method:", error);
        });
    }
  };

  const handleCancelClick = () => {
    setOpenPaymentDialog(false);
  };
  // Assuming you have a Razorpay callback handler
  const handleRazorpayCallback = response => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      response;

    if (selectedPaymentMode === "online") {
      const verifyApiUrl = `${process.env.REACT_APP_SERVER_URL}/payments/verify/${appointmentId}`;

      // Make a POST request to the verify API
      fetch(verifyApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Payment verification response:", data);
          // Handle the verification response as needed
        })
        .catch(error => {
          console.error("Error verifying payment:", error);
          // Handle errors if necessary
        });
    }
  };

  useEffect(() => {
    // Define an async function to fetch the appointment data
    async function fetchAppointmentData() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/appointments/${appointmentId}`
        );
        // Set the appointment data in state
        setAppointmentData(response.data);
      } catch (err) {
        // Handle errors
        setError(err);
      }
    }

    // Call the async function to fetch data
    fetchAppointmentData();
  }, [appointmentId]); // Dependency array with appointmentId, so it runs when appointmentId changes

  return (
    <Box style={containerStyle}>
      <Typography variant="h4" align="center" style={headerStyle}>
        Book a Therapy Session
      </Typography>
      <Divider style={{ margin: "20px 0" }} />
      {therapistData && (
        <Paper elevation={5} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Therapist Information:</Typography>
          <Typography>Therapist Name: {therapistData.name}</Typography>
        </Paper>
      )}
      {priceData && (
        <Paper elevation={5} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Select a Pricing Option:</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="pricingOptions"
              value={selectedOptionId}
              onChange={handleOptionChange}
            >
              {priceData.map(option => (
                <div key={option._id}>
                  <FormControlLabel
                    value={option._id}
                    control={<Radio />}
                    label={
                      <>
                        <Typography>
                          <Divider />
                          Session Count: {option.session}
                        </Typography>
                        <Typography>
                          Session Price: ₹{option.sessionPrice}
                        </Typography>
                        <Typography>
                          Discounted Price: ₹{option.discountPrice}
                        </Typography>
                        <Typography>
                          Discount:{" "}
                          {calculateDiscount(
                            option.sessionPrice,
                            option.discountPrice
                          )}
                          %
                        </Typography>
                        <Divider />
                      </>
                    }
                  />
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      )}
      <Button
        variant="contained"
        style={buttonStyle}
        fullWidth
        onClick={handleNextClick}
        disabled={isNextDisabled}
      >
        Next
      </Button>
      <Dialog
        open={openPaymentDialog}
        onClose={handlePaymentDialogClose}
        aria-labelledby="payment-dialog-title"
        PaperProps={{
          style: {
            borderRadius: "10px",
            boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)",
            animation: "fadeIn 0.3s ease-in-out",
          },
        }}
      >
        <DialogTitle id="payment-dialog-title">Select Payment Mode</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              name="paymentMode"
              value={selectedPaymentMode}
              onChange={handlePaymentModeChange}
            >
              <FormControlLabel
                value="online"
                control={<Radio />}
                label={
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Online
                  </span>
                }
              />
              {appointmentData?.sessionMode === "Both" ? (
                <FormControlLabel
                  value="offline"
                  control={<Radio />}
                  label={
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      Offline
                    </span>
                  }
                />
              ) : (
                <FormControlLabel
                  value="offline"
                  control={<Radio disabled />}
                  label={
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "gray", // Apply a disabled color
                      }}
                    >
                      Offline
                    </span>
                  }
                />
              )}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions style={{ padding: "10px 20px" }}>
          <Button
            onClick={handleCancelClick}
            color="primary"
            style={{
              backgroundColor: "#FF0000",
              color: "#fff",
              borderRadius: "5px",
              marginRight: "10px",
              transition: "background 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#DD0000",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePaymentDialogClose}
            color="primary"
            style={{
              backgroundColor: "#68B545",
              color: "#fff",
              borderRadius: "5px",
              transition: "background 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#4C9141",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookingPage;
