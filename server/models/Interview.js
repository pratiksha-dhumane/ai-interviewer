const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    rating: String,
    feedback: String
});

const interviewSchema = new mongoose.Schema({
    jobPosition: { type: String, required: true },
    jobExperience: { type: String, required: true },
    createdBy: { type: String, required: true }, // We'll add the real user ID later
    questions: [questionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);