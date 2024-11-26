import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";


// export default function CheckoutForm({ selectedTimeslot, userData, doctorId }) {
//   const [loading, setLoading] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const stripe = useStripe();
//   const elements = useElements();

//   // handle the payment submission
//   const handlePaymentSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       // stripe is not loaded
//       return;
//     }
//     setLoading(true);
//     setPaymentStatus(null);

//     // gets a client secret from backend
//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/payment/intent",
//         {
//           timeslotId: selectedTimeslot.appointmentId,
//           userId: userData,
//           doctorId,
//           price: 40, // temp: adjust this based on appointment price
//         }
//       );

//       const { clientSecret } = response.data;

//       // confirms the payment using the CardElement
//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardElement),
//           },
//         }
//       );

//       if (error) {
//         setPaymentStatus(`Payment failed: ${error.message}`);
//       } else if (paymentIntent.status === "succeeded") {
//         setPaymentStatus("Payment succeeded!");
//         // confirm booking after payment success
//         await confirmBooking();
//       }
//     } catch (error) {
//       setPaymentStatus("Payment initiation failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // function to confirm the appointment booking after successful payment
//   const confirmBooking = async () => {
//     try {
//       const response = await axios.put(
//         `http://localhost:3002/api/doctors/updateTimeslot/${selectedTimeslot.appointmentId}`,
//         { userId: userData.userId }
//       );
//       console.log("Booking confirmed:", response.data.message);
//       // optionally redirect to another page or display confirmation
//     } catch (error) {
//       console.error("Error confirming the booking:", error);
//       setPaymentStatus("Error confirming the booking.");
//     }
//   };

//   return (
//     <div className="checkout-form">
//       <h2>Complete Payment</h2>
//       <form onSubmit={handlePaymentSubmit}>
//         <div>
//           <label>Card Information</label>
//           <CardElement />
//         </div>
//         <button type="submit" disabled={loading || !stripe}>
//           {loading ? "Processing..." : "Pay Now"}
//         </button>
//       </form>

//       {paymentStatus && <p>{paymentStatus}</p>}
//     </div>
//   );
// } // end CheckoutForm

// new checkout form

export default function CheckoutForm({ onSuccess }) {
  
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error);
      alert("Payment failed");
    } else {
      // gets the clientSecret key from the backend
      const response = await axios.post("http://localhost:3002/api/payment/intent", {
        amount: 40, // replace with the actual amount
      });

      const { clientSecret } = response.data;

      // confirms the payment with the obtained clientSecret
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (paymentResult.error) {
        console.error(paymentResult.error);
        alert("Payment failed");
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // calls the success handler after successful payment
        onSuccess(paymentResult);
      }
    }
  };

  // return (
  //   <form onSubmit={handlePaymentSubmit}>
  //     <CardElement />
  //     <button type="submit" disabled={!stripe}>
  //       Pay
  //     </button>
  //   </form>
  // );

  return (
    <div className="checkout-form">
      <h2>Complete Payment</h2>
      <form onSubmit={handlePaymentSubmit}>
        <div>
          <label>Card Information</label>
          <CardElement />
        </div>
        <button type="submit" disabled={loading || !stripe}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
}
