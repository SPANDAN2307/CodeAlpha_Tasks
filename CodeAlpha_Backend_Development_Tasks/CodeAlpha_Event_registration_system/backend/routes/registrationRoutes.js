const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, registrationController.register);
router.get('/user', protect, registrationController.getUserRegistrations);
router.delete('/:id', protect, registrationController.cancelRegistration);

module.exports = router;
