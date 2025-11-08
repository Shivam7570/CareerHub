
const express = require('express');
const router = express.Router();
const { getResume, setResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getResume).post(protect, setResume);

module.exports = router;
