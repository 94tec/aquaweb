const express = require('express');
const router = express.Router();
const fisheriesController = require('../controllers/fisheriesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, fisheriesController.getAllFisheries);
router.post('/', authMiddleware, fisheriesController.createFishery);
router.get('/:id', authMiddleware, fisheriesController.getFishery);
router.put('/:id', authMiddleware, fisheriesController.updateFishery);
router.delete('/:id', authMiddleware, fisheriesController.deleteFishery);

module.exports = router;
