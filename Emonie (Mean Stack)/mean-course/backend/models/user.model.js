const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/
        }
    },
    medicalHistory: {
        type: String
    },
    currentMedications: {
        type: String
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User; 