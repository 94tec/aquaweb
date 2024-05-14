const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Fisher = require('../models/Fisher');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFisher = new Fisher({ username, password: hashedPassword, email });
        await newFisher.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const fisher = await Fisher.findOne({ username });
        if (!fisher) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, fisher.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ id: fisher._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err });
    }
};
