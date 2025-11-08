
import { ResumeAnalysis } from "../types";

const API_URL = '/api/gemini/';

// This function now sends the file to our own backend, which then calls the Gemini API.
export const analyzeResume = async (file: File): Promise<ResumeAnalysis> => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(API_URL + 'analyze', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze resume');
    }

    const data = await response.json();
    return data;
};
