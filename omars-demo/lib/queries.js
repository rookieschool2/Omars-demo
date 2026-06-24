const db = require('./db');

function getMenuItems() {
  return db.prepare('SELECT * FROM menu_items ORDER BY category, name').all();
}
function addMenuItem({ category, name, description, price }) {
  const result = db
    .prepare('INSERT INTO menu_items (category, name, description, price) VALUES (?, ?, ?, ?)')
    .run(category, name, description, price);
  return result.lastInsertRowid;
}
function updateMenuItem(id, { category, name, description, price }) {
  db.prepare(
    'UPDATE menu_items SET category = ?, name = ?, description = ?, price = ? WHERE id = ?'
  ).run(category, name, description, price, id);
}
function deleteMenuItem(id) {
  db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
}

function getSpecials() {
  return db.prepare('SELECT * FROM specials ORDER BY id').all();
}
function addSpecial({ name, description, price, activeRange }) {
  const result = db
    .prepare('INSERT INTO specials (name, description, price, active_range) VALUES (?, ?, ?, ?)')
    .run(name, description, price, activeRange);
  return result.lastInsertRowid;
}
function updateSpecial(id, { name, description, price, activeRange }) {
  db.prepare(
    'UPDATE specials SET name = ?, description = ?, price = ?, active_range = ? WHERE id = ?'
  ).run(name, description, price, activeRange, id);
}
function deleteSpecial(id) {
  db.prepare('DELETE FROM specials WHERE id = ?').run(id);
}

function getWineList() {
  return db.prepare('SELECT * FROM wine_list ORDER BY category, name').all();
}
function addWineItem({ category, name, description, price }) {
  const result = db
    .prepare('INSERT INTO wine_list (category, name, description, price) VALUES (?, ?, ?, ?)')
    .run(category, name, description, price);
  return result.lastInsertRowid;
}
function updateWineItem(id, { category, name, description, price }) {
  db.prepare(
    'UPDATE wine_list SET category = ?, name = ?, description = ?, price = ? WHERE id = ?'
  ).run(category, name, description, price, id);
}
function deleteWineItem(id) {
  db.prepare('DELETE FROM wine_list WHERE id = ?').run(id);
}

function createReservation({ name, contact, date, time, partySize, notes }) {
  const result = db
    .prepare(
      'INSERT INTO reservations (name, contact, date, time, party_size, notes) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(name, contact, date, time, partySize, notes || '');
  return result.lastInsertRowid;
}

function createOrder({ customerName, contact, items, total }) {
  const result = db
    .prepare('INSERT INTO orders (customer_name, contact, items, total) VALUES (?, ?, ?, ?)')
    .run(customerName, contact, JSON.stringify(items), total);
  return result.lastInsertRowid;
}
function getOrderById(id) {
  return db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
}

function createContactSubmission({ name, contact, subject, message }) {
  const result = db
    .prepare(
      'INSERT INTO contact_submissions (name, contact, subject, message) VALUES (?, ?, ?, ?)'
    )
    .run(name, contact, subject || '', message);
  return result.lastInsertRowid;
}

function createNewsletterSignup({ email }) {
  const result = db.prepare('INSERT INTO newsletter_signups (email) VALUES (?)').run(email);
  return result.lastInsertRowid;
}

module.exports = {
  getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem,
  getSpecials, addSpecial, updateSpecial, deleteSpecial,
  getWineList, addWineItem, updateWineItem, deleteWineItem,
  createReservation,
  createOrder, getOrderById,
  createContactSubmission,
  createNewsletterSignup,
};
