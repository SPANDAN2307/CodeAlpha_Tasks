const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('./Event');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  eventId: {
    type: DataTypes.UUID,
    references: {
      model: Event,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Reference to the table name since we might require User later to avoid circular dependency
      key: 'id'
    }
  }
});

Event.hasMany(Registration, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Registration.belongsTo(Event, { foreignKey: 'eventId' });

// We'll define User association in a separate index.js or just loosely here 
// since we don't want circular require. For now, we'll just require User.
const User = require('./User');
User.hasMany(Registration, { foreignKey: 'userId', onDelete: 'CASCADE' });
Registration.belongsTo(User, { foreignKey: 'userId' });

module.exports = Registration;
