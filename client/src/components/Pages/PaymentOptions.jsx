// PaymentOptionsComponent.js
import React from "react";

const PaymentOptionsComponent = ({ onSelectPaymentMode }) => {
  return (
    <div>
      <h3>Select Payment Mode:</h3>
      <button onClick={() => onSelectPaymentMode("online")}>Online Payment</button>
      <button onClick={() => onSelectPaymentMode("offline")}>Offline Payment</button>
    </div>
  );
};

export default PaymentOptionsComponent;
