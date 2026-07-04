const { BUSINESS } = require('./business');

function buildRestaurantJsonLd() {
  const b = BUSINESS;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: b.name,
    url: b.siteUrl,
    telephone: b.phone,
    email: b.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      addressRegion: b.address.state,
      postalCode: b.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: b.geo.lat,
      longitude: b.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: b.hours.opens,
        closes: b.hours.closes,
      },
    ],
    servesCuisine: b.cuisines,
    priceRange: b.priceRange,
    foundingDate: b.foundingDate,
    hasMenu: `${b.siteUrl}/menus`,
    acceptsReservations: `${b.siteUrl}/reserve`,
    image: `${b.siteUrl}/site-assets/bk-home.jpg`,
    logo: `${b.siteUrl}/site-assets/logo.png`,
    sameAs: [b.social.facebook, b.social.instagram],
  };
}

module.exports = { buildRestaurantJsonLd };
