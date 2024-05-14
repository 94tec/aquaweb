//user routes/authRoutes.js
const express = require('express');
require('dotenv').config();
const router = express.Router();

const {verifyToken } = require('../middleware/index.js');

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
module.exports = router;

