const express = require('express');
const router = express.Router();

// POST /api/feedback/generate
router.post('/generate', async (req, res) => {
    try {
        const { question, answer } = req.body;
        console.log("Returning fake feedback for:", { question, answer });

        // Create FAKE feedback data because the AI quota was exceeded
        const fakeFeedback = {
            rating: "8",
            feedback: "This is temporary fake feedback. The AI quota was exceeded, but the app still works!"
        };
        
        // Send the fake data back as a successful response
        res.status(200).json(fakeFeedback);

    } catch (error) { // This curly brace was missing
        console.error("Error generating feedback:", error);
        res.status(500).json({ message: 'Error generating feedback' });
    }
});

module.exports = router;