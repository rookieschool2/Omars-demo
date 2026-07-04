import { BUSINESS } from '@/lib/business';

const ROUTES = [
  '',
  '/menus',
  '/specials',
  '/wine-list',
  '/about',
  '/catering',
  '/events',
  '/contact',
  '/order',
  '/reserve',
  '/store',
];

export default function sitemap() {
  return ROUTES.map((route) => ({
    url: route === '' ? `${BUSINESS.siteUrl}/` : `${BUSINESS.siteUrl}${route}`,
    ...(route === '/specials' ? { lastModified: new Date() } : {}),
    changeFrequency: route === '/specials' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
