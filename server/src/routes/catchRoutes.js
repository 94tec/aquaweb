const express = require('express');
const router = express.Router();
const catchController = require('../controllers/catchController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, catchController.getAllCatches);
router.post('/', authMiddleware, catchController.createCatch);
router.get('/:id', authMiddleware, catchController.getCatch);
router.put('/:id', authMiddleware, catchController.updateCatch);
router.delete('/:id', authMiddleware, catchController.deleteCatch);

module.exports = router;
