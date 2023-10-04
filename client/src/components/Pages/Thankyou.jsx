import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container, Typography, Paper, Button } from "@mui/material";

const ContainerWrapper = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const PaperWrapper = styled(Paper)`
  padding: 20px;
  text-align: center;
  background: linear-gradient(45deg, #2196f3 30%, #21cbf3 90%);
  box-shadow: 0 3px 5px 2px rgba(33, 203, 243, 0.3);
  border-radius: 10px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

function Thankyou() {
  const { token } = useParams(); // Extract the token from the URL path
  const [verificationStatus, setVerificationStatus] = useState("");
  const navigate = useNavigate();

  console.log(token);

  useEffect(() => {
    // Make a GET request to your backend to verify the email
    fetch(`http://localhost:4000/api/v1/users/verify/${token}`)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          setVerificationStatus(
            "Email verified successfully. You can now log in."
          );
          return response.json();
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      })
      .then(data => {
        if (data.success) {
          setVerificationStatus(
            "Email verified successfully. You can now log in."
          );
        } else {
          setVerificationStatus("Invalid or expired token");
        }
      })
      .catch(error => {});
  }, [token]);

  const handleLoginClick = () => {
    navigate("/signin");
  };

  return (
    <ContainerWrapper>
      <PaperWrapper elevation={3}>
        <Typography variant="h4">{verificationStatus}</Typography>
        {verificationStatus ===
          "Email verified successfully. You can now log in." && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
          >
            Go to Login
          </Button>
        )}
      </PaperWrapper>
    </ContainerWrapper>
  );
}

export default Thankyou;
