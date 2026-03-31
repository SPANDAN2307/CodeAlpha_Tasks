const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', protect, admin, eventController.createEvent);

module.exports = router;
