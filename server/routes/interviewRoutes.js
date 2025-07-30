const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');

// Route to start a new interview
// POST /api/interviews/start
router.post('/start', async (req, res) => {
    try {
        const { jobPosition, jobExperience } = req.body;

        // In the future, we will call the Google AI here to get questions.
        // For now, let's create a record in the database.

        const newInterview = new Interview({
            jobPosition,
            jobExperience,
            createdBy: 'test_user' // Placeholder user
        });

        await newInterview.save();
        res.status(201).json(newInterview);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while starting interview' });
    }
});

module.exports = router;