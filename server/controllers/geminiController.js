
const asyncHandler = require('express-async-handler');
const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (buffer, mimeType) => {
    return {
        inlineData: {
            data: buffer.toString('base64'),
            mimeType
        },
    };
};

// @desc    Analyze resume using Gemini API
// @route   POST /api/gemini/analyze
// @access  Public
const analyzeResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No resume file uploaded.');
    }

    const resumePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

    const prompt = 'Analyze this resume for a generic software engineering role. Provide an overall score out of 100 for ATS compatibility and overall quality. Also, list 3 strengths, 3 weaknesses, and 3 specific, actionable suggestions for improvement.';

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            score: {
                type: Type.INTEGER,
                description: 'A score from 0-100 representing the resume\'s quality.'
            },
            strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of 3 strengths of the resume.'
            },
            weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of 3 weaknesses of the resume.'
            },
            suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of 3 actionable suggestions for improvement.'
            },
        },
        required: ["score", "strengths", "weaknesses", "suggestions"]
    };

    try {
        const genAIResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [resumePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const analysis = JSON.parse(genAIResponse.text);
        res.status(200).json(analysis);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500);
        throw new Error('Failed to get analysis from AI service.');
    }
});

module.exports = {
    analyzeResume,
};
