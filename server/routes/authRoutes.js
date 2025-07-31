const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Make sure this is imported
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body; // Use =

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Use =

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // User is validated, create a JSON Web Token (JWT)
        const payload = {
            id: user.id,
            username: user.username,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.status(200).json({
            message: 'Logged in successfully.',
            token: token,
            user: { id: user.id, username: user.username }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;