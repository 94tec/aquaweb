const express = require('express');
const router = express.Router();
const fisherController = require('../controllers/fisherController');
const passport = require('passport');

const initializePassport = require('../middleware/passport.js');

initializePassport(passport);

const {verifyToken } = require('../middleware/index.js');
// Fisher CRUD routes
router.get('/', passport.authenticate('jwt-fisher', { session: false }), verifyToken, fisherController.getAllFishers);
router.get('/profile', passport.authenticate('jwt-fisher', { session: false }), verifyToken, fisherController.getFisherProfile);
router.put('/:id', passport.authenticate('jwt-fisher', { session: false }), fisherController.updateFisher);
router.delete('/:id', passport.authenticate('jwt-fisher', { session: false }), fisherController.deleteFisher);

module.exports = router;
