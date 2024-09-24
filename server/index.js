import express from "express";
// import path if needed later

// initializes the app
const app = express();

// middleware to parse JSON data
app.use(express.json());

// basic route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// listens on port
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`HealthEase app is listening on port ${port}`);
});