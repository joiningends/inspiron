import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  styled,
} from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  maxWidth: 400,
  margin: '0 auto',
  borderRadius: theme.spacing(2),
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
}));

function PaymentConfirm() {
  const { amount } = useParams();
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  // This function simulates payment completion.
  const simulatePayment = () => {
    // Replace this with your actual payment logic.
    // For demonstration purposes, we're just setting a timeout here.
    setTimeout(() => {
      setIsPaymentCompleted(true);
    }, 2000);
  };

  useEffect(() => {
    // Simulate payment when the component mounts.
    simulatePayment();

    // Use the "beforeunload" event to prevent navigation back.
    const handleBeforeUnload = (e) => {
      if (!isPaymentCompleted) {
        e.preventDefault();
        e.returnValue = ''; // This is for older browsers.
        window.location.replace('/FindTherapist');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component unmounts.
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPaymentCompleted]);

  return (
    <StyledContainer>
      <StyledPaper>
        {isPaymentCompleted ? (
          <>
            <Typography variant="h4" gutterBottom>
              Payment Completed
            </Typography>
            <Typography variant="h5" gutterBottom>
              Amount: ₹{amount}
            </Typography>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              run={isPaymentCompleted}
              timeout={5000}
            />
          </>
        ) : (
          <Typography variant="h4" gutterBottom>
            Processing Payment...
          </Typography>
        )}
      </StyledPaper>
    </StyledContainer>
  );
}

export default PaymentConfirm;
