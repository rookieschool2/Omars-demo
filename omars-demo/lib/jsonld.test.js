const test = require('node:test');
const assert = require('node:assert');
const { buildRestaurantJsonLd } = require('./jsonld');

test('emits a schema.org Restaurant with core local-business fields', () => {
  const d = buildRestaurantJsonLd();
  assert.equal(d['@context'], 'https://schema.org');
  assert.equal(d['@type'], 'Restaurant');
  assert.equal(d.name, "Omar's Fresh Seafood & Steaks");
  assert.equal(d.url, 'https://omarsrestaurant.com');
  assert.equal(d.telephone, '+1-541-482-1281');
  assert.equal(d.address['@type'], 'PostalAddress');
  assert.equal(d.address.streetAddress, '1380 Siskiyou Blvd');
  assert.equal(d.address.addressLocality, 'Ashland');
  assert.equal(d.address.addressCountry, 'US');
  assert.equal(d.geo['@type'], 'GeoCoordinates');
  assert.equal(d.hasMenu, 'https://omarsrestaurant.com/menus');
  assert.equal(d.acceptsReservations, 'https://omarsrestaurant.com/reserve');
  assert.equal(d.foundingDate, '1946');
});

test('opening hours cover all seven days', () => {
  const spec = buildRestaurantJsonLd().openingHoursSpecification;
  assert.equal(spec.length, 1);
  assert.equal(spec[0].dayOfWeek.length, 7);
  assert.equal(spec[0].opens, '11:00');
  assert.equal(spec[0].closes, '22:00');
});

test('sameAs lists both social profiles', () => {
  assert.deepEqual(buildRestaurantJsonLd().sameAs, [
    'https://www.facebook.com/omarsfreshseafoodsteaks/',
    'https://www.instagram.com/omarsrestaurant/',
  ]);
});

test('serializes to valid JSON', () => {
  assert.ok(JSON.parse(JSON.stringify(buildRestaurantJsonLd())));
});
