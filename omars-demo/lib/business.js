// Single source of truth for Omar's business facts (NAP, hours, links).
// Consumed by JSON-LD, metadata, Footer, and the Contact page.
const BUSINESS = {
  name: "Omar's Fresh Seafood & Steaks",
  siteUrl: 'https://omarsrestaurant.com',
  phone: '+1-541-482-1281',
  phoneDisplay: '541.482.1281',
  email: 'omarsrestaurant@gmail.com',
  address: {
    street: '1380 Siskiyou Blvd',
    city: 'Ashland',
    state: 'OR',
    zip: '97520',
  },
  geo: { lat: 42.18553, lng: -122.69215 },
  hours: { opens: '11:00', closes: '22:00' },
  priceRange: '$$',
  cuisines: ['Seafood', 'Steakhouse', 'American'],
  foundingDate: '1946',
  social: {
    facebook: 'https://www.facebook.com/omarsfreshseafoodsteaks/',
    instagram: 'https://www.instagram.com/omarsrestaurant/',
  },
};

module.exports = { BUSINESS };
