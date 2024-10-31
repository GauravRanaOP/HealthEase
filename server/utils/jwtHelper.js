require('dotenv').config();  // Load environment variables

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;  // Access JWT_SECRET from .env

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h'
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
