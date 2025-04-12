const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');
const app = require('./app');
const debug = require('debug')('node-angular');
const http = require('http');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/users/register', async (req, res) => {
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

const normalizePort = val => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const onError = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
    debug('Listening on ' + bind);
    console.log('Server is running on port ' + port);
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
