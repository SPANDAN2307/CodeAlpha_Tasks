const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: Registration, attributes: ['id'] }]
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Calculate remaining spots
    const registrationsCount = event.Registrations ? event.Registrations.length : 0;
    const remainingSpots = event.capacity - registrationsCount;
    
    res.json({ ...event.toJSON(), remainingSpots, registrationsCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// Create new event (Admin or open)
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error: error.message });
  }
};
