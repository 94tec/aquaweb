// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const initializePassport = require('../middleware/passport.js');
const User = require('../models/User.js');
// Import the AdminUserModel
const {verifyToken } = require('../middleware/index.js');
const { validateRegistration } = require('../middleware/validatorMiddleware.js');

initializePassport(passport);

// Route for user registration
    router.post('/register',validateRegistration, async (req, res) => {
        try {
            // Extract user registration data from request body
            const { firstname, middlename, lastname, username,phonenumber, id, email, password } = req.body;

            // Check if the username or email already exists
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            // Create a new user instance
            const newUser = new User({ firstname, middlename, lastname, username, phonenumber, id, email, password, role: 'user' });

            // Save the new user to the database
            await newUser.save();

            // Generate JWT for the newly registered user
            const token = newUser.generateJWT();

            // Respond with success message and JWT
            res.status(201).json({ message: 'User registered successfully', token });
        } catch (error) {
            // Handle errors
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
// Route for user login
router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    try {
        // If passport.authenticate('local') succeeds, the user object will be attached to req.user
        const user = req.user;

        // Create a payload containing user information
        const payload = {
            id: user._id,
            email: user.email,
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
});
// Route for token verification
router.post('/verifyToken', async (req, res) => {
    try {
      // Extract token from Authorization header
      const token = req.headers.authorization.split(' ')[1]; // Assuming token is in the format "Bearer <token>"
  
      // Perform token validation logic (e.g., check expiration, decode JWT, etc.)
      // For simplicity, let's assume the token is valid
      // Replace this with your actual token validation logic
      if (token) {
        // Token is valid, return success response
        res.status(200).json({ success: true, message: 'Token is valid' });
      } else {
        // Token is invalid or missing, return error response
        res.status(401).json({ success: false, message: 'Invalid or missing token' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
// Route to get logged in user's data
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Assuming your verifyToken middleware adds the user's ID to req.user
        const userId = req.user.id;
        
        // Fetch the user from the database
        const user = await User.findById(userId).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting  User Profile." });
    }
});
// fetch  all users 
router.get('/users', verifyToken, async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while getting users." });
    }
});    
router.post('/logout', (req, res) => {
    // Clear any session data or invalidate the token on the server-side
    // You may choose to do additional cleanup tasks here
    
    res.json({ message: 'Logout successful' });
});

//auth with google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('//google/redirect',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

module.exports = router;

