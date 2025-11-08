
const asyncHandler = require('express-async-handler');
const Resume = require('../models/resumeModel');

// @desc    Get user's resume
// @route   GET /api/resume
// @access  Private
const getResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ user: req.user.id });
    if (resume) {
        res.status(200).json(resume);
    } else {
        res.status(200).json(null); // No resume found is not an error
    }
});

// @desc    Create or update resume
// @route   POST /api/resume
// @access  Private
const setResume = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        res.status(400);
        throw new Error('Please provide resume content');
    }

    const resume = await Resume.findOneAndUpdate(
        { user: req.user.id },
        { content, user: req.user.id },
        { new: true, upsert: true }
    );
    
    res.status(200).json(resume);
});

module.exports = {
    getResume,
    setResume,
};
