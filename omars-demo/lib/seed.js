const { addMenuItem, addSpecial, addWineItem, getMenuItems } = require('./queries');

// Sourced from Omar's actual current menu/wine PDFs (omarsrestaurant.com/menus),
// dated 6.27.24 (menu) and 8.22.23 (wine). Prices subject to change without notice.
function seed() {
  if (getMenuItems().length > 0) {
    console.log('Already seeded, skipping.');
    return;
  }

  const menuItems = [
    ['Steaks', 'New York Strip', 'Full flavored and well marbled, grilled to your liking, served with fresh sautéed seasonal vegetables and choice of baked potato or garlic whipped potatoes. 10oz.', 37],
    ['Steaks', 'Filet Mignon', 'A thick and very tender cut with port demi-glace, served with fresh sautéed seasonal vegetables and choice of baked potato or garlic whipped potatoes. 7.5oz.', 45],

    ['Seafood Specialties', 'Fish & Chips', "Fresh Oregon snapper in Omar's beer batter, served with coleslaw and steak fries.", 20],
    ['Seafood Specialties', 'Shrimp Tempura', 'Shrimp, mushrooms, zucchini, in a crispy egg batter served with teriyaki and cocktail sauce, with fresh sautéed seasonal vegetables. Choice of baked potato or garlic whipped potatoes.', 27],
    ['Seafood Specialties', 'Oysters & Shrimp', "Can't pick a favorite? Have both — 3 shrimp tempura and 3 fresh Pacific oysters, served with teriyaki, cocktail, and tartar sauce with fresh sautéed seasonal vegetables and choice of baked potato or garlic whipped potatoes.", 30],
    ['Seafood Specialties', 'Snapper Parmesan', 'Topped with lemon-caper butter, fresh sautéed vegetables, and choice of baked potato or garlic whipped potatoes.', 25],
    ['Seafood Specialties', 'Fresh Pacific Oysters', 'Rolled in cracker meal and fried, served with tartar sauce, fresh sautéed seasonal vegetables, and choice of baked potato or garlic whipped potatoes.', 33],

    ['Favorites & Classics', 'Traditional Pork Chop & Apples', 'Sweet and tangy pork chops served with savory apple sauce, garlic whipped potatoes, and fresh sautéed vegetables.', 25],
    ['Favorites & Classics', 'Jerked Chicken', 'Boneless thigh with a spicy jerk rub, served atop creamy fettuccine with sun-dried tomatoes, bell peppers, fresh sautéed vegetables, and Jamaican spices.', 28],
    ['Favorites & Classics', 'Chicken Fried Steak', 'A tenderized beefsteak, double-dipped Texas style in flour, egg, and cream, topped with country gravy and garlic whipped potatoes, served with fresh sautéed vegetables.', 26],
    ['Favorites & Classics', 'Chicken Alfredo', 'Boneless thigh with roasted mushrooms, tomatoes, green onions, and fettuccine tossed together in a savory garlic cream sauce with fresh sautéed vegetables.', 26],

    ['Appetizers', 'Zucchini Fingers', 'Fresh-cut and fried in a light, flaky beer and buttermilk batter.', 12],
    ["Appetizers", "Big O's", "A basket of our famous, sweet yellow onions battered and fried crispy.", 12],
    ['Appetizers', 'Fresh Manila Steamer Clams', '3/4 pound of fresh Manila clams steamed with white wine, clam juice, garlic, fresh herbs, tomatoes, and a splash of cream.', 22],
    ['Appetizers', 'Butternut Squash Ravioli', 'Herb brown butter, balsamic reduction.', 12],
    ["Appetizers", "Omar's Shrimp Cocktail", 'Poached shrimp in an aromatic court bouillon, with a spicy cocktail sauce.', 17],
    ['Appetizers', 'Escargot in Mushroom Caps', 'Baked in a savory garlic herb butter and served with sourdough toast points.', 18],
    ['Appetizers', 'Fresh Oyster Shooter', 'One Willapa Bay oyster, served over cocktail sauce.', 4],
    ['Appetizers', 'Fried Brussels Sprouts', 'Fried golden brown, topped with a balsamic reduction and sea salt.', 16],
    ['Appetizers', 'Side of Bread', 'A demi-baguette lightly steamed, served with butter.', 4],

    ['Soups & Salads', 'Soup of the Day', 'Cup $7, bowl $8 — ask for our famous chowder (weekends only, Sat. & Sun., add 50¢).', 7],
    ['Soups & Salads', 'Classic Caesar Salad', 'A traditional Caesar with crisp romaine lettuce, croutons, Parmesan cheese, and our classic Caesar dressing. Add grilled chicken $3.50, add shrimp $12. Non-fat dressing available.', 15],

    ['Burgers & Sandwiches', 'Classic Hamburger', '1/3 pound of lean beef, charbroiled and served on a potato bun with lettuce, tomato, pickles, red onion, and mayo.', 14],
    ['Burgers & Sandwiches', 'Garden Burger', 'Three grain, black bean, quinoa veggie patty.', 13],
    ['Burgers & Sandwiches', 'Traditional Patty Melt', '6oz burger patty, thousand island dressing, melted Swiss cheese and sautéed onions, lightly grilled on rye bread.', 16],
    ['Burgers & Sandwiches', 'Smoked Chicken Burger', 'With Swiss cheese and bacon.', 14],
    ['Burgers & Sandwiches', 'Seaburger', 'Fresh Oregon snapper fillet, grilled.', 14],
    ["Burgers & Sandwiches", "Omar's High Stack BLT", 'The classic sandwich with crisp lettuce, tomato, plenty of bacon, and mayo; served on toasted sourdough.', 13],

    ['Desserts', "Omar's Famous Coupe Denmark", 'Our own warm Belgian bittersweet chocolate sauce, French vanilla ice cream, toasted almonds, whipped cream, and a French rolled wafer.', 10],
    ['Desserts', 'French Vanilla Ice Cream', '', 4],
  ];
  for (const [category, name, description, price] of menuItems) {
    addMenuItem({ category, name, description, price });
  }

  // Today's specials rotate daily and are managed live via the admin CMS —
  // this is a representative example, not a fixed menu.
  const specials = [
    ['Spinach & Artichoke Dip', 'House made, served with toasted crostini.', 15, "Today's Specials"],
    ['Oysters on the Half Shell', 'Served with mignonette sauce.', 18, "Today's Specials"],
    ['Smoked BBQ Brisket Sandwich', 'Thin-sliced 15hr smoked brisket smothered in our house-made BBQ sauce, served on a toasted baguette with steak fries.', 18, "Today's Specials"],
    ['Wild Alaskan Halibut Parmesan', 'Topped with lemon caper butter, served with seasonal vegetables and choice of garlic whipped potatoes or baked potato.', 38, "Today's Specials"],
  ];
  for (const [name, description, price, activeRange] of specials) {
    addSpecial({ name, description, price, activeRange });
  }

  const wines = [
    ['Champagne & Sparkling', 'Ruffino Prosecco', 'Italy, 375ml.', 15],
    ['Champagne & Sparkling', 'Moutard Grand Brut', 'Buxeuil, Champagne, France. Bottle $60.', 60],
    ['Champagne & Sparkling', 'Piper-Heidsieck Cuvée', 'Champagne, France. Bottle $65.', 65],

    ['Chardonnay', 'Roxy Ann', "2017, Rogue Valley, Southern Oregon. Glass $11, bottle $50.", 11],
    ['Chardonnay', 'Irvine Family Vineyards', '2017, Ashland, Rogue Valley, Southern Oregon. Bottle $55.', 55],

    ['Sauvignon Blanc', 'Kriselle Cellars', '2019, Rogue Valley, Southern Oregon. Glass $11, bottle $50.', 11],
    ['Sauvignon Blanc', 'Cade', '2019, Napa Valley, California. Bottle $54.', 54],

    ['Pinot Gris', 'King Estate', '2019, Eugene, Oregon. Glass $10, bottle $40.', 10],

    ['Rosé & Summertime Whites', 'Trium Grenache Rosé', '2018, Rogue Valley, Oregon. Glass $10, bottle $40.', 10],
    ['Rosé & Summertime Whites', 'Dr. Loosen Riesling', '2020, Germany. Glass $10, bottle $40.', 10],
    ['Rosé & Summertime Whites', 'Season Cellars Viognier', '2017, Rogue Valley, Oregon. Glass $10, bottle $40.', 10],

    ['Pinot Noir', 'Irvine & Roberts', '2017, Rogue Valley, Oregon. Glass $12, bottle $54.', 12],
    ['Pinot Noir', 'King Estate', '2015, Willamette Valley, Oregon. Bottle $55.', 55],
    ['Pinot Noir', 'Owen Roe "The Kilmore"', '2014, Yamhill-Carlton, Willamette Valley, Oregon. Bottle $59.', 59],

    ['Merlot', 'Pedroncelli', '2018, Sonoma County, California. Glass $10, bottle $40.', 10],
    ['Merlot', "L'Ecole No. 41", '2018, Columbia Valley, Washington. Bottle $50.', 50],
    ['Merlot', 'Plump Jack', '2016, Napa Valley, California. Bottle $110.', 110],

    ['Zinfandel', 'Peirano Estate Vineyards', '2018, Lodi, Central Valley, California. Glass $10, bottle $40.', 10],
    ['Zinfandel', 'Turley "Juvenile"', '2018, St. Helena, California. Bottle $45.', 45],

    ['Tempranillo', 'Dragonfly', '2017, Rogue Valley, Southern Oregon. Glass $10, bottle $40.', 10],
    ['Tempranillo', 'Kriselle Cellars', '2015, Rogue Valley, Southern Oregon. Bottle $48.', 48],
  ];
  for (const [category, name, description, price] of wines) {
    addWineItem({ category, name, description, price });
  }

  console.log('Seed complete.');
}

seed();
