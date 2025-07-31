const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const Interview = require('../models/Interview');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Route to start a new interview
// POST /api/interviews/start
router.post('/start',protect, async (req, res) => {
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
            createdBy: req.user.id // Placeholder user
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

// GET /api/interviews/history
// Gets all interviews for the logged-in user
router.get('/history', protect, async (req, res) => {
    try {
        // We find interviews where 'createdBy' matches the user's ID from the token
        const interviews = await Interview.find({ createdBy: req.user.id });
        res.status(200).json(interviews);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: 'Server error while fetching history.' });
    }
});
// GET /api/interviews/:id
// Gets a single interview by its ID
router.get('/:id', protect, async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Ensure the user owns this interview
        if (interview.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(interview);
    } catch (error) {
        console.error("Error fetching single interview:", error);
        res.status(500).json({ message: 'Server error while fetching interview.' });
    }
});
module.exports = router;