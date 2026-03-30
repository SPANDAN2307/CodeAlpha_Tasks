const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/', registrationController.register);
router.get('/user', registrationController.getUserRegistrations);
router.delete('/:id', registrationController.cancelRegistration);

module.exports = router;
