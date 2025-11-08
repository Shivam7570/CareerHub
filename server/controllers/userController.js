const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// User model is no longer needed for mock login/register
// const User = require('../models/userModel');

// NOTE: For demonstration purposes, we are using a hardcoded JWT secret.
// In a production environment, this MUST be loaded from a secure .env file.
const JWT_SECRET = 'this-is-a-temporary-secret-for-testing';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user (mocked)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    // Create a mock user object without saving to DB.
    const mockUser = {
        _id: 'mockUserId12345',
        name: name || 'Test User',
        email: email || 'test@example.com',
    };

    // Return the mock user with a valid token.
    res.status(201).json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: generateToken(mockUser._id),
    });
});

// @desc    Authenticate a user (mocked)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Create a mock user object without checking password or DB.
    const mockUser = {
        _id: 'mockUserId12345',
        name: 'Test User',
        email: email || 'test@example.com',
    };

    // Return the mock user with a valid token.
    res.json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: generateToken(mockUser._id),
    });
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user is now populated by the modified 'protect' middleware
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};