const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// console.log("Mongo",process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Successfully connected to MongoDB!"))
  .catch((error) => console.error("❌ MongoDB connection error: ", error));

// --- API Routes ---
const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interviews', interviewRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello! The server is running correctly.' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});