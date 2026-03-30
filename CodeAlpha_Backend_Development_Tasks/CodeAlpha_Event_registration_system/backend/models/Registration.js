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
  }
});

Event.hasMany(Registration, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Registration.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = Registration;
