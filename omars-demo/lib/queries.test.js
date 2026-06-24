const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const TEST_DB_PATH = path.join(__dirname, '..', 'data', 'test.db');
process.env.OMARS_DB_PATH = TEST_DB_PATH;

// db.js opens a single connection cached by require() — deleting the file
// between tests wouldn't reset it, so clear tables on the live connection.
test.beforeEach(() => {
  const db = require('./db');
  db.exec(`
    DELETE FROM menu_items;
    DELETE FROM specials;
    DELETE FROM wine_list;
    DELETE FROM reservations;
    DELETE FROM orders;
    DELETE FROM contact_submissions;
    DELETE FROM newsletter_signups;
  `);
});

test.after(() => {
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
});

test('addMenuItem then getMenuItems returns the item', () => {
  const { addMenuItem, getMenuItems } = require('./queries');
  addMenuItem({ category: 'Steaks', name: 'Ribeye', description: '14oz, hand-cut', price: 48 });
  const items = getMenuItems();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].name, 'Ribeye');
  assert.strictEqual(items[0].price, 48);
});

test('updateMenuItem changes the stored row', () => {
  const { addMenuItem, updateMenuItem, getMenuItems } = require('./queries');
  const id = addMenuItem({ category: 'Steaks', name: 'Ribeye', description: '14oz', price: 48 });
  updateMenuItem(id, { category: 'Steaks', name: 'Ribeye', description: '16oz', price: 52 });
  const items = getMenuItems();
  assert.strictEqual(items[0].description, '16oz');
  assert.strictEqual(items[0].price, 52);
});

test('deleteMenuItem removes the row', () => {
  const { addMenuItem, deleteMenuItem, getMenuItems } = require('./queries');
  const id = addMenuItem({ category: 'Steaks', name: 'Ribeye', description: '14oz', price: 48 });
  deleteMenuItem(id);
  assert.strictEqual(getMenuItems().length, 0);
});

test('createReservation stores a reservation', () => {
  const { createReservation } = require('./queries');
  const id = createReservation({
    name: 'Jane Doe',
    contact: 'jane@example.com',
    date: '2026-07-01',
    time: '19:00',
    partySize: 4,
    notes: 'Window seat please',
  });
  assert.ok(id > 0);
});

test('createOrder stores items as retrievable JSON', () => {
  const { createOrder, getOrderById } = require('./queries');
  const id = createOrder({
    customerName: 'Jane Doe',
    contact: 'jane@example.com',
    items: [{ name: 'Ribeye', qty: 1, price: 48 }],
    total: 48,
  });
  const order = getOrderById(id);
  assert.strictEqual(order.total, 48);
  assert.deepStrictEqual(JSON.parse(order.items), [{ name: 'Ribeye', qty: 1, price: 48 }]);
});
