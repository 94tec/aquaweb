//user routes/authRoutes.js
const express = require('express');
require('dotenv').config();
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

const initializePassport = require('../middleware/passport.js');

initializePassport(passport);

const {verifyToken } = require('../middleware/index.js');

// User CRUD routes
router.get('/', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getAllUsers);
router.get('/profile', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getUserProfile);
//router.put('/:id', passport.authenticate('jwt-user', { session: false }), userController.updateUser);
//router.delete('/:id', passport.authenticate('jwt-user', { session: false }), userController.deleteUser);

module.exports = router;