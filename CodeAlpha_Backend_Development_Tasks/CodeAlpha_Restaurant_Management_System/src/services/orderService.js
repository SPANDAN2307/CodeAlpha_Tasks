const { sequelize, Order, OrderItem, MenuItem, InventoryItem } = require("../models");

async function placeOrder(payload) {
  const { tableId = null, type = "dine_in", customerName = null, items = [] } = payload;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  return sequelize.transaction(async (transaction) => {
    const menuIds = items.map((item) => item.menuItemId);
    const menuItems = await MenuItem.findAll({
      where: { id: menuIds },
      include: [{ model: InventoryItem }],
      transaction,
    });

    if (menuItems.length !== menuIds.length) {
      throw new Error("One or more menu items are invalid.");
    }

    const menuById = new Map(menuItems.map((item) => [item.id, item]));
    let total = 0;

    for (const orderItem of items) {
      const menuItem = menuById.get(orderItem.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        throw new Error(`Menu item ${orderItem.menuItemId} is not available.`);
      }

      const inventory = menuItem.InventoryItem;
      if (!inventory || inventory.quantityInStock < orderItem.quantity) {
        throw new Error(`Insufficient stock for ${menuItem.name}.`);
      }
    }

    const order = await Order.create(
      {
        tableId,
        type,
        customerName,
        status: "pending",
      },
      { transaction }
    );

    for (const orderItem of items) {
      const menuItem = menuById.get(orderItem.menuItemId);
      const lineTotal = Number(menuItem.price) * orderItem.quantity;
      total += lineTotal;

      await OrderItem.create(
        {
          orderId: order.id,
          menuItemId: menuItem.id,
          quantity: orderItem.quantity,
          unitPrice: menuItem.price,
          lineTotal,
        },
        { transaction }
      );

      await menuItem.InventoryItem.update(
        {
          quantityInStock: menuItem.InventoryItem.quantityInStock - orderItem.quantity,
        },
        { transaction }
      );
    }

    await order.update({ totalAmount: total }, { transaction });

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [MenuItem] }],
      transaction,
    });

    return fullOrder;
  });
}

module.exports = {
  placeOrder,
};
