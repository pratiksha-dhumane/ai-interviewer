const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// This allows our server to accept JSON data and allows our frontend to connect
app.use(cors());
app.use(express.json());
// --- Add these two lines ---
const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interviews', interviewRoutes);
// ---------------------------
// A simple test route to make sure the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello! The server is running correctly.' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});