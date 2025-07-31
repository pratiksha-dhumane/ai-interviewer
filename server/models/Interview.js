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
    createdBy: { type: String, required: true },
    questions: [questionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);