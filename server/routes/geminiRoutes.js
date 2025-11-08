
const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../controllers/geminiController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), analyzeResume);

module.exports = router;
