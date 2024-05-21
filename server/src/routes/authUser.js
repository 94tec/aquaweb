const express = require('express');
const router = express.Router();
const authUserController = require('../controllers/authUserController');
const { validateRegistration } = require('../middleware/validatorMiddleware');
const passport = require('passport');

const initializePassport = require('../middleware/passport.js');

initializePassport(passport);
// Initialize Passport

// User auth routes
router.post('/register', validateRegistration, authUserController.createUser);
router.post('/login', passport.authenticate('local-user', { session: false }), authUserController.loginUser);
router.post('/verifyToken',authUserController.userTokeVerification);

module.exports = router;

