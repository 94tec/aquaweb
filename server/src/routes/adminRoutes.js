//admin end point
const express = require('express');
require('dotenv').config();
const router = express.Router();

const AdminUser = require('../models/adminUserModel');
const User = require('../models/User.js');
const { verifyToken, requireRole} = require('../middleware/index');

// Fetch all users
router.get('/users', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;