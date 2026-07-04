const test = require('node:test');
const assert = require('node:assert');
const { BUSINESS } = require('./business');

test('siteUrl is https with no trailing slash', () => {
  assert.match(BUSINESS.siteUrl, /^https:\/\//);
  assert.ok(!BUSINESS.siteUrl.endsWith('/'));
});

test('NAP matches the live business facts', () => {
  assert.equal(BUSINESS.address.street, '1380 Siskiyou Blvd');
  assert.equal(BUSINESS.address.city, 'Ashland');
  assert.equal(BUSINESS.address.state, 'OR');
  assert.equal(BUSINESS.address.zip, '97520');
  assert.equal(BUSINESS.phone, '+1-541-482-1281');
  assert.equal(BUSINESS.email, 'omarsrestaurant@gmail.com');
});

test('geo is at the Ashland location', () => {
  assert.ok(Math.abs(BUSINESS.geo.lat - 42.18553) < 0.001);
  assert.ok(Math.abs(BUSINESS.geo.lng - -122.69215) < 0.001);
});

test('hours cover open to close', () => {
  assert.equal(BUSINESS.hours.opens, '11:00');
  assert.equal(BUSINESS.hours.closes, '22:00');
});
