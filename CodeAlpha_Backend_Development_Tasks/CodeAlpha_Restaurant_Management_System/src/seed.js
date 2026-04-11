const { MenuItem, DiningTable, InventoryItem } = require("./models");

async function seedData() {
  const menuCount = await MenuItem.count();
  if (menuCount > 0) {
    return;
  }

    const menuItems = await MenuItem.bulkCreate([
      { name: "Paneer Tikka Masala", description: "Cottage cheese in rich creamy tomato gravy", price: 350.0, category: "Main" },
      { name: "Murgh Makhani (Butter Chicken)", description: "Tender chicken simmered in creamy buttery sauce", price: 420.0, category: "Main" },
      { name: "Hyderabadi Dum Biryani", description: "Aromatic basmati rice cooked with perfectly spiced mutton", price: 550.0, category: "Main" },
      { name: "Garlic Butter Naan", description: "Traditional Indian flatbread baked in a tandoor", price: 75.0, category: "Side" },
      { name: "Mango Lassi", description: "Refreshing sweet mango and yogurt summer drink", price: 120.0, category: "Beverage" },
      { name: "Kesari Rasmalai", description: "Soft cheese patties in saffron-infused chilled milk", price: 180.0, category: "Dessert" }
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
