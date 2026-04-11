const { MenuItem, DiningTable, InventoryItem } = require("./models");

async function seedData() {
  const menuCount = await MenuItem.count();
  if (menuCount > 0) {
    return;
  }

  const menuItems = await MenuItem.bulkCreate([
    { name: "Margherita Pizza", description: "Classic cheese and tomato", price: 12.5, category: "Main" },
    { name: "Veg Burger", description: "Grilled patty with lettuce", price: 8.0, category: "Main" },
    { name: "Pasta Alfredo", description: "Creamy white sauce pasta", price: 10.5, category: "Main" },
    { name: "Lemonade", description: "Fresh lemon drink", price: 3.0, category: "Beverage" },
  ]);

  await DiningTable.bulkCreate([
    { tableNumber: "T1", capacity: 2 },
    { tableNumber: "T2", capacity: 4 },
    { tableNumber: "T3", capacity: 4 },
    { tableNumber: "T4", capacity: 6 },
  ]);

  await InventoryItem.bulkCreate(
    menuItems.map((item) => ({
      menuItemId: item.id,
      quantityInStock: 40,
      reorderLevel: 10,
      unit: "portion",
    }))
  );
}

module.exports = seedData;
