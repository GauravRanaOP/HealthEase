import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// new checkout form

export default function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setErrorMessage(error.message);
      console.log("Client: Error: ", error);
      return;
    }

    try {
      // gets the clientSecret key from the backend
      const response = await axios.post(
        "https://healthease-n5ra.onrender.com/api/payment/intent",
        {
          amount: 40, // replace with the actual amount
        }
      );

      const { clientSecret } = response.data;

      // confirms the payment with the obtained clientSecret
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (paymentResult.error) {
        setErrorMessage(paymentResult.error.message);
        console.log("Payment result error: ", paymentResult.error);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // calls the success handler after successful payment
        onSuccess(paymentResult);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Complete Payment</h2>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div>
          <label>Card Information</label>
          <CardElement />
        </div>
        <button type="submit" className="btn-pay" disabled={loading || !stripe}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {/* {paymentStatus && <p>{paymentStatus}</p>} */}

      {/* Display error message if exists */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}
