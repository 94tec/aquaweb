const jwt = require('jsonwebtoken');
const Fisher = require('../models/Fisher');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const fisher = await Fisher.findById(decoded.id);
        if (!fisher) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.fisher = fisher;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Failed to authenticate token', error: err });
    }
};

module.exports = authMiddleware;
