const sequelize = require("../config/db");
const createMenuItem = require("./menuItem");
const createDiningTable = require("./table");
const createReservation = require("./reservation");
const createOrder = require("./order");
const createOrderItem = require("./orderItem");
const createInventoryItem = require("./inventoryItem");

const MenuItem = createMenuItem(sequelize);
const DiningTable = createDiningTable(sequelize);
const Reservation = createReservation(sequelize);
const Order = createOrder(sequelize);
const OrderItem = createOrderItem(sequelize);
const InventoryItem = createInventoryItem(sequelize);

DiningTable.hasMany(Order, { foreignKey: "tableId" });
Order.belongsTo(DiningTable, { foreignKey: "tableId" });

DiningTable.hasMany(Reservation, { foreignKey: "tableId" });
Reservation.belongsTo(DiningTable, { foreignKey: "tableId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

MenuItem.hasMany(OrderItem, { foreignKey: "menuItemId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

MenuItem.hasOne(InventoryItem, { foreignKey: "menuItemId", onDelete: "CASCADE" });
InventoryItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

module.exports = {
  sequelize,
  MenuItem,
  DiningTable,
  Reservation,
  Order,
  OrderItem,
  InventoryItem,
};
