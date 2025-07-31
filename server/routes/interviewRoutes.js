const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Route to start a new interview
// POST /api/interviews/start
router.post('/start', async (req, res) => {
    try {
        const { jobPosition, jobExperience } = req.body;

        // --- Generate Questions with AI ---
        const prompt = `Generate 5 interview questions for a ${jobPosition} position with ${jobExperience} years of experience. The questions should be technical and behavioral. Please provide the output in JSON format as an array of objects like this: [{"question": "First question..."}, {"question": "Second question..."}].`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '');
        const questionsArray = JSON.parse(cleanedText);
        // ---------------------------------

        const newInterview = new Interview({
            jobPosition,
            jobExperience,
            questions: questionsArray, // Save the AI-generated questions
            createdBy: 'test_user' // Placeholder user
        });

        await newInterview.save();
        
        console.log("Interview created, sending back:", newInterview); // Debugging line
        res.status(201).json(newInterview);

    } catch (error) {
        console.error("Error starting interview:", error);
        res.status(500).json({ message: 'Error starting interview' });
    }
});


// Route to update and finalize an interview
// PUT /api/interviews/:id/complete
router.put('/:id/complete', async (req, res) => {
    try {
        const { completedQuestions } = req.body;
        const interviewId = req.params.id;

        const updatedInterview = await Interview.findByIdAndUpdate(
            interviewId,
            { $set: { questions: completedQuestions } },
            { new: true } // Return the updated document
        );

        if (!updatedInterview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        res.status(200).json(updatedInterview);

    } catch (error) {
        console.error("Error saving interview:", error);
        res.status(500).json({ message: 'Error saving interview' });
    }
});


module.exports = router;