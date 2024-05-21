// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Fisher = require('../models/Fisher');


exports.register = async (req, res) => {
    try {
        const { firstname, middlename, lastname, username, email, phonenumber, id, password, role, fisherLogs, vessels, gears } = req.body;

        const existingFisher = await Fisher.findOne({ $or: [{ username }, { email }] });
        if (existingFisher) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const newFisher = new Fisher({
            firstname,
            middlename,
            lastname,
            username,
            email,
            phonenumber,
            id,
            password,
            role,
            fisherLogs,
            vessels,
            gears
        });

        await newFisher.save();
        const token = newFisher.generateJWT();
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        // If passport.authenticate('local') succeeds, the fisher object will be attached to req.fisher
        const user = req.user;
    
        // Create a payload containing user information
        const payload = {
            id: user._id,
            email:user.email,
            role: user.role
        };
        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
    
        // Respond with success message and JWT
        res.json({ message: 'Login successful', token, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
};