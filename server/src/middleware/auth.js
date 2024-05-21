// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach the decoded token (which includes user info) to req.user
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
};

module.exports = authenticate;
