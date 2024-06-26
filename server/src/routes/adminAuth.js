// admin routes
const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const initializePassport = require('../middleware/passport.js');
const User = require('../models/User.js');
// Import the AdminUserModel
const AdminUser = require('../models/AdminUserModel.js');
const { verifyToken, requireRole } = require('../middleware/index');
const { validateRegistration, validateLogin} = require('../middleware/validatorMiddleware');

initializePassport(passport);

// Admin user creation route
router.post('/user', validateRegistration, async (req, res) => {
    try {
        const { firstname, middlename, lastname, username,phonenumber, id, email, password } = req.body;
        
        // Check if the admin user already exists
        const existingAdmin = await AdminUser.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }
        
        // Create a new admin user instance
        const newAdminUser = new AdminUser({ firstname, middlename, lastname, username,phonenumber, id, email, password, role: 'admin' });
        
        // Save the new admin user to the AdminUserModel collection
        await newAdminUser.save();

        // Respond with success message
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Login route for admin user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if the admin user exists
        const adminUser = await AdminUser.findOne({ email });
        if (!adminUser) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Ensure the user is an admin
        if (adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access forbidden. You do not have admin privileges' });
        }
        
        // Create a payload containing user information
        const payload = {
            id: adminUser._id,
            email: adminUser.email,
            role: adminUser.role
        };
        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with success message and token
        res.json({ message: 'Login successful Welcome to the admin page Dashboard', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}); 

// Fetch user profile route
router.get('/profile', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        // Assuming your verifyToken middleware adds the user's ID to req.user
        const userId = req.user.id;

        // Fetch the user from the database
        const user = await AdminUser.findById(userId).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Logout route
router.get('/logout', (req, res) => {
    // Simply clear the token from the client-side
    res.clearCookie('token').json({ message: 'Logout successful' });
});

module.exports = router;