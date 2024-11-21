import { Stripe } from 'stripe';
import dotenv from 'dotenv';


dotenv.config(); 
const stripe = new Stripe(process.env.PAYMENT_KEY); // add to .env file and replace

// create a payment intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;    // amount from client

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'cad',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}; // end createPaymentIntent