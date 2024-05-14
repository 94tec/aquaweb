const express = require('express');
const router = express.Router();
const fisherLogController = require('../controllers/fisherLogController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, fisherLogController.getAllLogs);
router.post('/', authMiddleware, fisherLogController.createLog);
router.get('/:id', authMiddleware, fisherLogController.getLog);
router.put('/:id', authMiddleware, fisherLogController.updateLog);
router.delete('/:id', authMiddleware, fisherLogController.deleteLog);

module.exports = router;
