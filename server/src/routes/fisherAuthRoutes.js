const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validatorMiddleware');
const passport = require('passport');

const initializePassport = require('../middleware/passport.js');

initializePassport(passport);

// Fisher auth routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', passport.authenticate('local-fisher', { session: false }), authController.login);

module.exports = router;
