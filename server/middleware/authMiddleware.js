const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// User model is not needed for mock authentication
// const User = require('../models/userModel');

// NOTE: For demonstration purposes, we are using a hardcoded JWT secret.
// In a production environment, this MUST be loaded from a secure .env file.
const JWT_SECRET = 'this-is-a-temporary-secret-for-testing';


const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Create a mock user object from the token instead of fetching from DB
            req.user = {
                id: decoded.id,
                name: 'Test User',
                email: 'test@example.com'
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };