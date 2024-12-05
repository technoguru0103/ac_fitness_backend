const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendVerificationEmail, generateVerificationToken } = require('../config/email');
const router = express.Router();

const findUserByToken = async (token) => {
    try {
        // Search for the user by the verification token
        const user = await User.findOne({ emailVerificationToken: token });
        return user;
    } catch (error) {
        console.error("Error finding user by token:", error);
        throw error;
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.isEmailVerified) return res.status(403).json({ message: 'Please verify your email to access this resource' });


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.signup = router.post(
    '/signup',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'Email already registered' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const emailVerificationToken = generateVerificationToken();
            const newUser = new User({ email, password: hashedPassword, emailVerificationToken });
            await newUser.save();

            // Send verification email
            await sendVerificationEmail(email, emailVerificationToken);

            res.status(200).json({ message: 'Email Sent' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        // Find user by token
        const user = await findUserByToken(token);

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // Update the user's verification status
        user.isEmailVerified = true;
        user.emailVerificationToken = null; // Clear the token
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ error: "Failed to verify email" });
    }
}
