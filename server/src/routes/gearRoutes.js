const express = require('express');
const router = express.Router();
const gearController = require('../controllers/gearController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, gearController.getAllGears);
router.post('/', authMiddleware, gearController.createGear);
router.get('/:id', authMiddleware, gearController.getGear);
router.put('/:id', authMiddleware, gearController.updateGear);
router.delete('/:id', authMiddleware, gearController.deleteGear);

module.exports = router;
