const sequelize = require("../config/db");
const createMenuItem = require("./menuItem");
const createDiningTable = require("./table");
const createReservation = require("./reservation");
const createOrder = require("./order");
const createOrderItem = require("./orderItem");
const createInventoryItem = require("./inventoryItem");
const createRating = require("./rating");

const MenuItem = createMenuItem(sequelize);
const DiningTable = createDiningTable(sequelize);
const Reservation = createReservation(sequelize);
const Order = createOrder(sequelize);
const OrderItem = createOrderItem(sequelize);
const InventoryItem = createInventoryItem(sequelize);
const Rating = createRating(sequelize);

// Table <-> Order
DiningTable.hasMany(Order, { foreignKey: "tableId" });
Order.belongsTo(DiningTable, { foreignKey: "tableId" });

// Table <-> Reservation
DiningTable.hasMany(Reservation, { foreignKey: "tableId" });
Reservation.belongsTo(DiningTable, { foreignKey: "tableId" });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// MenuItem <-> OrderItem
MenuItem.hasMany(OrderItem, { foreignKey: "menuItemId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

// MenuItem <-> InventoryItem
MenuItem.hasOne(InventoryItem, { foreignKey: "menuItemId", onDelete: "CASCADE" });
InventoryItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

// MenuItem <-> Rating
MenuItem.hasMany(Rating, { foreignKey: "menuItemId", onDelete: "CASCADE" });
Rating.belongsTo(MenuItem, { foreignKey: "menuItemId" });

module.exports = {
  sequelize,
  MenuItem,
  DiningTable,
  Reservation,
  Order,
  OrderItem,
  InventoryItem,
  Rating,
};
