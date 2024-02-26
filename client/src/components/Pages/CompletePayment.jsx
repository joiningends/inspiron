import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CompletePayment() {
  const { userId, amount, experienceLevel } = useParams();

  const [boxStyle, setBoxStyle] = useState({
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    transform: "rotateY(20deg)",
    transition: "transform 0.5s",
    maxWidth: "400px",
    width: "80%",
  });

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    perspective: "1000px",
    background: "linear-gradient(45deg, #f6f6f6, #e0e0e0)",
  };

  const headerStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  };

  const buttonStyle = {
    margin: "10px",
    padding: "12px 24px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#D67449",
    color: "white",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "white",
    border: "1px solid #D67449",
    color: "#D67449",
  };

  useEffect(() => {
    const handleMouseEnter = () => {
      setBoxStyle({
        ...boxStyle,
        transform: "rotateY(0deg)",
      });
    };

    const handleMouseLeave = () => {
      setBoxStyle({
        ...boxStyle,
        transform: "rotateY(20deg)",
      });
    };

    document
      .getElementById("box")
      .addEventListener("mouseenter", handleMouseEnter);
    document
      .getElementById("box")
      .addEventListener("mouseleave", handleMouseLeave);

    return () => {
      // Remove event listeners when the component unmounts
      document
        .getElementById("box")
        .removeEventListener("mouseenter", handleMouseEnter);
      document
        .getElementById("box")
        .removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [boxStyle]);

  const handlePayOnline = () => {
    // Send a POST request to the server to fetch payment order details
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/payments/orders`, {
        amount: amount, // Send the amount to the server
      })
      .then(response => {
        const responseData = response.data.data;
        const actualAmount = responseData.amount / 100;
        const order_id = responseData.id;

        // Initialize Razorpay with your Razorpay API Key
        const options = {
          key: `${process.env.REACT_APP_KEY_ID}`,
          amount: actualAmount * 100, // Amount in paise
          currency: "INR",
          name: "Your Company Name",
          description: "Payment for Course",
          order_id: order_id,
          handler: function (response) {
            // Handle the successful payment response here
            const {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            } = response;

            // Make a POST request to the verification URL

            axios
              .post(`${process.env.REACT_APP_SERVER_URL}/payments/verify`, {
                userid: userId,
                experiencelevel: experienceLevel,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                amount: actualAmount, // Send the actual amount in rupees
                currency: "INR",
              })
              .then(verifyResponse => {
                // Handle the verification response here
                var url = `/FindTherapist`;
                window.open(url, "_self");
              })
              .catch(verifyError => {
                // Handle verification error here
                console.error("Verification error:", verifyError);
              });
          },
          prefill: {
            name: "User Name",
            email: "user@example.com",
          },
          theme: {
            color: "#007bff",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      })
      .catch(error => {
        console.error("Payment error:", error);
      });
  };

  return (
    <div style={containerStyle}>
      <div id="box" style={boxStyle}>
        <h1 style={headerStyle}>Payment Details</h1>
        <p style={{ fontSize: "20px", marginBottom: "30px" }}>
          Please pay ₹{amount}.
        </p>
        <button style={primaryButtonStyle} onClick={handlePayOnline}>
          Pay Online
        </button>
        <button style={secondaryButtonStyle}>Pay Offline</button>
      </div>
    </div>
  );
}

export default CompletePayment;
