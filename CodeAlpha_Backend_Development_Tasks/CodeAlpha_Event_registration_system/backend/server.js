require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/auth', authRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Sync DB and Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
  console.log('Database synced');

  // Create default admin user if it doesn't exist
  const adminEmail = 'admin@eventhub.com';
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await User.create({
      email: adminEmail,
      password: 'password123',
      role: 'admin'
    });
    console.log('Default admin user created.');
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to sync database:', err);
});
