import { Stripe } from 'stripe';
import dotenv from 'dotenv';


dotenv.config(); 
// loads stripe secret key from .env file
const stripe = new Stripe(process.env.PAYMENT_KEY);

// create a payment intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;    // amount from client

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        // converts amount to cents
        const amountInCents = amount * 100; 

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'cad',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }

}; // end createPaymentIntent