const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const resumeRoutes = require('./routes/resumeRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/gemini', geminiRoutes);

// --- Serve Frontend ---
// This logic serves the built version of the frontend application.
// It assumes that a build process has created a 'dist' folder at the root.
const rootDir = path.resolve(__dirname, '..');
const distPath = path.join(rootDir, 'dist');

app.use(express.static(distPath));

// For any request that doesn't match an API route or a static file,
// serve the main index.html file. This is crucial for single-page applications.
app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
});
// --- End Serve Frontend ---

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
