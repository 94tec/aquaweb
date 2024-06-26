const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUser = async (req, res) => {
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
};

exports.loginUser = async (req, res) => {
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
};
exports.logOutUser = async (req, res) =>{

}
exports.userTokeVerification = async (req, res) => {
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
}




