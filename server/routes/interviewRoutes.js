const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route to start a new interview
// POST /api/interviews/start
router.post('/start', async (req, res) => {
    try {
        const { jobPosition, jobExperience } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `Generate 5 interview questions for a ${jobPosition} with ${jobExperience} years of experience. The questions should be technical and behavioral. Please provide the output in JSON format as an array of strings like this: ["question 1", "question 2", ...].`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '');
        const questionsArray = JSON.parse(cleanedText);

        
        // For now, we just send the questions back.
        // Later, we'll save them to the database.
        const interviewData = {
            jobPosition,
            jobExperience,
            questions: questionsArray.map(q => ({ question: q })) // Format for our schema
        };

        res.status(200).json(interviewData);

    } catch (error) {
        console.error("Error generating questions with AI:", error);
        res.status(500).json({ message: 'Error generating questions with AI' });
    }
});

module.exports = router;