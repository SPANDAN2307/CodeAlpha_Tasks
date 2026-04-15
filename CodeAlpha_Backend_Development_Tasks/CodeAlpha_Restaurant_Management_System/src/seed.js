const { MenuItem, DiningTable, InventoryItem, Rating } = require("./models");

async function seedData() {
  const menuCount = await MenuItem.count();
  if (menuCount > 0) {
    return;
  }

  console.log("🌱 Seeding database with Indian cuisine menu...");

  const menuItems = await MenuItem.bulkCreate([
    // ── Starters ──
    {
      name: "Paneer Tikka",
      description: "Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions",
      price: 280.0,
      category: "Starters",
      isVeg: true,
      preparationTime: 20,
      rating: 4.5,
      ratingCount: 12,
      imageUrl: null,
    },
    {
      name: "Chicken Malai Tikka",
      description: "Creamy and tender chicken pieces marinated in cheese and cream, grilled to perfection",
      price: 350.0,
      category: "Starters",
      isVeg: false,
      preparationTime: 25,
      rating: 4.7,
      ratingCount: 18,
      imageUrl: null,
    },
    {
      name: "Veg Spring Rolls",
      description: "Crispy golden rolls stuffed with mixed vegetables and glass noodles",
      price: 220.0,
      category: "Starters",
      isVeg: true,
      preparationTime: 15,
      rating: 4.2,
      ratingCount: 8,
      imageUrl: null,
    },
    {
      name: "Mutton Seekh Kebab",
      description: "Minced mutton skewers with aromatic spices, chargrilled on open flame",
      price: 420.0,
      category: "Starters",
      isVeg: false,
      preparationTime: 30,
      rating: 4.6,
      ratingCount: 14,
      imageUrl: null,
    },

    // ── Main Course ──
    {
      name: "Paneer Tikka Masala",
      description: "Cottage cheese in rich creamy tomato gravy with aromatic spices",
      price: 350.0,
      category: "Main Course",
      isVeg: true,
      preparationTime: 25,
      rating: 4.4,
      ratingCount: 22,
      imageUrl: null,
    },
    {
      name: "Butter Chicken",
      description: "Tender chicken simmered in velvety tomato-butter sauce with fenugreek",
      price: 420.0,
      category: "Main Course",
      isVeg: false,
      preparationTime: 30,
      rating: 4.8,
      ratingCount: 35,
      imageUrl: null,
    },
    {
      name: "Dal Makhani",
      description: "Slow-cooked black lentils in a rich creamy buttery gravy",
      price: 280.0,
      category: "Main Course",
      isVeg: true,
      preparationTime: 35,
      rating: 4.5,
      ratingCount: 20,
      imageUrl: null,
    },
    {
      name: "Lamb Rogan Josh",
      description: "Kashmiri-style lamb curry with yogurt and aromatic whole spices",
      price: 520.0,
      category: "Main Course",
      isVeg: false,
      preparationTime: 40,
      rating: 4.6,
      ratingCount: 16,
      imageUrl: null,
    },

    // ── Biryani ──
    {
      name: "Hyderabadi Dum Biryani",
      description: "Aromatic basmati rice layered with perfectly spiced mutton, slow-cooked in dum style",
      price: 550.0,
      category: "Biryani",
      isVeg: false,
      preparationTime: 45,
      rating: 4.9,
      ratingCount: 42,
      imageUrl: null,
    },
    {
      name: "Chicken Biryani",
      description: "Fragrant rice layered with succulent chicken pieces and saffron",
      price: 450.0,
      category: "Biryani",
      isVeg: false,
      preparationTime: 40,
      rating: 4.7,
      ratingCount: 30,
      imageUrl: null,
    },
    {
      name: "Veg Biryani",
      description: "Garden-fresh vegetables layered with fragrant basmati rice and mint",
      price: 320.0,
      category: "Biryani",
      isVeg: true,
      preparationTime: 35,
      rating: 4.3,
      ratingCount: 15,
      imageUrl: null,
    },

    // ── Breads ──
    {
      name: "Garlic Butter Naan",
      description: "Soft tandoori flatbread brushed with garlic-infused butter",
      price: 75.0,
      category: "Breads",
      isVeg: true,
      preparationTime: 10,
      rating: 4.6,
      ratingCount: 25,
      imageUrl: null,
    },
    {
      name: "Cheese Stuffed Kulcha",
      description: "Flaky bread stuffed with melted cheese and herbs, baked in tandoor",
      price: 120.0,
      category: "Breads",
      isVeg: true,
      preparationTime: 12,
      rating: 4.4,
      ratingCount: 10,
      imageUrl: null,
    },
    {
      name: "Laccha Paratha",
      description: "Multi-layered flaky whole wheat bread with crispy texture",
      price: 65.0,
      category: "Breads",
      isVeg: true,
      preparationTime: 10,
      rating: 4.3,
      ratingCount: 9,
      imageUrl: null,
    },

    // ── Desserts ──
    {
      name: "Gulab Jamun",
      description: "Soft golden dumplings soaked in rose-cardamom sugar syrup",
      price: 150.0,
      category: "Desserts",
      isVeg: true,
      preparationTime: 10,
      rating: 4.7,
      ratingCount: 28,
      imageUrl: null,
    },
    {
      name: "Kesari Rasmalai",
      description: "Soft cheese patties in saffron-infused chilled milk with pistachios",
      price: 180.0,
      category: "Desserts",
      isVeg: true,
      preparationTime: 10,
      rating: 4.8,
      ratingCount: 20,
      imageUrl: null,
    },
    {
      name: "Brownie with Ice Cream",
      description: "Warm chocolate brownie served with vanilla ice cream and chocolate sauce",
      price: 250.0,
      category: "Desserts",
      isVeg: true,
      preparationTime: 12,
      rating: 4.5,
      ratingCount: 17,
      imageUrl: null,
    },

    // ── Beverages ──
    {
      name: "Mango Lassi",
      description: "Refreshing sweet mango and yogurt smoothie, a summer favourite",
      price: 120.0,
      category: "Beverages",
      isVeg: true,
      preparationTime: 5,
      rating: 4.6,
      ratingCount: 22,
      imageUrl: null,
    },
    {
      name: "Masala Chai",
      description: "Traditional Indian spiced tea with ginger, cardamom and cinnamon",
      price: 60.0,
      category: "Beverages",
      isVeg: true,
      preparationTime: 5,
      rating: 4.4,
      ratingCount: 18,
      imageUrl: null,
    },
    {
      name: "Fresh Lime Soda",
      description: "Zesty lime squeezed with soda water, served sweet or salted",
      price: 80.0,
      category: "Beverages",
      isVeg: true,
      preparationTime: 5,
      rating: 4.2,
      ratingCount: 12,
      imageUrl: null,
    },
    {
      name: "Cold Coffee",
      description: "Chilled creamy coffee blended with vanilla ice cream",
      price: 150.0,
      category: "Beverages",
      isVeg: true,
      preparationTime: 5,
      rating: 4.5,
      ratingCount: 15,
      imageUrl: null,
    },
  ]);

  // Seed dining tables
  await DiningTable.bulkCreate([
    { tableNumber: "T1", capacity: 2 },
    { tableNumber: "T2", capacity: 2 },
    { tableNumber: "T3", capacity: 4 },
    { tableNumber: "T4", capacity: 4 },
    { tableNumber: "T5", capacity: 6 },
    { tableNumber: "T6", capacity: 6 },
    { tableNumber: "T7", capacity: 8 },
    { tableNumber: "T8", capacity: 10 },
  ]);

  // Seed inventory
  await InventoryItem.bulkCreate(
    menuItems.map((item) => ({
      menuItemId: item.id,
      quantityInStock: Math.floor(Math.random() * 30) + 20,
      reorderLevel: 10,
      unit: "portion",
    }))
  );

  // Seed some sample ratings
  const sampleRatings = [];
  const reviewNames = ["Rahul S.", "Priya M.", "Amit K.", "Sneha R.", "Vikram J.", "Ananya D."];
  const goodReviews = [
    "Absolutely delicious! Will order again.",
    "Great flavors, authentic taste!",
    "Best I've had in a long time.",
    "Perfectly cooked and well presented.",
    "Amazing taste, highly recommended!",
    "Loved every bite of this dish.",
  ];

  for (const item of menuItems) {
    const numRatings = Math.min(item.ratingCount, 3);
    for (let i = 0; i < numRatings; i++) {
      sampleRatings.push({
        menuItemId: item.id,
        score: Math.floor(Math.random() * 2) + 4, // 4 or 5
        customerName: reviewNames[i % reviewNames.length],
        review: goodReviews[i % goodReviews.length],
      });
    }
  }
  await Rating.bulkCreate(sampleRatings);

  console.log(`✅ Seeded ${menuItems.length} menu items, 8 tables, and ${sampleRatings.length} ratings`);
}

module.exports = seedData;
