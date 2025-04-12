const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { 
            firstName, lastName, email, password, 
            dateOfBirth, gender, phoneNumber,
            emergencyContact, medicalHistory, currentMedications 
        } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            gender,
            phoneNumber,
            emergencyContact,
            medicalHistory,
            currentMedications
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                message: 'User registered successfully'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Error registering user',
            error: error.message 
        });
    }
});

module.exports = router; 