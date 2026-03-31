const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register for an event
exports.register = async (req, res) => {
  try {
    const { eventId, userName } = req.body;
    const userEmail = req.user.email;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check capacity
    const registrationsCount = await Registration.count({ where: { eventId } });
    if (registrationsCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    // Check if user already registered for this event
    const existingReg = await Registration.findOne({ where: { eventId, userId } });
    if (existingReg) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    const registration = await Registration.create({ eventId, userName: userName || 'User', userEmail, userId });
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
};

// Get registrations by user email
exports.getUserRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { userId: req.user.id },
      include: [{ model: Event }]
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findOne({ where: { id, userId: req.user.id } });
    if (!registration) return res.status(404).json({ message: 'Registration not found or unauthorized' });
    await registration.destroy();
    
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling registration', error: error.message });
  }
};
