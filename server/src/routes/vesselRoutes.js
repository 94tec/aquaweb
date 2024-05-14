const express = require('express');
const router = express.Router();
const vesselController = require('../controllers/vesselController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, vesselController.getAllVessels);
router.post('/', authMiddleware, vesselController.createVessel);
router.get('/:id', authMiddleware, vesselController.getVessel);
router.put('/:id', authMiddleware, vesselController.updateVessel);
router.delete('/:id', authMiddleware, vesselController.deleteVessel);

module.exports = router;
