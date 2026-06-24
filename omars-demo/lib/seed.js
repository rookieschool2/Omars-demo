const { addMenuItem, addSpecial, addWineItem, getMenuItems } = require('./queries');

function seed() {
  if (getMenuItems().length > 0) {
    console.log('Already seeded, skipping.');
    return;
  }

  const menuItems = [
    ['Steaks', 'Hand-Cut Ribeye (14oz)', 'Dry-aged 6 weeks, char-grilled', 48],
    ['Steaks', 'Filet Mignon (8oz)', 'Center-cut, dry-aged 6 weeks', 46],
    ['Steaks', 'New York Strip (12oz)', 'Dry-aged 6 weeks', 42],
    ['Seafood', 'Fresh Catch of the Day', 'Delivered fresh, market price', 38],
    ['Seafood', 'Grilled Salmon', 'Wild-caught, lemon-butter sauce', 32],
    ['Seafood', 'Jumbo Prawns', 'Garlic butter, fresh herbs', 34],
    ['Appetizers', 'French Onion Soup', 'Made from scratch daily', 11],
    ['Appetizers', "Omar's Salad", 'House dressing, made from scratch', 9],
    ['Sides', 'Garlic Mashed Potatoes', '', 8],
    ['Sides', 'Grilled Asparagus', '', 9],
    ['Desserts', 'New York Cheesecake', '', 10],
  ];
  for (const [category, name, description, price] of menuItems) {
    addMenuItem({ category, name, description, price });
  }

  addSpecial({
    name: "Chef's Surf & Turf",
    description: '8oz filet + jumbo prawns, served with seasonal vegetables',
    price: 56,
    activeRange: 'This week',
  });

  const wines = [
    ['Red', 'Oregon Pinot Noir', 'Willamette Valley', 14],
    ['Red', 'Cabernet Sauvignon', 'Napa Valley', 16],
    ['White', 'Chardonnay', 'Buttery, oak-aged', 12],
    ['White', 'Sauvignon Blanc', 'Crisp, citrus notes', 11],
  ];
  for (const [category, name, description, price] of wines) {
    addWineItem({ category, name, description, price });
  }

  console.log('Seed complete.');
}

seed();
