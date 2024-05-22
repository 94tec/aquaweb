//user routes/authRoutes.js
const express = require('express');
require('dotenv').config();
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

const initializePassport = require('../middleware/passport.js');

initializePassport(passport);

const {verifyToken } = require('../middleware/index.js');
const { validateRegistration } = require('../middleware/validatorMiddleware');

// User CRUD routes
router.get('/', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getAllUsers);
router.get('/profile', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getUserProfile);
//router.put('/:id', passport.authenticate('jwt-user', { session: false }), userController.updateUser);
//router.delete('/:id', passport.authenticate('jwt-user', { session: false }), userController.deleteUser);

//User routes
router.post('/create-fisher', verifyToken, validateRegistration, userController.createFisher);
router.get('/fishers', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getAllFishers);
router.get('/fisher/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getFisher);
router.put('/fisher/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.updateFisher);
router.delete('/fisher/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.deleteFisher);

// fishery routes
router.post('/create-fishery', verifyToken, userController.createFishery);
router.get('/fisheries', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getAllFisheries);
router.get('/fisheries/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getFishery);
router.put('/fisheries/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.updateFishery);
router.delete('/fisheries/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.deleteFishery);

// Vessel routes
router.post('/create-vessel', verifyToken, userController.createVessel);
router.get('/fisheries', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getAllFisheries);
router.get('/fisheries/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.getFishery);
router.put('/fisheries/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.updateFishery);
router.delete('/fisheries/:id', passport.authenticate('jwt-user', { session: false }),verifyToken, userController.deleteFishery);

module.exports = router;